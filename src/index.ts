
import express from 'express';
import bodyParser from 'body-parser';

import liquid from './liquid';
import endpoints from './utilities/endpoints';

const app = express();
const port = 8080;

app.engine('liquid', liquid.express());

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

// there probably is a way to do this the other way around
// but that's for a later date :)
// maybe not, app.use is mainly for middleware whereas this defines endpoints
// so it might be better to keep it as is
endpoints(app);

const server = app.listen(port, '127.0.0.1', () => {
  let address = server.address();
  if(typeof address !== 'string') {
    const host = address.address;
    const port = address.port;

    address = `http://${host}:${port}`;
  }

  console.log(`server started at ${address}`);
});