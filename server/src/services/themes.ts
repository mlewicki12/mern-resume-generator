
import yaml from 'js-yaml';
import fs from 'fs';

import { GenerateOperation, KeyValues, Theme, ThemeNode } from '../utilities/types';
import { RESOURCES } from '../utilities/constants';
import { getDir } from './resume';

const getThemeDir: (theme: string | Theme) => string = (theme) => {
  const name = typeof theme === 'string' ? theme : theme.name;
  return `${RESOURCES}/themes/${name}/`;
}

export const readThemes: () => Promise<string[]> = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(`${RESOURCES}/themes`, (err, data) => {
      if(err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

export const loadTheme: (name: string) => Promise<Theme> = (name) => {
  return new Promise((resolve, reject) => {
    const path = getThemeDir(name);
    fs.access(`${path}/theme.yaml`, fs.constants.F_OK, (err) => {
      if(err) {
        reject(err);
        return;
      }

      fs.readFile(`${path}/theme.yaml`, (err, data) => {
        if(err) {
          reject(err);
          return;
        }

        try {
          const theme = yaml.load(
            data.toString()
          ) as any;

          resolve({
            name,
            path,
            components: theme.components as KeyValues<ThemeNode>,
            types: theme.types,
            layout: theme.layout
          });
        } catch {
          reject(`unable to parse ${name} theme file`);
        }
      });
    });
  })
}

export const loadGenerate: (theme: string | Theme) => Promise<GenerateOperation[]> = (theme) => {
  return new Promise((resolve, reject) => {
    const path = getThemeDir(theme);

    fs.access(`${path}/generate.yaml`, fs.constants.F_OK, (err) => {
      if(err) {
        // if it doesn't exist it's not an error
        // just return an empty array
        resolve([]);
        return;
      }

      fs.readFile(`${path}/generate.yaml`, (err, data) => {
        if(err) {
          reject(err);
          return;
        }

        try {
          const loaded = yaml.load(
            data.toString()
          ) as GenerateOperation[];

          resolve(loaded);
        } catch {
          reject(`unable to parse ${name} theme file`);
        }
      });
    });
    return [];
  });
}

export const importThemeFile: (theme: string | Theme, file: string, dest: string) => Promise<void> = (theme, file, dest) => {
  return new Promise((resolve, reject) => {
    const path = getThemeDir(theme);

    fs.access(`${path}/${file}`, fs.constants.F_OK, (err) => {
      if(err) {
        reject(err);
        return;
      }

      // maybe i should check if the destination exists
      // but it shouldn't matter rn bc the only use
      // creates the dir for it and ensures it exists already
      fs.copyFile(`${path}/${file}`, `${dest}/${file}`, (err) => {
        if(err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  });
}

export const loadComponent: (theme: Theme, name: string) => Promise<string> = (theme, name) => {
  return new Promise((resolve, reject) => {
    fs.access(`${theme.path}/${name}.liquid`, fs.constants.F_OK, (err) => {
      if(err) {
        reject(err);
        return;
      }

      fs.readFile(`${theme.path}/${name}.liquid`, (err, data) => {
        // TODO: custom callback type to avoid having to type this shit
        if(err) {
          reject(err);
          return;
        }

        theme.components[name].liquid = data.toString();
        resolve(data.toString());
      });
    });
  });
}

export const handleThemeGenerate: (theme: Theme, name: string, resolve: (value: string | PromiseLike<string>) => void, reject: (reason?: any) => void) => void =
  (theme, name, resolve, reject) => {
    const dir = getDir(name);
    loadGenerate(theme)
      .then(data => {
        const steps: Promise<void>[] = data.map(step => {
          switch(step.op) {
            case 'import':
              return importThemeFile(theme, step.file, dir);

            default:
              console.warn(`unknown operation ${step.op}, skipping`);
              return Promise.resolve();
          }
        });

        Promise.all(steps)
          .then(() => resolve(`${name}`))
          .catch(err => reject(err));
      })
  }