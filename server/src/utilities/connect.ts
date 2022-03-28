
import mongoose from 'mongoose';
import config from 'config';

import logger from './logger';

export default function connect() {
  const dbUri = process.env.MONGO_URI;

  return mongoose.connect(dbUri)
    .then(() => logger.info('connected to db'))
    .catch(err => {
      logger.error('could not connect to db');
      process.exit(1);
    })
}