
import fs from 'fs';

export const getAssetList = () => {
  return new Promise((resolve, reject) => {
      fs.access('uploads', fs.constants.F_OK, (err) => {
        if(err) {
          reject(err);
          return;
        }

        // mm callback hell
        fs.access('uploads/images', fs.constants.F_OK, (err) => {
          if(err) {
            reject(err);
            return;
          }

          fs.readdir('uploads/images', (err, files) => {
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