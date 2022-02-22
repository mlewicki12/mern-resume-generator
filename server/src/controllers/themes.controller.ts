
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
        // sending the error is not the best practice, but it'll do for now
        .catch(err => {
          logger.error(err);
          res.status(500).send(err)
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
          res.status(500).send(err);
        });
    }
  }
]

export default Themes;