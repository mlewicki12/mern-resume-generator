
import multer from 'multer';

import { Controller } from '../utilities/types';
import { getAssetList } from '../services/assets';
import { ASSETS } from '../utilities/constants';

const storage = multer.diskStorage({
  destination: `${ASSETS}`,
  filename: (req, file, cb) => {
    const name = file.originalname.split('.');
    req.name = name.slice(0, -1).join('.');
    req.extension = name.pop();

    cb(null, `${req.name}.${req.extension}`);
  }
});

const upload = multer({storage});

const Assets: Controller = [
  {
    route: '',
    method: 'POST',
    upload: upload.single('image'),
    callback: async (req, res) => {
      // TODO: change to real logging (idk what that means, but you'll know ;))
      res.status(200).send({name: req.name, extension: req.extension});
    }
  },
  {
    route: '',
    method: 'GET',
    callback: async (req, res) => {
      getAssetList()
        .then(files => {
          res.status(200).send(files);
        })
        .catch(err => {
          console.error(err);
          res.sendStatus(500);
        })
    }
  }
]

export default Assets;