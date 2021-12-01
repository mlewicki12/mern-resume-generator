
import liquid from '../liquid';
import yaml from 'js-yaml';
import fs from 'fs';

const RESOURCES_DIR = './resources';

const getLayout: () => Promise<string> = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${RESOURCES_DIR}/layouts/root.liquid`, (err, data) => {
      if(err) {
        reject(err);
      }

      resolve(data.toString());
    });
  });
}

const readThemes: () => Promise<string[]> = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(`${RESOURCES_DIR}/themes`, (err, data) => {
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
    fs.readFile(`${RESOURCES_DIR}/themes/${name}/theme.yaml`, (err, data) => {
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