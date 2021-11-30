
import express from 'express';
import fs from 'fs';
import { Endpoint } from './utilities/types';

import liquid from './liquid';

const app = express();
const port = 8080;

const ENDPOINTS_DIR = 'endpoints';

const defineEndpoint = (base: string, info: Endpoint) => {
  const route = `/${base}${info.route}`;
  switch (info.method) {
    case 'GET':
      app.get(route, info.callback);
      break;

    case 'POST':
      app.post(route, info.callback);
      break;

    case 'PUT':
      app.put(route, info.callback);
      break;

    case 'DELETE':
      app.delete(route, info.callback);
      break;

    default:
      console.log(`unknown operation ${info.method}`);
      break;
  }
}

// fs is bad and reads from base directory instead of src/
const files = fs.readdirSync(`./src/${ENDPOINTS_DIR}`);
files.forEach(async item => {
  const module = await require(`./${ENDPOINTS_DIR}/${item}`).default;
  module.forEach((endpoint: Endpoint) => defineEndpoint(item, endpoint));
});

app.engine('liquid', liquid.express());

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});