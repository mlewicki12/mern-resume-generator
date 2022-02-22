
import fs from 'fs';
import yaml from 'js-yaml';
import config from 'config';

import { Theme } from '../utilities/types';
import { FileExists } from '../utilities/functions';

export function GetThemeName(theme: string | Theme) {
  return typeof theme === 'string' ? theme : theme.name;
}

export function GetThemeDir(theme: string | Theme) {
  const name = GetThemeName(theme);
  return `${config.get('resourcesDir')}/themes/${name}/`;
}

export function ReadThemes() {
  return new Promise<string[]>((resolve, reject) => {
    FileExists(`${config.get('resourcesDir')}/themes`).then(exists => {
      if(!exists) return resolve([]);

      fs.readdir(`${config.get('resourcesDir')}/themes`, (err, data) => {
        // reject here bc the directory exists
        if(err) return reject('unable to read themes directory');

        resolve(data);
      });
    })
  });
}

export function LoadTheme(name: string) {
  return new Promise<Theme>((resolve, reject) => {
    const path = GetThemeDir(name);
    FileExists(`${path}/theme.yaml`).then(exists => {
      if(!exists) return reject(`theme.yaml not found for theme ${name}`);

      fs.readFile(`${path}/theme.yaml`, (err, data) => {
        if(err) return reject(`unable to read theme.yaml for theme ${name}`);

        try {
          const theme = yaml.load(
            data.toString()
          ) as Theme;

          theme.name = name;
          theme.path = path;

          resolve(theme);
        } catch {
          reject(`unable to parse theme.yaml for theme ${name}`);
        }
      });
    });
  });
}

export function ImportThemeFile(theme: string | Theme, file: string, dest: string) {
  return new Promise<void>((resolve, reject) => {
    const path = GetThemeDir(theme);

    FileExists(`${path}/${file}`).then(exists => {
      if(!exists) return reject(`unable to find ${file} in theme ${GetThemeName(theme)}`);


      // maybe i should check if the destination exists
      // but it shouldn't matter rn bc the only use
      // creates the dir for it and ensures it exists already
      fs.copyFile(`${path}/${file}`, `${dest}/${file}`, (err) => {
        if(err) return reject(`unable to import ${file} to ${dest}/${file}`);

        resolve();
      });
    });
  });
}

export function LoadComponent(theme: string | Theme, name: string) {
  return new Promise<string>((resolve, reject) => {
    const path = GetThemeDir(theme);
    FileExists(`${path}/${name}.liquid`).then(exists => {
      if(!exists) return reject(`unable to find component ${name} in theme ${GetThemeName(theme)}`);

      fs.readFile(`${path}/${name}.liquid`, (err, data) => {
        if(err) return reject(`unable to read component ${name} in theme ${GetThemeName(theme)}`);

        if(typeof theme !== 'string') theme.components[name].liquid = data.toString();
        resolve(data.toString());
      })
    });
  });
}

export default {
  GetThemeName,
  GetThemeDir,
  ReadThemes,
  LoadTheme,
  ImportThemeFile,
  LoadComponent
};