
import express from 'express';
import { Controller } from '../../utilities/types';

const Hello: Controller = [
  {
    route: '',
    method: 'GET',
    callback: (req: express.Request, res: express.Response) => {
      res.send('helllo');
    }
  }
];

export default Hello;