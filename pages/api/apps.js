//
// Copyright 2020 DxOS
//

import debug from 'debug';
import find from 'find-process';

import config from '../../lib/config';
import { exec } from './util/exec';

const log = debug('dxos:dashboard:apps');

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
        const args = [
          'app', 'serve', '--config', config.system.appRoutes
        ];

        await exec('wire', { args, detached: true });
        break;
      }

      // TODO(burdon): Stop server?
      case 'stop': {
        // Kill process.
        // ps -ef | grep '[w]rn:app:wireline.io/editor' | awk {'print $1'}
        // https://github.com/yibn2008/find-process#readme
        result = { pids: [] };
        const list = await find('wire');
        list.forEach(({ pid, ...rest }) => {
          log(`Killing process: ${pid}`, rest);
          // https://nodejs.org/api/process.html#process_process_kill_pid_signal
          // process.kill(pid, 'SIGINT');
          // result.pids.push(pid);
        });

        break;
      }

      default: {
        statusCode = 400;
      }
    }
  } catch (err) {
    log(err);

    statusCode = 500;
    error = String(err);
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ result, error }));
};
