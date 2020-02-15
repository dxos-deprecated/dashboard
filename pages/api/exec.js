//
// Copyright 2020 DxOS
//

import debug from 'debug';
import { spawn } from 'child_process';

const log = debug('dxos:xbox:exec');

/**
 * Exec terminal command.
 * @param command
 * @param options
 * @returns {Promise<Object>}
 */
export const exec = (command, options = {}) => {
  const { args = [], wait, detached } = options;
  log('spawn:', command, args.join(' '));

  return new Promise((resolve, reject) => {
    let output;
    let error;

    // https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
    const proc = spawn(command, args, {
      shell: true,
      stdio: detached && 'ignore',
      detached
    });

    proc.on('close', code => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(error);
      }
    });

    // https://stackoverflow.com/questions/25323703/nodejs-execute-command-in-background-and-forget
    if (detached) {
      proc.unref();
      resolve(output);
    } else {
      proc.stdout.on('data', (data) => {
        output = String(data).trim();
        if (wait && output.match(wait)) {
          proc.unref();
          resolve(output);
        }
      });

      proc.stderr.on('data', (data) => {
        error = String(data);
      });
    }
  });
};
