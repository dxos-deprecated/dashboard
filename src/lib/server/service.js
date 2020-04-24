//
// Copyright 2020 DxOS
//

import assert from 'assert';
import debug from 'debug';
import get from 'lodash.get';
import { readFileSync, existsSync } from 'fs';
import { spawnSync } from 'child_process';

const log = debug('dxos:dashboard:service');

const DEFAULT_TIMEOUT = 20000;
const DEFAULT_INTERVAL_TIME = 1500;

export class Service {
  constructor(name, config) {
    assert(name);

    const defaultScripts = get(config, 'scripts');
    const scripts = get(config, `services.${name}.scripts`);
    const logFile = get(config, `services.${name}.log`);

    this._name = name;
    this._scripts = scripts;
    this._defaultScripts = defaultScripts;
    this._supportedScripts = [...new Set([...Object.keys(scripts), ...Object.keys(defaultScripts)])];
    this._logFile = logFile;
  }

  async runScript(command, attrs = []) {
    return new Promise((resolve, reject) => {
      assert(command);
      assert(this._supportedScripts.includes(command), `Command ${command} not supported.`);

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

      const commandAttrs = [...attributes, ...attrs].map(attr => {
        if (attr === '<name>') {
          return this._name;
        }
        if (attr === '<logFile>' && this._logFile) {
          return this._logFile;
        }
        return attr;
      });

      log(`Executing: "${executable}", Args: ${JSON.stringify(commandAttrs)}`);
      const result = spawnSync(executable, commandAttrs);

      if (result.error) {
        reject(result.error);
      } else if (result.stderr && String(result.stderr)) {
        reject(String(result.stderr));
      } else if (match) {
        interval = setInterval(() => {
          if (this._logFile && existsSync(this._logFile)) {
            const logOutput = String(readFileSync(this._logFile));
            if (logOutput.match(new RegExp(match))) {
              clearInterval(interval);
              resolve(String(result.stdout));
            }
          }
        }, DEFAULT_INTERVAL_TIME);
      } else {
        resolve(String(result.stdout));
      }
    });
  }
}
