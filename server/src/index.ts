
import app from './app';

const port = 8080;
const server = app.listen(port, '127.0.0.1', () => {
  let address = server.address();
  if(typeof address !== 'string') {
    const host = address.address;
    const port = address.port;

    address = `http://${host}:${port}`;
  }

  app.locals.address = address;
  console.log(`server started at ${address}`);
});