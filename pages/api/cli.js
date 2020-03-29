//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { exec } from './exec';

const log = debug('dxos:dashboard:cli');

export default async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams } = url;

  const command = searchParams.get('command');

  let statusCode = 200;
  let result = {};
  let error;
  try {
    switch (command) {
      case 'version': {
        // TODO(burdon): Expect JSON.
        result = await exec('wire', { args: ['--version'] });
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
