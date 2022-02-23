
import { Request } from 'express';

import { Controller } from '../utilities/types';
import logger from '../utilities/logger';
import { CreateResume, GenerateResume, GetResume } from '../services/resume.service';
import { GenerateResumeInput, GetResumeInput, ResumeRequestInput } from '../schema/resume.schema';

const Resume: Controller = [
  {
    route: '',
    method: 'POST',
    callback: async (req: Request<{}, {}, ResumeRequestInput['body']>, res) => {
      CreateResume(req.body)
        .then(result => res.status(200).send(result._id))
        .catch(err => {
          logger.error(err);
          res.sendStatus(500);
        })
    }
  },
  {
    route: ':id',
    method: 'GET',
    callback: async (req: Request<GetResumeInput['params']>, res) => {
      GetResume(req.params.id)
        .then(result => {
          if(!result) return res.sendStatus(404);
          res.status(200).send(result)
        })
        .catch(err => {
          logger.error(err);
          res.sendStatus(500);
        })
    }
  },
  {
    route: [':id', ':id/:theme'],
    method: 'POST',
    callback: async (req: Request<GenerateResumeInput['params']>, res) => {
      GenerateResume(req.params.id, req.params.theme)
        .then(result => res.status(200).send(result))
        .catch(err => {
          logger.error(err);
          res.sendStatus(500);
        });
    }
  }
]

export default Resume;