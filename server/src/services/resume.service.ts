
import fs from 'fs';

import liquid from '../liquid';

import ThemeService from './themes.service';
import GenerateService from './generate.service';
import AssetService from './assets.service';

import { KeyValues, ResumeRequest, Theme, ThemeNode } from '../utilities/types';
import { ASSETS, DEBUG } from '../utilities/constants';
import { FileExists } from '../utilities/functions';

export function GetDirectory(name: string) {
  return `public/resumes/${name}`;
}

export function CreateWorkDir(name: string) {
  return new Promise<void>((resolve, reject) => {
    const dir = GetDirectory(name);
    fs.mkdir(dir, err => {
      if(err) return reject('unable to create directory for resume');

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
    if(DEBUG) return resolve();

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
        fs.writeFile(`${dir}/index.html`, render, (err) => {
          if(err) return reject('error writing final file');
          if(!DEBUG) DeleteWorkingFiles(name);

          resolve();
        });
      }).catch(err => reject('unable to render liquid file'));
    });
  })
}

export function GenerateComponent(component: ThemeNode, name: string, values: KeyValues<string>) {
  const dir = GetDirectory(name);
  return new Promise<string>((resolve, reject) => {
    const variables = Object.keys(values).map(key => {
      // means it's in the assets folder
      if(values[key].startsWith('@asset:')) {
        const file = values[key].slice(7);
        AssetService.ImportAssetFile(file, `${dir}`).catch(err => reject(err));

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

export async function Generate(body: ResumeRequest) {
  const name = `${new Date().getTime()}`;

  // callback hell let's go
  return new Promise<string>((resolve, rej) => {
    // clean out all working files on error
    const reject = (reason: NodeJS.ErrnoException | string) =>
      DEBUG
      ? rej(reason)
      : CleanWorkDir(name).then(() => rej(reason));

    CreateWorkDir(name).then(() => {
      ThemeService.LoadTheme(body.theme ?? 'default').then(theme => {
        if(!theme) return reject(`couldn't load theme ${body.theme}`);
        if(!body.components) return reject('no resume components provided');

        const generated = body.components.map(item => {
          return new Promise<string>(async (genRes, genRej) => {
            if(!item.component || !theme.components[item.component]) return resolve(`<h1 style='color:red'>Invalid theme component ${item.component}</h1>`);

            if(!theme.components[item.component].liquid) {
              // await here so i don't have to retype load
              // maybe it's not a great model
              await ThemeService.LoadComponent(theme, item.component)
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
            GenerateService.Handle(theme, name)
            .then(() => resolve(name))
            .catch(err => reject(err));
          }).catch(err => reject(err));
        }).catch(err => reject(err));
      }).catch(err => reject(`error loading theme ${body.theme}`));
    }).catch(err => reject('unable to create working directory'));
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
  Generate
};