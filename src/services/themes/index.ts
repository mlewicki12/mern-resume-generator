
import yaml from 'js-yaml';
import fs from 'fs';

import { KeyValues, Theme, ThemeNode } from '../../utilities/types';
import { RESOURCES } from '../../utilities/constants';

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
    // TODO: add file exists check
    const path = `${RESOURCES}/themes/${name}/`;
    fs.access(`${path}/theme.yaml`, fs.constants.F_OK, (err) => {
      if(err) {
        reject(err);
        console.error(err);
        return;
      }

      fs.readFile(`${path}/theme.yaml`, (err, data) => {
        if(err) {
          reject(err);
          console.error(err);
          return;
        }

        let theme: KeyValues<ThemeNode>;
        try {
          const loaded: any = yaml.load(
            data.toString()
          );

          theme = loaded as KeyValues<ThemeNode>;
        } catch {
          reject(`unable to parse ${name} theme file`);
        }

        resolve({
          name,
          path,
          components: theme
        });
      });
    });
  })
}