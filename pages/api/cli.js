//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { exec } from './util/exec';

const log = debug('dxos:dashboard:cli');

export default async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams } = url;

  const command = searchParams.get('command');

  let statusCode = 200;
  let result = {};
  try {
    switch (command) {
      case 'version': {
        // TODO(burdon): Expect JSON.
        const { output: version } = await exec('wire', { args: ['version'] });
        result = version;
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
