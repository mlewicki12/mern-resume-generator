
import sass from 'sass';

export type CompileResult = {
  err: any;
  result: string;
}

export const compile: (path: string, compiler: string) => CompileResult = (path, compiler) => {
  switch(compiler) {
    // i don't really know the difference between sass and scss
    // should look into it
    // TODO: look into it
    case 'sass':
    case 'scss':
      let compiled: sass.CompileResult;
      try {
        compiled = sass.compile(`${path}`);
        return {err: undefined, result: compiled.css};
      } catch(e) {
        console.error(e);
        return {err: `error occured while compiling ${path}`, result: undefined};
      }

  }
}