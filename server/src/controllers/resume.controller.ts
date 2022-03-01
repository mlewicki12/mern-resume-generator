
import fs from 'fs';
import { Request } from 'express';

import { Controller } from '../utilities/types';
import logger from '../utilities/logger';
import { CreateResume, GenerateResume, GetResume, GetAllResumes, UpdateResume, DeleteResume } from '../services/resume.service';
import { DeleteResumeInput, GenerateResumeInput, GetResumeInput, ResumeRequestInput, UpdateResumeInput } from '../schema/resume.schema';

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
    route: '',
    method: 'GET',
    callback: async (req, res) => {
      GetAllResumes()
        .then(results => res.status(200).send(results))
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
    // not sure if this should be a post request tbh
    route: ':id/:theme',
    method: 'GET',
    callback: async (req: Request<GenerateResumeInput['params']>, res) => {
      GenerateResume(req.params.id, req.params.theme)
        .then(result => {
          res.set({ 'Content-Type': 'application/pdf', 'Content-Length': result.length });
          res.send(result);
        })
        .catch(err => {
          logger.error(err);
          res.sendStatus(500);
        });
    }
  },
  {
    route: ':id',
    method: 'PUT',
    callback: async (req: Request<UpdateResumeInput['params'], {}, UpdateResumeInput['body']>, res) => {
      UpdateResume(req.params.id, req.body, {})
        .then(result => res.status(200).send(result))
        .catch(err => {
          logger.error(err);
          res.sendStatus(500);
        })
    }
  },
  {
    route: ':id',
    method: 'DELETE',
    callback: async (req: Request<DeleteResumeInput['params']>, res) => {
      DeleteResume(req.params.id)
        .then(result => res.sendStatus(200))
        .catch(err => {
          logger.error(err);
          res.sendStatus(500);
        })
    }
  }
]

export default Resume;