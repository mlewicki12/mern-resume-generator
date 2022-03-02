
import { Request } from 'express';

import { Controller } from '../utilities/types';
import { LoadTheme, ReadThemes } from '../services/themes.service';
import logger from '../utilities/logger';

const Themes: Controller = [
  {
    route: '',
    method: 'GET',
    callback: async (req, res) => {
      ReadThemes()
        .then(data => res.status(200).send(data))
        .catch(err => {
          logger.error(err);
          res.status(500);
        });
    }
  },
  {
    route: ':name',
    method: 'GET',
    callback: async (req: Request<{name: string}>, res) => {
      LoadTheme(req.params.name)
        .then(data => res.status(200).send(data))
        .catch(err => {
          logger.error(err);
          res.status(500);
        });
    }
  }
]

export default Themes;