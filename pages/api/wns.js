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
        const { output } = await exec('wnsd', { args, match: /Executed block/ });
        result = output;
        break;
      }

      case 'shutdown': {
        const { output } = await exec('killall', { args: ['-SIGKILL', 'wnsd'] });
        result = output;
        break;
      }

      case 'log': {
        const { output: log } = await exec('tail', { args: [`-${WNS_LOG_NUM_LINES}`, WNS_LOG_FILE_PATH] });
        result = log.split('\n');
        break;
      }

      default: {
        statusCode = 400;
      }
    }
  } catch (err) {
    log(err);

    statusCode = 500;
    error = err;
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ result, error }));
};
