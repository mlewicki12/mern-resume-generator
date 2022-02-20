
import { Request } from 'express';

import { Controller } from '../utilities/types';
import ThemeService from '../services/themes';

const Themes: Controller = [
  {
    route: '',
    method: 'GET',
    callback: async (req, res) => {
      ThemeService.ReadThemes()
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
      ThemeService.LoadTheme(req.params.name)
        .then(data => res.status(200).send(data))
        .catch(err => {
          console.error(err);
          res.status(500).send(err);
        });
    }
  }
]

export default Themes;