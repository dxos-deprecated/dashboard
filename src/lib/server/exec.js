//
// Copyright 2020 DxOS
//

import debug from 'debug';
import { spawn } from 'child_process';

const log = debug('dxos:dashboard:exec');

const createError = (obj, code) => new Error(obj ? String(obj).replace('\n', '') : `Exit code: ${code}`);

/**
 * Exec terminal command.
 * @param {string} command
 * @param {Object} options
 * @returns {Promise<{error, pid}>}
 */
// TODO(burdon): Factor out (common with CLI/PM2?)
export const exec = (command, options = {}) => {
  const { args = [], env, detached, match, timeout, kill } = options;

  return new Promise((resolve, reject) => {
    let output;
    let error;

    // https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
    const childProcess = spawn(command, args, {
      shell: true,
      env,

      // Child process will terminate with the parent process unless stdio is untangled from parent.
      // https://nodejs.org/api/child_process.html#child_process_options_detached
      detached,
      stdio: detached && 'ignore',
    });

    // https://nodejs.org/api/child_process.html#child_process_class_childprocess
    const { pid } = childProcess;
    log(`Spawned[${pid}]: ${[command, ...args].join(' ')}`);

    if (match && timeout) {
      setTimeout(() => {
        if (kill) {
          childProcess.kill('SIGINT');
        }

        reject(new Error(`Timed out after ${timeout}ms`));
      }, timeout);
    }

    // Closed.
    // TODO(burdon): close vs exit.
    childProcess.on('exit', code => {
      // TODO(burdon): Code only valid if child exited on its own.
      log(`Closed[${pid}]: ${code}`);
      if (code === 0) {
        resolve({ pid, output });
      } else {
        reject(createError(error, code));
      }
    });

    // https://stackoverflow.com/questions/25323703/nodejs-execute-command-in-background-and-forget
    if (detached) {
      log(`Detached[${pid}]`);
      childProcess.unref();

      // TODO(burdon): Sometimes doesn't close so forcing here.
      resolve({ pid, output });
    } else {
      // Output.
      childProcess.stdout.on('data', (data) => {
        output = String(data).trim();

        // TODO(burdon): Timeout option.
        // Return after expected match.
        if (match && output.match(match)) {
          childProcess.unref();
          if (kill) {
            childProcess.kill('SIGINT');
          }

          resolve({ pid, output });
        }
      });

      // Errors.
      childProcess.stderr.on('data', (data) => {
        error = String(data).trim();
        log(`Error: "${error}"`);
      });
    }
  });
};
