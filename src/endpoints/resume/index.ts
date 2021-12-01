
import { theme, themes, generate } from '../../services/resume';
import { Controller } from '../../utilities/types';

const Resume: Controller = [
  {
    route: '',
    method: 'POST',
    callback: async (req, res) => {
      const generated = await generate(req.body);
      res.send(generated);
    }
  },
  {
    route: 'themes',
    method: 'GET',
    callback: async (req, res) => {
      const themesList = await themes();
      res.send(themesList);
    }
  },
  {
    route: 'themes/:name',
    method: 'GET',
    callback: async (req, res) => {
      // TODO look up params in typescript
      const themeInfo = await theme((req.params as any).name);
      res.send(themeInfo);
    }
  }
]

export default Resume;