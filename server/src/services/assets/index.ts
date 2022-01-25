
import fs from 'fs';

import { AssetFile } from '../../utilities/types';
import { ASSETS } from '../../utilities/constants';

export const getAssetList: () => Promise<AssetFile[]> = () => {
  return new Promise((resolve, reject) => {
    fs.access(`${ASSETS}`, fs.constants.F_OK, (err) => {
      if(err) {
        reject(err);
        return;
      }

      fs.readdir(`${ASSETS}`, (err, files) => {
        if(err) {
          reject(err);
          return;
        }

        const names = files.map(item => {
          const splt = item.split('.');
          return {
            name: splt.slice(0, -1).join('.'),
            extension: splt.pop()
          };
        });

        resolve(names);
      });
    });
  });
}

export const readAsset: (name: string) => Promise<Buffer> = (name) => {
  return new Promise((resolve, reject) => {
    getAssetList()
      .then(data => {
        const file = data.find(item => item.name === name);

        if(file) {
          fs.readFile(`${ASSETS}/${file.name}.${file.extension}`, (err, data) => {
            if(err) {
              reject(err);
            }

            resolve(data);
          });
        } else {
          reject(`file ${name} not found`);
        }
      })
      .catch(err => {
        reject(err);
        return;
      });
  });
}