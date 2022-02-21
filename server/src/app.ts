
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import liquid from './liquid';
import endpoints from './utilities/endpoints';
import { FileExists } from './utilities/functions';

const app = express();

app.engine('liquid', liquid.express());

app.use(cors());

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// there probably is a way to do this the other way around
// but that's for a later date :)
// maybe not, app.use is mainly for middleware whereas this defines endpoints
// so it might be better to keep it as is
endpoints(app);

FileExists('public/resumes').then(exists => {
  if(!exists) {
    fs.mkdir('public/resumes', err => {
      if(err) throw err;
    })
  }
});

export default app;