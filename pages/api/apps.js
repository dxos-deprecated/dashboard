//
// Copyright 2020 DxOS
//

import debug from 'debug';
import find from 'find-process';

import { exec } from './util/exec';

const log = debug('dxos:dashboard:apps');

export default async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams } = url;

  const command = searchParams.get('command');
  const name = searchParams.get('name');
  const wrn = `wrn:app:${name}`;

  let statusCode = 200;
  let result = {};
  let error;
  try {
    switch (command) {
      case 'list': {
        result = { apps: [] };
        break;
      }

      case 'start': {
        const args = [
          'app', 'serve'
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
        const list = await find('wire app', wrn);
        list.forEach(({ pid }) => {
          log(`Killing process: ${pid}`);
          // https://nodejs.org/api/process.html#process_process_kill_pid_signal
          process.kill(pid, 'SIGINT');
          result.pids.push(pid);
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
