//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { exec } from './util/exec';

const log = debug('dxos:dashboard:ipfs');

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
        const { output } = await exec('ipfs', { args: ['version'] });
        [, result] = output.match(/ipfs version ([0-9\\.]+)/i);
        break;
      }

      case 'start': {
        const { output } = await exec('ipfs', { args: ['daemon'], match: /Daemon is ready/ });
        result = output;
        break;
      }

      case 'shutdown': {
        const { output } = await exec('ipfs', { args: ['shutdown'] });
        result = output;
        break;
      }

      default: {
        statusCode = 400;
      }
    }
  } catch (err) {
    log(err);

    statusCode = 500;
    if (err.match(/ipfs daemon is running/)) {
      error = 'IPFS daemon already running';
    } else {
      error = err;
    }
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ result, error }));
};
