//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { exec } from '../../lib/server/exec';

const log = debug('dxos:dashboard:wns');

const WNS_LOG_FILE_PATH = '/tmp/wns.log';

// Number of lines to tail from the log file when polling.
const WNS_LOG_NUM_LINES = 50;

export default async (req, res) => {
  let statusCode = 200;
  let result = {};

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const { searchParams } = url;
    const command = searchParams.get('command');

    switch (command) {
      case 'start': {
        const args = ['start', '--gql-server', '--gql-playground', '2>&1', '|', 'tee', WNS_LOG_FILE_PATH];
        await exec('wnsd', { args, match: /Executed block/ });
        break;
      }

      case 'shutdown': {
        await exec('killall', { args: ['-SIGKILL', 'wnsd'] });
        break;
      }

      case 'log': {
        const { output: log = '' } = await exec('tail', {
          args: [`-${WNS_LOG_NUM_LINES}`, WNS_LOG_FILE_PATH]
        });

        result = { log: log.split('\n') };
        break;
      }

      default: {
        statusCode = 400;
      }
    }
  } catch (err) {
    log(err);
    statusCode = 500;
    result = {
      error: String(err)
    };
  }

  res.status(statusCode).json(result);
};
