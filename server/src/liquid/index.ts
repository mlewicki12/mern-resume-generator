
import { Liquid } from 'liquidjs';

import registerFilters from 'liquid/filters';

const liquid = new Liquid();

registerFilters(liquid);

export default liquid;