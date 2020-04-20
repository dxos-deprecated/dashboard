//
// Copyright 2020 DxOS
//

import assert from 'assert';
import debug from 'debug';
import get from 'lodash.get';
import { execSync } from 'child_process';

const log = debug('dxos:dashboard:service');

export class Service {
  constructor(name, config) {
    const defaultScripts = get(config, 'scripts');
    const scripts = get(config, `${name}.scripts`);

    assert(name);

    this._name = name;
    this._scripts = scripts;
    this._defaultScripts = defaultScripts;
    this._supportedScripts = [...new Set([...Object.keys(scripts), ...Object.keys(defaultScripts)])];
  }

  async runScript(command) {
    const defaultScript = get(this._defaultScripts, command);
    const script = get(this._scripts, command) || defaultScript;

    assert(script);

    const { command: executable, attributes = [], /* match */ } = script;

    assert(command);
    assert(this._supportedScripts.includes(command), `Command ${command} not supported.`);

    const commandToExec = `${executable} ${attributes.join(' ')}`.replace(/<name>/g, `"${this._name}"`);
    log('Executing: ', commandToExec);

    return String(execSync(commandToExec));
  }
}
