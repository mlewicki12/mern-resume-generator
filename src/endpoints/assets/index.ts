
import multer from 'multer';

import { Controller } from '../../utilities/types';

const upload = multer({ dest: 'uploads/' });

const Assets: Controller = [
  {
    route: '',
    method: 'POST',
    upload: upload.single('image'),
    callback: async (req, res) => {
      console.log(req.file);
      res.sendStatus(200)
    }
  }
]

export default Assets;