
import express from 'express';
import bodyParser from 'body-parser';

import liquid from './liquid';
import endpoints from './utilities/endpoints';

const app = express();
const port = 8080;

app.engine('liquid', liquid.express());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// there probably is a way to do this the other way around
// but that's for a later date :)
endpoints(app);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});