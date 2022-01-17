
import { theme, themes, generate } from '../../services/resume';
import { Controller, ResumeRequest } from '../../utilities/types';

const Resume: Controller = [
  {
    route: '',
    method: 'POST',
    callback: async (req, res) => {
      generate(req.body as ResumeRequest)
        .then(gen => res.status(200).send(gen))
        .catch(err => {
          console.log(err);
          res.status(500).send(err)
        });
    }
  },
  {
    route: 'themes',
    method: 'GET',
    callback: async (req, res) => {
      const themesList = await themes();
      res.status(200).send(themesList);
    }
  },
  {
    route: 'themes/:name',
    method: 'GET',
    callback: async (req, res) => {
      // TODO: look up params in typescript
      const themeInfo = await theme((req.params as any).name);
      res.status(200).send(themeInfo);
    }
  }
]

export default Resume;