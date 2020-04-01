const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const nextConfig = require('./next.config');

const nodeEnv = process.env.NODE_ENV || 'production';
const port = process.env.PORT || 3000;

const dev = nodeEnv !== 'production';
const app = next({ dev, dir: __dirname, conf: nextConfig });

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true);

    handle(req, res, parsedUrl);
  }).listen(port, err => {
    if (err) throw err;
    console.log(`Dashboard ready on port: ${port}`);
  });
});
