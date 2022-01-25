
import { Liquid } from 'liquidjs';

const registerFilters = (liquidEngine: Liquid) => {
  console.log('registering liquid filters');

  // not great and needs futher implementation,
  // but this will do for now
  liquidEngine.registerFilter('type', (item: string | string[]) => {
    if(Array.isArray(item)) {
      return 'array';
    }

    if(!isNaN(Number(item))) {
      return 'number';
    }

    return 'string';
  });

}

export default registerFilters;