//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { exec } from './exec';

const log = debug('dxos:dashboard:apps');

export default async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams } = url;

  const command = searchParams.get('command');
  const name = searchParams.get('name');

  let statusCode = 200;
  let result = {};
  let error;
  try {
    switch (command) {
      case 'start': {
        // TODO(burdon): Requires nginx config?
        const path = searchParams.get('path') || name.substring(name.indexOf('/'));
        const port = searchParams.get('port') || 8000;

        const args = [
          'app', 'serve',
          '--app', `wrn:app:${name}`,
          '--path', path,
          '--port', port
        ];

        result = await exec('wire', { args, detached: true });
        break;
      }

      case 'stop': {
        // TODO(burdon): Stop process?
        break;
      }

      default: {
        statusCode = 400;
      }
    }
  } catch (err) {
    log('Error', err);

    statusCode = 500;
    error = err;
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ result, error }));
};
