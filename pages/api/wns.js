//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { exec } from './exec';

const log = debug('dxos:dashboard:wns');

export default async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams } = url;

  const command = searchParams.get('command');

  let statusCode = 200;
  let result = {};
  let error;
  try {
    switch (command) {
      case 'start': {
        result = await exec('wnsd', { args: ['start', '--gql-server', '--gql-playground'], wait: /Executed block/ });
        break;
      }

      case 'shutdown': {
        result = await exec('killall', { args: ['-SIGKILL', 'wnsd'] });
        break;
      }

      default: {
        statusCode = 400;
      }
    }
  } catch (err) {
    log('Error', err);

    if (err.match(/resource temporarily unavailable/)) {
      error = 'WNS daemon already running';
    } else {
      error = err;
    }

    statusCode = 500;
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ result, error }));
};
