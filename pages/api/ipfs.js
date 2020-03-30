//
// Copyright 2020 DxOS
//

import debug from 'debug';

import config from '../../lib/config';

import { exec } from './util/exec';

const log = debug('dxos:dashboard:ipfs');

export default async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams } = url;

  const command = searchParams.get('command');

  let statusCode = 200;
  let result = {};
  let error;
  try {
    switch (command) {
      case 'webui': {
        // curl -Ls -o /dev/null -w %{url_effective} http://127.0.0.1:5001/webui
        const { output } = await exec('curl', { args: [
          '-Ls',
          '-o', '/dev/null',
          '-w', '%{url_effective}',
          config.services.ipfs.webui
        ] });
        result = output;
        break;
      }

      case 'version': {
        const { output } = await exec('ipfs', { args: ['version'] });
        [, result] = output.match(/ipfs version ([0-9\\.]+)/i);
        break;
      }

      case 'start': {
        const { output } = await exec('ipfs', { args: ['daemon', '--writable'], detached: true });
        result = output;
        break;
      }

      case 'shutdown': {
        const { output } = await exec('ipfs', { args: ['shutdown'] });
        result = output;
        break;
      }

      default: {
        statusCode = 400;
      }
    }
  } catch (err) {
    log(err);

    statusCode = 500;
    if (err.match(/ipfs daemon is running/)) {
      error = 'IPFS daemon already running';
    } else {
      error = String(err);
    }
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ result, error }));
};
