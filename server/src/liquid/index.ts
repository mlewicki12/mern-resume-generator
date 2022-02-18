
import { Liquid } from 'liquidjs';
import registerFilters from './filters';

const liquid = new Liquid({
  root: ['.', 'resources/layouts/']
});

registerFilters(liquid);

export default liquid;