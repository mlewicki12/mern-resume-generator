
import fs from 'fs';
import config from 'config';
import { DocumentDefinition, UpdateQuery, QueryOptions } from 'mongoose';
import pdf from 'html-pdf';

import liquid from '../liquid';

import { LoadComponent, LoadTheme } from './themes.service';
import { HandleGenerate } from './generate.service';
import { ImportAssetFile } from './assets.service';

import { KeyValues, Theme, ThemeNode } from '../utilities/types';
import { FileExists } from '../utilities/functions';
import logger from '../utilities/logger';

import ResumeModel, { ResumeDocument } from '../models/resume.model';

export function GetDirectory(name: string) {
  return `public/resumes/${name}`;
}

export function CreateWorkDir(name: string) {
  return new Promise<void>((resolve, reject) => {
    const dir = GetDirectory(name);
    fs.mkdir(dir, err => {
      if(err) return reject('unable to create directory for resume');

      logger.info(`created working directory for ${name}`);
      resolve();
    })
  })
}

export function DeleteWorkingFiles(name: string) {
  // delete working liquid files
  fs.unlinkSync(`public/resumes/${name}/out.liquid`);
  FileExists(`resources/layouts/${name}.liquid`).then(exists => {
    if(!exists) return;

    fs.unlinkSync(`resources/layouts/${name}.liquid`);
  });
}

export function CleanWorkDir(name: string) {
  return new Promise<void>((resolve, reject) => {
    if(config.get('debug')) return resolve();

    const dir = GetDirectory(name);
    fs.rm(dir, {
      recursive: true,
      force: true
    }, (err) => {
      if(err) reject('unable to remove working directory');
      resolve();
    })
  })
}

export function ImportLayout(theme: Theme, name: string) {
  return new Promise<void>((resolve, reject) => {
    if(!theme.layout) return resolve();

    const path = `${theme.path}/${theme.layout}`;
    FileExists(path).then(exists => {
      if(!exists) return reject(`layout file not found for theme ${theme.name}`);

      fs.copyFile(path, `resources/layouts/${name}.liquid`, err => {
        if(err) return reject(err);
        resolve();
      });
    });
  });
}

export function UseLayout(name: string, data: string) {
  return new Promise<void>((resolve, reject) => {
    const dir = GetDirectory(name);

    fs.writeFile(`${dir}/out.liquid`, data, (err) => {
      if(err) return reject('unable to write file');

      liquid.renderFile(`${dir}/out.liquid`).then(render => {
        fs.writeFile(`${dir}/index.html`, render, (error) => {
          if(error) return reject('error writing final file');
          if(!config.get('debug')) DeleteWorkingFiles(name);

          resolve();
        });
      }).catch(error => reject('unable to render liquid file'));
    });
  })
}

export function GenerateComponent(component: ThemeNode, name: string, values: KeyValues<string>) {
  const dir = GetDirectory(name);
  return new Promise<string>((resolve, reject) => {
    const variables = Object.keys(values).map(key => {
      // means it's in the assets folder
      if(typeof values[key] === 'string' && values[key].startsWith('@asset:')) {
        const file = values[key].slice(7);
        ImportAssetFile(file, `${dir}`).catch(err => reject(err));

        return { key, value: file };
      } else {
        return { key, value: values[key] };
      }
    }).reduce((prev, next) => {
      prev[next.key] = next.value;
      return prev;
    }, {} as KeyValues<string>);

    liquid.parseAndRender(component.liquid, variables)
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
}

export async function CreateResume(input: DocumentDefinition<Omit<ResumeDocument, 'createdAt' | 'updatedAt'>>) {
  try {
    const resume = await ResumeModel.create(input);
    return resume.toJSON();
  } catch(err: any) {
    throw new Error(err);
  }
}

export async function GetResume(id: string) {
  try {
    const resume = await ResumeModel.findById(id);
    if(!resume) return undefined;

    return resume.toJSON();
  } catch(err: any) {
    throw new Error(err);
  }
}

export async function UpdateResume(id: string, update: UpdateQuery<ResumeDocument>, options: QueryOptions) {
  return ResumeModel.updateOne({ _id: id }, update, options);
}

export async function DeleteResume(id: string) {
  return ResumeModel.deleteOne({ _id: id });
}

export async function GetAllResumes() {
  try {
    const resumes = await ResumeModel.find({});
    if(!resumes) return [];

    return resumes;
  } catch(err: any) {
    throw new Error(err);
  }
}

export async function GenerateResume(id: string, theme: string = 'default') {
  const name = `${new Date().getTime()}`;

  let resume: ResumeDocument;
  try {
    resume = await ResumeModel.findById(id);

    if(!resume) return Promise.reject('unable to find resume');
  } catch(err: any) {
    return Promise.reject('unable to find resume');
  }

  // callback hell let's go
  return new Promise<string>((resolve, rej) => {
    // clean out all working files on error
    const reject = (reason: NodeJS.ErrnoException | string) =>
      config.get('debug')
      ? rej(reason)
      : CleanWorkDir(name).then(() => rej(reason));

    CreateWorkDir(name).then(() => {
      LoadTheme(theme ?? 'default').then(theme => {
        if(!theme) return reject(`couldn't load theme ${theme}`);
        if(!resume.components) return reject('no resume components provided');

        const generated = resume.components.map(item => {
          return new Promise<string>(async (genRes, genRej) => {
            if(!item.component || !theme.components[item.component]) return genRes(`<h1 style='color:red'>Invalid theme component ${item.component}</h1>`);

            if(!theme.components[item.component].liquid) {
              // await here so i don't have to retype load
              // maybe it's not a great model
              await LoadComponent(theme, item.component)
            }

            GenerateComponent(theme.components[item.component], name, item.variables)
            .then(genRes)
            .catch(genRej);
          });
        });

        Promise.all(generated).then(async data => {
          const output = data.reduce((prev, item) => {
            return prev + item;
          }, `{% layout '${theme.layout ? name : 'root'}.liquid' %}\n{% block content %}`) + '\n{% endblock %}';

          try {
            await ImportLayout(theme, name);
          } catch(err) {
            return reject(err);
          }

          UseLayout(name, output).then(() => {
            HandleGenerate(theme, name)
            .then(() => resolve(name))
            .catch(err => {
              // yeah im not happy with this either
              logger.error(err);
              return reject(err);
            });
          }).catch(err => {
            logger.error(err);
            return reject(err);
          });
        }).catch(err => {
          logger.error(err);
          return reject(err);
        });
      }).catch(err => {
        logger.error(err);
        return reject(`error loading theme ${theme}`)
      });
    }).catch(err => {
      logger.error(err);
      return reject('unable to create working directory');
    });
  });
}

export default {
  GetDirectory,
  CreateWorkDir,
  DeleteWorkingFiles,
  CleanWorkDir,
  ImportLayout,
  UseLayout,
  GenerateComponent,
  GetResume,
  UpdateResume,
  DeleteResume,
  GetAllResumes,
  GenerateResume
};