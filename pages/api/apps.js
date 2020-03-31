//
// Copyright 2020 DxOS
//

import debug from 'debug';
import find from 'find-process';

import config from '../../lib/config';

import { exec } from './util/exec';

const log = debug('dxos:dashboard:apps');

// TODO(burdon): Currently paths and ports are hard-coded in the apache config.
// TODO(burdon): The path isn't required since the frontend proxy maps the external path to the server's port.
// Otherwise, the registry record must contain the path information.

// TODO(burdon): Configure nginx to re-route on the fly? via WNS query.
// /app/editor/1.2

const ROUTES = {
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

const DEFAULT_PORT = 8100;

export default async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { searchParams } = url;

  const command = searchParams.get('command');
  const name = searchParams.get('name');
  const wrn = `wrn:app:${name}`;

  let statusCode = 200;
  let result = {};
  let error;
  try {
    switch (command) {
      case 'list': {
        const list = await find('name', 'wrn:app');
        // https://github.com/yibn2008/find-process#readme
        const apps = list.map(({ pid, cmd }) => {
          const [, ...args] = cmd.split(' ');

          let app;
          let port;
          let path;
          let argList = [];
          args.reverse().forEach(arg => {
            switch (arg) {
              case '--app': {
                // eslint-disable-next-line prefer-destructuring
                app = argList[0];
                argList = [];
                break;
              }

              case '--port': {
                // Assumes routes set-up (no port) in production.
                if (process.env.NODE_ENV !== 'production') {
                  // eslint-disable-next-line prefer-destructuring
                  port = argList[0];
                }
                argList = [];
                break;
              }

              case '--path': {
                // eslint-disable-next-line prefer-destructuring
                path = argList[0];
                argList = [];
                break;
              }

              default: {
                argList.unshift(arg);
              }
            }
          });

          return {
            pid,
            wrn: app,
            port,
            path
          };
        });

        result = { apps };
        break;
      }

      case 'start': {
        const route = ROUTES[name];
        const path = route ? route.path : searchParams.get('path') || '/test';
        const port = route ? route.port : searchParams.get('port') || DEFAULT_PORT;   // Default test port.

        // TODO(burdon): Tag process?
        const args = [
          'app', 'serve',
          '--app', wrn,
          '--path', path,
          '--port', port
        ];

        const env = {
          // TODO(burdon): Which env is required?
          ...process.env,

          WIRE_WNS_ENDPOINT: config.services.wns.endpoint,
          WIRE_IPFS_SERVER: config.services.ipfs.server,
          WIRE_IPFS_GATEWAY: config.services.ipfs.gateway
        };

        // TODO(burdon): This seems to kill the current process?
        const { pid } = await exec('wire', { args, env, detached: true });
        result = { pid, path, port };
        break;
      }

      case 'stop': {
        // TODO(burdon): Specify version.
        // Kill process.
        // ps -ef | grep '[w]rn:app:wireline.io/editor' | awk {'print $1'}
        // https://github.com/yibn2008/find-process#readme
        result = { pids: [] };
        const list = await find('name', wrn);
        list.forEach(({ pid }) => {
          log(`Killing process: ${pid}`);
          // https://nodejs.org/api/process.html#process_process_kill_pid_signal
          process.kill(pid, 'SIGINT');
          result.pids.push(pid);
        });

        break;
      }

      default: {
        statusCode = 400;
      }
    }
  } catch (err) {
    log(err);

    statusCode = 500;
    error = String(err);
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ result, error }));
};
