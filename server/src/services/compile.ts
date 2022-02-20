
import sass from 'sass';

const CompileService = {
  CompileSASS(path: string) {
    return new Promise<string>((resolve, reject) => {
      sass.compileAsync(path).then(result => {
        resolve(result.css);
      }).catch(err => {
        reject(`unable to compile sass file ${path}`);
      });
    });
  },

  Compile(path: string, compiler: string) {
    switch(compiler) {
      // i don't really know the difference between sass and scss
      // should look into it
      // TODO: look into it
      case 'sass':
      case 'scss':
        return CompileService.CompileSASS(path);

      default:
        return Promise.resolve('');
    }
  },
}

export default CompileService;