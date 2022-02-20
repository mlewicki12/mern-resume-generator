
import fs from 'fs';
import yaml from 'js-yaml';

import ThemeService from './themes';
import { Theme, GenerateOperation } from '../utilities/types';
import { FileExists } from '../utilities/functions';
import CompileService from './compile';

/**
 * Service for dealing with theme generate files
 * Separated into its own file to avoid stuffing ThemesService
 */
const GenerateService = {
  // TODO: Learn JSDOC
  ParseGenerateFile(theme: string | Theme) {
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
  },
  
  HandleCompile(theme: string | Theme, dir: string, op: GenerateOperation) {
    return new Promise<void>((resolve, reject) => {
      const path = ThemeService.GetThemeDir(theme);

      FileExists(`${path}/${op.file}`).then(exists => {
        if(!exists) return reject(`unable to find file ${op.file} in theme ${ThemeService.GetThemeName(theme)}`);

        CompileService.Compile(`${path}/${op.file}`, op.from).then(result => {
          fs.writeFile(`${dir}/${op.out}`, result, (err) => {
            if(err) return reject(`unable to write to file ${op.out}`);

            resolve();
          })
        }).catch(err => reject(`unable to compile file ${op.file} from theme ${ThemeService.GetThemeName(theme)}`))
      });
    });
  },

  Handle(theme: Theme, name: string) {
    return new Promise<void>((resolve, reject) => {
      GenerateService.ParseGenerateFile(theme)
        .then(data => {
          const steps: Promise<void>[] = data.map(step => {
            switch(step.op) {
              case 'import':
                if(!step.file) return Promise.reject(`no file provided for import operation`);
                return ThemeService.ImportThemeFile(theme, step.file, '');

              case 'compile':
                // need more info here depending on which check failed
                if(!step.file || !step.from || !step.out) return Promise.reject(`no file provided for compile operation`);
                return GenerateService.HandleCompile(theme, '', step);

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
}

export default GenerateService;