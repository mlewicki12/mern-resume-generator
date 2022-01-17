
import multer from 'multer';

import { Controller } from '../../utilities/types';
import { getAssetList } from '../../services/assets';
import { ASSETS } from '../../utilities/constants';

const storage = multer.diskStorage({
  destination: `${ASSETS}/images`,
  filename: (req, file, cb) => {
    req.name = new Date().getTime().toString();
    req.extension = file.originalname.split('.').pop();

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
      console.log(`received image ${req.name}`);
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