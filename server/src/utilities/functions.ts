
import fs from 'fs';

export function FileExists(path: string) {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      if(err) resolve(false);
      resolve(true);
    });
  });
}