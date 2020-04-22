//
// Copyright 2020 DxOS
//

import assert from 'assert';
import debug from 'debug';
import get from 'lodash.get';
import { execSync } from 'child_process';

const log = debug('dxos:dashboard:service');

const DEFAULT_TIMEOUT = 20000;
const DEFAULT_INTERVAL_TIME = 1500;
// TODO(egorgripasov): Get from config.
const DEFAULT_LOGS_COMMAND = 'wire services logs';

export class Service {
  constructor(name, config) {
    assert(name);

    const defaultScripts = get(config, 'scripts');
    const scripts = get(config, `services.${name}.scripts`);

    this._name = name;
    this._scripts = scripts;
    this._defaultScripts = defaultScripts;
    this._supportedScripts = [...new Set([...Object.keys(scripts), ...Object.keys(defaultScripts)])];
  }

  async runScript(command, attrs = []) {
    return new Promise((resolve, reject) => {
      const defaultScript = get(this._defaultScripts, command);
      const script = get(this._scripts, command) || defaultScript;

      assert(script);

      const { command: executable, attributes = [], match, timeout = DEFAULT_TIMEOUT } = script;

      let interval;
      if (match && timeout) {
        setTimeout(() => {
          if (interval) {
            clearInterval(interval);
          }
          reject(new Error(`Timed out after ${timeout}ms`));
        }, timeout);
      }

      assert(command);
      assert(this._supportedScripts.includes(command), `Command ${command} not supported.`);

      const commandToExec = `${executable} ${[...attributes, ...attrs].join(' ')}`.replace(/<name>/g, `"${this._name}"`);
      log('Executing: ', commandToExec);

      const result = String(execSync(commandToExec));

      if (match) {
        interval = setInterval(() => {
          const output = String(execSync(`${DEFAULT_LOGS_COMMAND} ${this._name}`));
          if (output.match(new RegExp(match))) {
            clearInterval(interval);
            resolve(result);
          }
        }, DEFAULT_INTERVAL_TIME);
      } else {
        resolve(result);
      }
    });
  }
}
