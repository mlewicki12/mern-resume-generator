
import liquid from '../liquid';
import yaml from 'js-yaml';
import fs from 'fs';

const getLayout: () => Promise<string> = () => {
  return new Promise((resolve, reject) => {
    // TODO: separate liquid stuff from src
    fs.readFile('./src/layouts/root.liquid', (err, data) => {
      if(err) {
        reject(err);
      }

      resolve(data.toString());
    });
  });
}

const readThemes: () => Promise<string[]> = () => {
  return new Promise((resolve, reject) => {
    fs.readdir('./src/themes', (err, data) => {
      if(err) {
        reject(err);
      }

      resolve(data);
    });
  });
}

// eventually will be a theme object, but for testing purposes
const loadTheme: (name: string) => Promise<any> = (name) => {
  return new Promise((resolve, reject) => {
    // TODO: add file exists check
    fs.readFile(`./src/themes/${name}/theme.yaml`, (err, data) => {
      if(err) {
        reject(err);
      }

      resolve(yaml.load(
        data.toString()
      ));
    });
  })
}

export const generate = async (body: any) => {
  // dynamically import eventually
  const layout = await getLayout();
  return await liquid.parseAndRender(layout, body);
}

export const themes = async () => {
  return await readThemes();
}

export const theme = async(name: string) => {
  return await loadTheme(name);
}