
import fs from 'fs';

import liquid from '../../liquid';
import { importThemeFile, loadGenerate, loadTheme, readThemes } from '../themes';
import { KeyValues, ResumeRequest, Theme, ThemeNode } from '../../utilities/types';
import { ASSETS } from '../../utilities/constants';

const loadComponent: (theme: Theme, name: string) => Promise<string> = (theme, name) => {
  return new Promise((resolve, reject) => {
    fs.access(`${theme.path}/${name}.liquid`, fs.constants.F_OK, (err) => {
      if(err) {
        reject(err);
        return;
      }

      fs.readFile(`${theme.path}/${name}.liquid`, (err, data) => {
        // TODO: custom callback type to avoid having to type this shit
        if(err) {
          reject(err);
          return;
        }

        theme.components[name].liquid = data.toString();
        resolve(data.toString());
      });
    });
  });
}

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

export const generate = async (body: ResumeRequest) => {
  // copy default layout to generate folder
  const name = new Date().getTime();

  // callback hell let's go
  // not the most efficient if this ever goes public, since two requests might go on at the same time yadda yadda yadda
  return new Promise<string>((resolve, rej) => {
    // thrown here as an afterthought bc i don't wanna rename everything
    // but this will clear all work files on error
    const reject = (reason: NodeJS.ErrnoException | string) => {
      fs.rm(`public/resumes/${name}`, {
        recursive: true,
        force: true
      }, (err) => {
        rej(reason);
      });
    }

    // TODO make this not one function so it's legible
    const dir = `public/resumes/${name}`;
    fs.mkdir(dir, async (errMk) => {
      if(errMk) {
        reject(errMk);
        return;
      }

      fs.copyFile('./resources/layouts/root.liquid', `${dir}/root.liquid`, async (errCp) => {
        if(errCp) {
          reject(errCp);
          return;
        }

        let theme: Theme;

        try {
          theme = await loadTheme(body.theme ?? 'default');
        } catch (e) {
          reject(e);
          return;
        }

        if(!theme) {
          reject(`error reading ${body.theme} theme`);
          return;
        }

        if (!body.components) {
          reject('no resume components provided');
          return;
        }

        // body should be given an array of element names and variables
        const generated = body.components.map(item => {
          return new Promise<string>((resolve, reject) => {
            if(!item.component || !theme.components[item.component]) {
              resolve(`<h1 style="color:red">Missing theme component ${item.component}</h1>`);
            }

            if(!theme.components[item.component].liquid) {
              loadComponent(theme, item.component)
                .then(data => {
                  // feels weird not using data here,
                  // but loadComponent will populate the theme
                  // with the liquid data
                  generateComponent(dir, theme.components[item.component], item.variables)
                    .then(data => resolve(data))
                    .catch(err => reject(err));
                })
                .catch(err => reject(err));
            } else {
              generateComponent(dir, theme.components[item.component], item.variables)
                .then(data => resolve(data))
                .catch(err => reject(err));
            }
          })
        });

        // store the built theme and drop it in the default layout
        Promise.all(generated)
          .then(async data => {
            const output = data.reduce((prev, item) => {
              return prev + item;
            }, '{% layout \'root.liquid\' %}\n{% block content %}') + '\n{% endblock %}';

            // using a temp file here to access the layout tag
            fs.writeFileSync(`${dir}/out.liquid`, output);
            liquid.renderFile(`${dir}/out.liquid`)
              .then(render => {
                fs.writeFileSync(`${dir}/index.html`, render);

                // delete working liquid files
                fs.unlinkSync(`public/resumes/${name}/root.liquid`);
                fs.unlinkSync(`public/resumes/${name}/out.liquid`);

                loadGenerate(theme)
                  .then(data => {
                    const steps: Promise<void>[] = data.map(step => {
                      switch(step.op) {
                        case 'import':
                          return importThemeFile(theme, step.file, dir);

                        default:
                          console.warn(`unknown operation ${step.op}, skipping!`);
                          return Promise.resolve();
                      }
                    });

                    Promise.all(steps)
                      // make sure we get all the files copied in before returning the file
                      .then(() => resolve(`${name}`))
                      .catch(err => reject(err));
                  })
                  .catch(err => reject(err));
              })
              .catch(err => reject(err))
          })
          .catch(err => {
            reject(err);
          });
      });
    });
  });
}