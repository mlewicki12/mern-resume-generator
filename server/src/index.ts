
import config from 'config';

import app from './app';
import logger from './utilities/logger';
import connect from './utilities/connect';

const server = app.listen(config.get('port'), '127.0.0.1', async () => {
  let address = server.address();
  if(typeof address !== 'string') {
    const host = address.address;
    const port = address.port;

    address = `http://${host}:${port}`;
  }

  app.locals.address = address;
  logger.info(`server started at ${address}`);

  await connect();
});