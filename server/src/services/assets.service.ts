
import fs from 'fs';
import config from 'config';

import { FileExists } from '../utilities/functions';
import { AssetFile } from '../utilities/types';

export function GetAssetList() {
  return new Promise<AssetFile[]>((resolve, reject) => {
    FileExists(config.get('assetsDir')).then(exists => {
      if(!exists) return reject('assets directory doesn\'t exist');

      fs.readdir(config.get('assetsDir'), (err, files) => {
        if(err) return reject('unable to access assets directory');

        const names = files.map(item => {
          const splt = item.split('.');
          return {
            name: splt.slice(0, -1).join('.'),
            extension: splt.pop()
          }
        });

        resolve(names);
      });
    });
  });
}

export function ReadAsset(name: string) {
  return new Promise<Buffer>((resolve, reject) => {
    GetAssetList().then(data => {
      const file = data.find(item => item.name === name);

      if(file) {
        fs.readFile(`${config.get('assetsDir')}/${file.name}.${file.extension}`, (err, content) => {
          if(err) return reject(err);

          resolve(content);
        });
      } else {
        reject(`asset ${name} not found`);
      }
    }).catch(err => reject(err));
  });
}

export function ImportAssetFile(name: string, dir: string) {
  return new Promise<void>((resolve, reject) => {
    FileExists(`${config.get('assetsDir')}/${name}`).then(exists => {
      if(!exists) return reject(`asset ${name} doesn't exist`);

      fs.copyFile(`${config.get('assetsDir')}/${name}`, `${dir}/${name}`, err => {
        if(err) return reject(`error importing asset ${name}`);

        resolve();
      });
    })
  });
}

export default {
  GetAssetList,
  ReadAsset,
  ImportAssetFile
};