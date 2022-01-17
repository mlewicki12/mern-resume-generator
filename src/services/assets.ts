
import fs from 'fs';

import { ASSETS } from '../utilities/constants';

export const getAssetList = () => {
  return new Promise((resolve, reject) => {
      fs.access(`${ASSETS}`, fs.constants.F_OK, (err) => {
        if(err) {
          reject(err);
          return;
        }

        // mm callback hell
        fs.access(`${ASSETS}/images`, fs.constants.F_OK, (err) => {
          if(err) {
            reject(err);
            return;
          }

          fs.readdir(`${ASSETS}/images`, (err, files) => {
            if(err) {
              reject(err);
              return;
            }

            const names = files.map(item => item.split('.').slice(0, -1).join('.'));
            resolve(names);
          });
        });
      });
  });
}