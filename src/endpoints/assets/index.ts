
import multer from 'multer';

import { Controller } from '../../utilities/types';

const storage = multer.diskStorage({
  destination: 'uploads/images',
  filename: (req, file, cb) => {
    const extension = file.originalname.split('.').pop();
    req.name = new Date().getTime().toString();
    cb(null, `${req.name}.${extension}`);
  }
});

const upload = multer({storage});

const Assets: Controller = [
  {
    route: '',
    method: 'POST',
    upload: upload.single('image'),
    callback: async (req, res) => {
      console.log(`received image ${req.name}`);
      res.status(200).send(req.name);
    }
  }
]

export default Assets;