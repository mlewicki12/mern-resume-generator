
import express, { RequestHandler } from 'express';
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
      if(info.upload) {
        app.post(route, info.upload, info.callback);
      } else {
        app.post(route, info.callback);
      }
      break;

    case 'PUT':
      app.put(route, info.callback);
      break;

    case 'DELETE':
      app.delete(route, info.callback);
      break;

    default:
      console.error(`unknown operation ${info.method}`);
      return;
  }

  console.log(`defined ${info.method} handler for /api/${base}/${info.route}`);
}

const buildEndpoints = (app: express.Express, route?: string) => {
  const endpointsRoute = route ?? ENDPOINTS_DIR;

  // fs is bad and reads from base directory instead of src/
  const files = fs.readdirSync(`./src/${endpointsRoute}`);
  files.forEach(async item => {
    const module = await require(`../${endpointsRoute}/${item}`).default;
    module.forEach((endpoint: Endpoint) => defineEndpoint(app, item, endpoint));
  });
}

export default buildEndpoints;