//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { exec } from './exec';

const log = debug('dxos:dashboard:apps');

export default async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams } = url;

  const command = searchParams.get('command');
  const name = searchParams.get('name');

  let statusCode = 200;
  let result = {};
  let error;
  try {
    switch (command) {
      case 'start': {
        // TODO(burdon): Currently paths and ports are hard-coded in the apache config.
        // TODO(burdon): The path isn't required since the frontend proxy maps the external path to the server's port.
        // Otherwise, the registry record must contain the path information.
        const routes = {
          'wireline.io/editor': {
            path: '/editor',
            port: 8080
          },
          'wireline.io/todo': {
            path: '/todo',
            port: 8081
          },
          'wireline.io/kanban': {
            path: '/kanban',
            port: 8082
          },
          'wireline.io/chess': {
            path: '/chess',
            port: 8082
          }
        };

        const route = routes[name];
        const path = route ? route.path : searchParams.get('path') || '/';
        const port = route ? route.port : searchParams.get('port') || 8100;   // Default test port.

        const args = [
          'app', 'serve',
          '--app', `wrn:app:${name}`,
          '--path', path,
          '--port', port
        ];

        // TODO(burdon): Parse PID (e.g., "[1] 94685").
        result = await exec('wire', { args, detached: false });
        break;
      }

      case 'stop': {
        // TODO(burdon): Stop process?
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
