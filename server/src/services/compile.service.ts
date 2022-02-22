
import sass from 'sass';

function CompileSASS(path: string) {
  return new Promise<string>((resolve, reject) => {
    sass.compileAsync(path).then(result => {
      resolve(result.css);
    }).catch(err => {
      reject(`unable to compile sass file ${path}`);
    });
  });
}

export function Compile(path: string, compiler: string) {
  switch(compiler) {
    // i don't really know the difference between sass and scss
    // should look into it
    // TODO: look into it
    case 'sass':
    case 'scss':
      return CompileSASS(path);

    default:
      return Promise.resolve('');
  }
}

export default {
  Compile
};