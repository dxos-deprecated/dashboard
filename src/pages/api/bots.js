//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { withConfig } from '../../lib/server/config';
import { Service } from '../../lib/server/service';
import { TOPIC, SECRET_KEY } from '../../lib/server/bot_factory';

const SERVICE_NAME = 'bot-factory';

const log = debug('dxos:dashboard:bots');

const handler = async (req, res) => {
  const { config } = req;

  const service = new Service(SERVICE_NAME, config);
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams } = url;

  const command = searchParams.get('command');

  let statusCode = 200;
  let response = {};
  try {
    switch (command) {
      case 'start': {
        const result = await service.runScript(
          command,
          [
            '--topic', TOPIC,
            '--secret-key', SECRET_KEY,
            '--single-instance'
          ]
        );

        response = { result };
        break;
      }

      case 'logs':
      case 'stop': {
        const result = await service.runScript(command);
        response = { result };
        break;
      }

      case 'status': {
        const result = await service.runScript(command, ['--topic', TOPIC]);
        response = { result };
        break;
      }

      default: {
        statusCode = 400;
      }
    }
  } catch (err) {
    log(err);
    statusCode = 500;
    response = {
      error: String(err)
    };
  }

  res.status(statusCode).json(response);
};

export default withConfig(handler);
