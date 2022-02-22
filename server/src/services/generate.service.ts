
import fs from 'fs';
import yaml from 'js-yaml';

import ThemeService from './themes.service';
import { Theme, GenerateOperation } from '../utilities/types';
import { FileExists } from '../utilities/functions';
import CompileService from './compile.service';
import ResumeService from './resume.service';

  // TODO: Learn JSDOC
export function ParseGenerateFile(theme: string | Theme) {
  return new Promise<GenerateOperation[]>((resolve, reject) => {
    const path = ThemeService.GetThemeDir(theme);

    FileExists(`${path}/generate.yaml`).then(exists => {
      // absence isn't an error, there's just nothing to do
      if(!exists) resolve([]);

      fs.readFile(`${path}/generate.yaml`, (err, data) => {
        if(err) reject(`unable to read generate.yaml for theme ${ThemeService.GetThemeName(theme)}`);

        try {
          const loaded = yaml.load(
            data.toString()
          ) as GenerateOperation[];

          resolve(loaded);
        } catch {
          reject(`unable to parse generate.yaml for theme ${ThemeService.GetThemeName(theme)}`);
        }
      });
    })
  });
}

export function HandleCompile(theme: string | Theme, name: string, op: GenerateOperation) {
  return new Promise<void>((resolve, reject) => {
    const path = ThemeService.GetThemeDir(theme);
    const outpath = ResumeService.GetDirectory(name);

    FileExists(`${path}/${op.file}`).then(exists => {
      if(!exists) return reject(`unable to find file ${op.file} in theme ${ThemeService.GetThemeName(theme)}`);

      CompileService.Compile(`${path}/${op.file}`, op.from).then(result => {
        fs.writeFile(`${outpath}/${op.out}`, result, (err) => {
          if(err) {
            console.error(err);
            return reject(`unable to write to file ${op.out}`);
          }

          resolve();
        })
      }).catch(err => reject(`unable to compile file ${op.file} from theme ${ThemeService.GetThemeName(theme)}`))
    });
  });
}

export function Handle(theme: Theme, name: string) {
  return new Promise<void>((resolve, reject) => {
    ParseGenerateFile(theme)
      .then(data => {
        const steps: Promise<void>[] = data.map(step => {
          switch(step.op) {
            case 'import':
              if(!step.file) return Promise.reject(`no file provided for import operation`);
              return ThemeService.ImportThemeFile(theme, step.file, name);

            case 'compile':
              // need more info here depending on which check failed
              if(!step.file || !step.from || !step.out) return Promise.reject(`no file provided for compile operation`);
              return HandleCompile(theme, name, step);

            default:
              return Promise.reject(`unknown operation ${step.op}`);
          }
        });

        Promise.all(steps)
          .then(() => resolve())
          .catch(err => reject(err));
      })
  });
}

export default {
  ParseGenerateFile,
  HandleCompile,
  Handle
};