
import { Controller } from '../../utilities/types';

const Hello: Controller = [
  {
    route: '',
    method: 'GET',
    callback: (req, res) => {
      res.send('helllo');
    }
  }
];

export default Hello;