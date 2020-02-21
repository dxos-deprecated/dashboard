//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { exec } from './exec';
import { TOPIC, SECRET_KEY } from './factory';

// TODO(egorgripasov): Publish CLI.
const WIRE = 'node ~/Projects/wireline/upstream/incubator/packages/data-cli/bin/wire.js';

const log = debug('dxos:dashboard:bots');

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
        result = await exec(WIRE, { args: ['bot', 'factory', 'start', '--topic', TOPIC, '--secret-key', SECRET_KEY], wait: /bot-factory/ });
        break;
      }

      case 'shutdown': {
        result = await exec(WIRE, { args: ['bot', 'factory', 'stop'] });
        break;
      }

      case 'status': {
        const status = await exec(WIRE, { args: ['bot', 'factory', 'status', '--topic', TOPIC] });
        result = status ? JSON.parse(status) : { started: 'false' };
        break;
      }

      default: {
        statusCode = 400;
      }
    }
  } catch (err) {
    log('Error', err);

    statusCode = 500;
    error = err;
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ result, error }));
};
