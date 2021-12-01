
import { generate } from '../../services/resume';
import { Controller } from '../../utilities/types';

const Resume: Controller = [
  {
    route: '',
    method: 'POST',
    callback: async (req, res) => {
      console.log('got body: ', req.body);
      res.send(await generate(req.body));
    }
  }
]

export default Resume;