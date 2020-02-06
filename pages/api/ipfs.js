//
// Copyright 2020 DxOS
//

import debug from 'debug';
import { spawn } from 'child_process';

const log = debug('xbox:ipfs');

/**
 *
 * @param command
 * @param options
 * @returns {Promise<unknown>}
 */
// TODO(burdon): Factor out.
const exec = (command, options = {}) => {
  const { args, wait, detached } = options;
  log('command', command, options);

  return new Promise((resolve, reject) => {
    let output;

    // https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
    const proc = spawn(command, args, {
      shell: true,
      stdio: detached && 'ignore',
      detached
    });

    proc.on('error', error => reject(error));
    proc.on('close', code => (code === 0 ? resolve(output || code) : reject(code)));

    // https://stackoverflow.com/questions/25323703/nodejs-execute-command-in-background-and-forget
    if (detached) {
      proc.unref();
      resolve(0);
    } else {
      proc.stdout.on('data', (data) => {
        output = String(data);
        if (wait && output.match(wait)) {
          proc.unref();
          resolve(0);
        }
      });
    }
  });
};

// https://nodejs.org/api/http.html#http_class_http_incomingmessage
export default async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams } = url;
  const command = searchParams.get('command');

  let statusCode = 200;
  let result = {};
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
    log('error', err);
    statusCode = 500;
  }

  log('result', statusCode, result);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ result }));
};
