
import liquid from '../liquid';
import yaml from 'js-yaml';
import fs from 'fs';

import { KeyValues, ResumeRequest, Theme, ThemeNode } from '../utilities/types';
import { RESOURCES } from '../utilities/constants';

const getLayout: () => Promise<string> = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${RESOURCES}/layouts/root.liquid`, (err, data) => {
      if(err) {
        reject(err);
      }

      resolve(data.toString());
    });
  });
}

const readThemes: () => Promise<string[]> = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(`${RESOURCES}/themes`, (err, data) => {
      if(err) {
        reject(err);
      }

      resolve(data);
    });
  });
}

const loadTheme: (name: string) => Promise<Theme> = (name) => {
  return new Promise((resolve, reject) => {
    // TODO: add file exists check
    const path = `${RESOURCES}/themes/${name}/`;
    fs.readFile(`${path}/theme.yaml`, (err, data) => {
      if(err) {
        reject(err);
        console.error(err);
      }

      resolve({
        name,
        path,
        components: yaml.load(
          data.toString()
        ) as KeyValues<ThemeNode>
      });
    });
  })
}

const loadComponent: (theme: Theme, name: string) => Promise<string> = (theme, name) => {
  return new Promise((resolve, reject) => {
    // TODO: add file exists check
    fs.access(`${theme.path}/${name}.liquid`, fs.constants.F_OK, (err) => {
      if(err) {
        reject(err);
      }

      fs.readFile(`${theme.path}/${name}.liquid`, (err, data) => {
        // TODO: custom callback type to avoid having to type this shit
        if(err) {
          reject(err);
        }

        theme.components[name].liquid = data.toString();
        resolve(data.toString());
      });
    });
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
    const reject = (reason: string) => {
      fs.rm(`public/resumes/${name}`, {
        recursive: true,
        force: true
      }, (err) => {
        rej(err);
      });

      rej(reason);
    }

    const dir = `public/resumes/${name}`;
    fs.mkdir(dir, async (errMk) => {
      if(errMk) throw errMk;

      fs.copyFile('./resources/layouts/root.liquid', `${dir}/root.liquid`, async (errCp) => {
        if(errCp) throw errCp;

        // TODO add in-depth error checking et al
        const theme = await loadTheme(body.theme ?? 'default');

        if (!body.components) {
          reject('no resume components provided');
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
                  liquid.parseAndRender(data, item.variables)
                    .then(data => resolve(data))
                    .catch(err => reject(err));
                })
                .catch(err => reject(err));
            } else {
              liquid.parseAndRender(theme.components[item.component].liquid, item.variables)
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

            // using a temp file here to use layouts
            fs.writeFileSync(`${dir}/out.liquid`, output);
            liquid.renderFile(`${dir}/out.liquid`)
              .then(render => {
                fs.writeFileSync(`${dir}/index.html`, render);

                // delete working liquid files
                fs.unlinkSync(`public/resumes/${name}/root.liquid`);
                fs.unlinkSync(`public/resumes/${name}/out.liquid`);

                // return the address of hosted file
                resolve(`http://localhost:8080/resumes/${name}`);
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

export const themes = async () => {
  return await readThemes();
}

export const theme = async(name: string) => {
  return await loadTheme(name);
}