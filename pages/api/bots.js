//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { exec } from './exec';
import { TOPIC, SECRET_KEY } from '../../lib/bot_factory';

const BOT_FACTORY_LOG_FILE_PATH = '/tmp/bot-factory.log';

// Number of lines to tail from the log file when polling.
const BOT_FACTORY_LOG_NUM_LINES = 50;

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
        const args = [
          'bot', 'factory', 'start',
          '--topic', TOPIC,
          '--secret-key', SECRET_KEY,
          '--single-instance',
          '2>&1', '|', 'tee', BOT_FACTORY_LOG_FILE_PATH
        ];
        result = await exec('wire', { args, wait: /bot-factory/ });
        break;
      }

      case 'shutdown': {
        result = await exec('wire', { args: ['bot', 'factory', 'stop'] });
        break;
      }

      case 'status': {
        const status = await exec('wire', { args: ['bot', 'factory', 'status', '--topic', TOPIC] });
        result = status ? JSON.parse(status) : { started: 'false' };
        break;
      }

      case 'log': {
        const log = await exec('tail', { args: [`-${BOT_FACTORY_LOG_NUM_LINES}`, BOT_FACTORY_LOG_FILE_PATH] });
        result = log ? log.split('\n') : [];
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
