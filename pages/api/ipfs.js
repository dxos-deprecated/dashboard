//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { exec } from './exec';

const log = debug('dxos:xbox:ipfs');

// https://nodejs.org/api/http.html#http_class_http_incomingmessage
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
        const text = await exec('ipfs', { args: ['version'] });
        [, result] = text.match(/ipfs version ([0-9\\.]+)/i);
        break;
      }

      case 'start': {
        result = await exec('ipfs', { args: ['daemon'], wait: /Daemon is ready/ });
        break;
      }

      case 'shutdown': {
        result = await exec('ipfs', { args: ['shutdown'] });
        break;
      }

      default: {
        statusCode = 400;
      }
    }
  } catch (err) {
    log('Error', err);

    if (err.match(/ipfs daemon is running/)) {
      error = 'IPFS deamon already running';
    } else {
      error = err;
    }

    statusCode = 500;
  }

  log('Result', statusCode, result);

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ result, error }));
};
