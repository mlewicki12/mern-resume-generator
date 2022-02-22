
import { Request } from 'express';

import { Controller, ResumeRequest } from '../utilities/types';
import ResumeService from '../services/resume.service';

const Resume: Controller = [
  {
    route: '',
    method: 'POST',
    callback: async (req: Request<{}, {}, ResumeRequest>, res) => {
      ResumeService.Generate(req.body)
        .then(gen => res.status(200).send(`${req.app.locals.address}/resumes/${gen}`))
        .catch(err => {
          console.error(err);
          res.status(500).send(err)
        });
    }
  },
]

export default Resume;