
import fs from 'fs';

import { AssetFile } from '../utilities/types';
import { ASSETS } from '../utilities/constants';

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