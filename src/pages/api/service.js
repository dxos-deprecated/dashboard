//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { withConfig } from '../../lib/server/config';
import { Service } from '../../lib/server/service';

const log = debug('dxos:dashboard:service');

const handler = async (req, res) => {
  const { config } = req;

  let statusCode = 200;
  let response = {};

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const { searchParams } = url;
    const serviceName = searchParams.get('service');
    const command = searchParams.get('command');

    const service = new Service(serviceName, config);

    switch (command) {
      case 'start':
      case 'status':
      case 'stop':
      case 'restart':
      case 'logs': {
        const result = await service.runScript(command);
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
