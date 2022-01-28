
import { Liquid } from 'liquidjs';
import registerFilters from './filters';

const liquid = new Liquid();

registerFilters(liquid);

export default liquid;