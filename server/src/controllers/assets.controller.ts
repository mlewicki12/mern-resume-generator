
import multer from 'multer';
import config from 'config';

import { Controller } from '../utilities/types';
import { GetAssetList } from '../services/assets.service';
import logger from '../utilities/logger';

const storage = multer.diskStorage({
  destination: `${config.get('assetsDir')}`,
  filename: (req, file, cb) => {
    // todo: should check if there's no conflicts
    cb(null, file.originalname);
  }
});

const upload = multer({storage});

const Assets: Controller = [
  {
    route: '',
    method: 'POST',
    middleware: [ upload.single('image') ],
    callback: async (req, res) => {
      // todo: change to real logging (idk what that means, but you'll know ;))
      // hey i know what this means
      res.status(200).send(req.file.filename);
    }
  },
  {
    route: '',
    method: 'GET',
    callback: async (req, res) => {
      GetAssetList()
        .then(files => {
          res.status(200).send(files);
        })
        .catch(err => {
          logger.error(err);
          res.sendStatus(500);
        })
    }
  }
]

export default Assets;