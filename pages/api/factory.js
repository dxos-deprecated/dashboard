//
// Copyright 2020 DxOS
//

// TODO(egorgripasov): Temp file, remove once BotFactory could be registered in WNS.

import debug from 'debug';
import yaml from 'node-yaml';
import { existsSync } from 'fs';
import { ensureFileSync } from 'fs-extra';
import { homedir } from 'os';

import { createKeyPair, keyToString } from '@dxos/crypto';

const FACTORY_FILE_PATH = '~/.wireline/botfactory';

const log = debug('dxos:dashboard:factory');
const factoryPath = FACTORY_FILE_PATH.replace('~', homedir());

let config;
if (existsSync(factoryPath)) {
  config = yaml.readSync(factoryPath);
} else {
  log('config created:', factoryPath);
  const { publicKey, secretKey } = createKeyPair();
  config = { topic: keyToString(publicKey), secretKey: keyToString(secretKey) };
  ensureFileSync(factoryPath);
  yaml.writeSync(factoryPath, config);
}

export const TOPIC = config.topic;

export const SECRET_KEY = config.secretKey;
