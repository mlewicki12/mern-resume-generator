
import { Liquid } from 'liquidjs';
import logger from '../utilities/logger';

const registerFilters = (liquidEngine: Liquid) => {
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

  logger.info('done registering liquid filters');
}

export default registerFilters;