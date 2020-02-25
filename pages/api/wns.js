//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { exec } from './exec';

const log = debug('dxos:dashboard:wns');

const WNS_LOG_FILE_PATH = '/tmp/wns.log';

// Number of lines to tail from the log file when polling.
const WNS_LOG_NUM_LINES = 50;

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
        const args = ['start', '--gql-server', '--gql-playground', '2>&1', '|', 'tee', WNS_LOG_FILE_PATH];
        result = await exec('wnsd', { args, wait: /Executed block/ });
        break;
      }

      case 'shutdown': {
        result = await exec('killall', { args: ['-SIGKILL', 'wnsd'] });
        break;
      }

      case 'log': {
        result = await exec('tail', { args: [`-${WNS_LOG_NUM_LINES}`, WNS_LOG_FILE_PATH] });
        break;
      }

      default: {
        statusCode = 400;
      }
    }
  } catch (err) {
    log('Error', err);

    error = err;
    statusCode = 500;
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ result, error }));
};
