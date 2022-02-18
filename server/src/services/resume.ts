
import fs from 'fs';

import liquid from '../liquid';
import { handleThemeGenerate, loadComponent, loadTheme } from './themes';
import { KeyValues, ResumeRequest, Theme, ThemeNode } from '../utilities/types';
import { ASSETS, DEBUG } from '../utilities/constants';

const generateComponent = async (dir: string, component: ThemeNode, values: KeyValues<string>) => {
  return new Promise<any>((resolve, reject) => {
    const variables = Object.keys(values).map(key => {
      // means it's in the assets folder
      if(typeof values[key] === 'string' && values[key].startsWith('@asset:')) {
        // remove the asset prefix
        const name = values[key].slice(7);

        fs.access(`${ASSETS}/${name}`, fs.constants.F_OK, (err) => {
          if(err) {
            // should have more in-depth error reporting eventually
            reject(err);
            return;
          }

          fs.copyFile(`${ASSETS}/${name}`, `${dir}/${name}`, (err) => {
            if(err) {
              reject(err);
              return;
            }
          });
        });

        return {key, value: name};
      } else {
        return {key, value: values[key]};
      }
    }).reduce((prev, next) => {
      prev[next.key] = next.value;
      return prev;
    }, {} as KeyValues<string>);

    liquid.parseAndRender(component.liquid, variables)
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
}

export const getDir = (name: string) => `public/resumes/${name}`;

const createWorkDir = (name: string, reject: (reason: NodeJS.ErrnoException | string) => void,
  callback: () => void) => {
    const dir = getDir(name);
    fs.mkdir(dir, err => {
      if(err) return reject(err);

      callback();
    });
}

const cleanWorkDir = (name: string, callback: fs.NoParamCallback) => {
  if(DEBUG) return;

  const dir = getDir(name);
  fs.rm(dir, {
    recursive: true,
    force: true
  }, callback);
}

const importLayout = (name: string, theme: Theme) => {
  return new Promise<void>((resolve, reject) => {
    if(!theme.layout) return resolve();

    fs.access(`${theme.path}/${theme.layout}`, fs.constants.F_OK, (err) => {
      if(err) return reject(err);

      fs.copyFile(`${theme.path}/${theme.layout}`, `resources/layouts/${name}.liquid`, (err) => {
        if(err) return reject(err);
        resolve();
      })
    });
  });
}

const copyFiles = (name: string, path: string, reject: (reason: NodeJS.ErrnoException | string) => void,
  callback: () => void) => {
  const dir = getDir(name);
  fs.copyFile(path, `${dir}/root.liquid`, (err) => {
    if(err) {
      reject(err);
      return;
    }

    callback();
  });
}

const handleGenerate = (name: string, component: ThemeNode, variables: KeyValues<string>,
  resolve: (value: string | PromiseLike<string>) => void, reject: (reason?: any) => void) => {
    const dir = getDir(name);
    generateComponent(dir, component, variables)
      .then(data => resolve(data))
      .catch(err => reject(err));
}

const deleteWorkingFiles = (name: string) => {
  // delete working liquid files
  fs.unlinkSync(`public/resumes/${name}/out.liquid`);

  fs.access(`resources/layouts/${name}.liquid`, fs.constants.F_OK, (err) => {
    if(err) return;

    // remove temporary layout file as needed
    fs.unlinkSync(`resources/layouts/${name}.liquid`);
  })
}

const useLayout = (name: string, reject: (reason: NodeJS.ErrnoException | string) => void, data: string, callback: () => void) => {
  const dir = getDir(name);

  // using a temp file here to access the layout tag
  fs.writeFileSync(`${dir}/out.liquid`, data);

  liquid.renderFile(`${dir}/out.liquid`)
    .then(render => {
      fs.writeFileSync(`${dir}/index.html`, render);

      if(!DEBUG) deleteWorkingFiles(name);

      callback();
    })
    .catch(err => {
      reject(err);
    });
}

export const generate = async (body: ResumeRequest) => {
  // copy default layout to generate folder
  const name = `${new Date().getTime()}`;

  // callback hell let's go
  // not the most efficient if this ever goes public, since two requests might go on at the same time yadda yadda yadda
  return new Promise<string>((resolve, rej) => {
    // thrown here as an afterthought bc i don't wanna rename everything
    // but this will clear all work files on error
    const reject = (reason: NodeJS.ErrnoException | string) => cleanWorkDir(name, () => rej(reason));
    createWorkDir(name, reject, async () => {
      loadTheme(body.theme ?? 'default')
        .then(theme => {
          if(!theme) return reject(`error reading ${body.theme} theme`);
          if (!body.components) return reject('no resume components provided');

          // body should be given an array of element names and variables
          const generated = body.components.map(item => {
            return new Promise<string>((resolve, reject) => {
              if(!item.component || !theme.components[item.component]) {
                resolve(`<h1 style="color:red">Missing theme component ${item.component}</h1>`);
              }

              if(!theme.components[item.component].liquid) {
                loadComponent(theme, item.component)
                  .then(data => handleGenerate(name, theme.components[item.component], item.variables, resolve, reject))
                  .catch(err => reject(err));
              } else {
                handleGenerate(name, theme.components[item.component], item.variables, resolve, reject);
              }
            })
          });

          // store the built theme and drop it in the layout
          Promise.all(generated)
            .then(async data => {
              const output = data.reduce((prev, item) => {
                return prev + item;
              }, `{% layout \'${theme.layout ? name : 'root'}.liquid\' %}\n{% block content %}`) + '\n{% endblock %}';

              try {
                importLayout(name, theme)
              } catch(err) {
                return reject(err);
              }

              useLayout(name, reject, output, () => handleThemeGenerate(theme, name, resolve, reject));
            })
            .catch(err => {
              reject(err);
            });
          })
          .catch(err => reject(err));
    });
  });
}