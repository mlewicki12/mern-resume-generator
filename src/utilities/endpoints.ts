
import express from 'express';
import fs from 'fs';

import { Endpoint } from '../utilities/types';

const API_ROUTE = 'api';
const ENDPOINTS_DIR = 'endpoints';

const defineEndpoint = (app: express.Express, base: string, info: Endpoint) => {
  const route = `/${API_ROUTE}/${base}/${info.route}`;
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

const buildEndpoints = (app: express.Express) => {
  // fs is bad and reads from base directory instead of src/
  const files = fs.readdirSync(`./src/${ENDPOINTS_DIR}`);
  files.forEach(async item => {
    const module = await require(`../${ENDPOINTS_DIR}/${item}`).default;
    module.forEach((endpoint: Endpoint) => defineEndpoint(app, item, endpoint));
  });
}

export default buildEndpoints;