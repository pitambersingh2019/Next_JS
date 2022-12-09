const express = require('express'); // eslint-disable-line
const next = require('next'); // eslint-disable-line
const vhost = require('vhost'); // eslint-disable-line

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const port = process.env.PORT || 80;
const host = process.env.HOST;
const handle = app.getRequestHandler();


app.prepare().then(() => {

  const masterServer = express();
  const marketingServer = express();

  marketingServer.get('/', (req, res) => {

    return app.render(req, res, '/', req.query);

  });

  marketingServer.all('*', (req, res) => {

    return handle(req, res);

  });

  masterServer.use(vhost(`www.${host}`, marketingServer));
  masterServer.use(vhost(`*.${host}`, marketingServer));
  masterServer.use(vhost(`${host}`, marketingServer));

  masterServer.listen(port, (err) => {

    if (err) throw err;

    console.log(`> Ready on http://www.${host}`);

  });

});
