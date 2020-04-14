//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { exec } from '../../../lib/server/exec';

const log = debug('dxos:dashboard:ipfs');

export default async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams } = url;

  const command = searchParams.get('command');

  let statusCode = 200;
  let result = {};
  try {
    switch (command) {
      case 'version': {
        const { output } = await exec('ipfs', { args: ['version'] });
        [, result] = output.match(/ipfs version ([0-9\\.]+)/i);
        break;
      }

      case 'start': {
        await exec('ipfs', { args: ['daemon', '--writable'], detached: true });
        break;
      }

      case 'shutdown': {
        await exec('ipfs', { args: ['shutdown'] });
        break;
      }

      default: {
        statusCode = 400;
      }
    }
  } catch (err) {
    log(err);
    statusCode = 500;
    result = {
      error: String(err)
    };
  }

  res.status(statusCode).json(result);
};
