//
// Copyright 2020 Wireline, Inc.
//

import debug from 'debug';
import get from 'lodash.get';
import superagent from 'superagent';

import { build } from '../version.json';

import logo from '../config/logo.txt';

// Config file is set by webpack.
// eslint-disable-next-line import/no-unresolved
import staticConfig from '../config/__CONFIG_FILE__.yml';
import { joinUrl } from './util';

// TODO(burdon): Use dxos/config.
const config = {
  build,
  ...staticConfig,
  system: {
    env: process.env.NODE_ENV,
    configFile: process.env.WIRE_CONFIG,

    // TODO(burdon): Remove.
    appRoutes: process.env.WIRE_APP_ROUTES
  }
};

/**
 * Endpoint for dynamic configuration.
 * https://tools.ietf.org/html/rfc5785
 * @type {string}
 */
const DEFAULT_CONFIG_ENDPOINT = process.env.CONFIG_ENDPOINT;

// Config logging.
const log = debug('dxos:dashboard');
debug.enable(process.env.DEBUG);
console.log(logo);
log('Config:', JSON.stringify(config, undefined, 2));

/**
 * @param {string} [url]
 * @returns {Promise<{}>}
 */
export const getDyanmicConfig = async (url = DEFAULT_CONFIG_ENDPOINT) => superagent.get(url)
  .then(({ text }) => {
    return {
      ...config,
      ...JSON.parse(text)
    };
  })
  .catch((response) => {
    console.error(response);
    return config;
  });

/**
 * Returns a relative URL if a route is specifed.
 * @param {string} service
 * @param {string} [pathname]
 * @returns {string|*}
 */
export const getServiceUrl = (service, pathname) => {
  const route = get(config.routes, service);
  const url = get(config.services, service);
  return joinUrl(route || url, pathname);
};

export default config;
