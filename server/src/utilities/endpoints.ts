
import express, { RequestHandler } from 'express';
import fs from 'fs';

import { Endpoint } from './types';
import { API, ENDPOINTS } from './constants';

const defineEndpoint = (app: express.Express, base: string, info: Endpoint) => {
  const route = `/${API}/${base}/${info.route}`;
  switch (info.method) {
    case 'GET':
      app.get(route, ...info.middleware ?? [], info.callback);
      break;

    case 'POST':
      app.post(route, ...info.middleware ?? [], info.callback);
      break;

    case 'PUT':
      app.put(route, ...info.middleware ?? [], info.callback);
      break;

    case 'DELETE':
      app.delete(route, ...info.middleware ?? [], info.callback);
      break;

    default:
      console.error(`unknown operation ${info.method}`);
      return;
  }

  console.log(`defined ${info.method} handler for /api/${base}/${info.route}`);
}

const buildEndpoints = (app: express.Express, route?: string) => {
  const endpointsRoute = route ?? ENDPOINTS;

  // fs is bad and reads from base directory instead of src/
  const files = fs.readdirSync(`./src/${endpointsRoute}`);
  files.forEach(async item => {
    try {
      // this should technically work for dirs as long as they don't have a dot in the name
      // the idea is removing the extension if it's a file, so there's no trickery after compilation
      const fileName = item.split('.').slice(0, -1).join('.');
      const base = item.split('.')[0];
      const module = await require(`../${endpointsRoute}/${fileName}`).default;
      module.forEach((endpoint: Endpoint) => defineEndpoint(app, base, endpoint));
    } catch(err) {
      console.error(`error registering ${item} controller`);
      console.error(err);
    }
  });
}

export default buildEndpoints;