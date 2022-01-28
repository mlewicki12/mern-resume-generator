
import { Request } from 'express';

import { Controller } from '../utilities/types';
import { readThemes, loadTheme } from '../services/themes';

const Resume: Controller = [
  {
    route: '',
    method: 'GET',
    callback: async (req, res) => {
      readThemes()
        .then(data => res.status(200).send(data))
        // sending the error is not the best practice, but it'll do for now
        .catch(err => {
          console.error(err);
          res.status(500).send(err)
        });
    }
  },
  {
    route: ':name',
    method: 'GET',
    callback: async (req: Request<{name: string}>, res) => {
      loadTheme(req.params.name)
        .then(data => res.status(200).send(data))
        .catch(err => {
          console.error(err);
          res.status(500).send(err);
        });
    }
  }
]

export default Resume;