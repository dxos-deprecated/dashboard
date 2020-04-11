//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';
import debug from 'debug';
import get from 'lodash.get';
import merge from 'lodash.merge';

import build from '../version.json';

// Config file is set by webpack.
// eslint-disable-next-line import/no-unresolved
import defaults from '../config/__CONFIG_FILE__.yml';

import { httpGet, joinUrl } from './util';

// TODO(burdon): Use dxos/config.
const config = merge({}, build, defaults, {
  system: {
    env: process.env.NODE_ENV,
    debug: process.env.DEBUG,
    wellknownEndpoint: process.env.WELLKNOWN_ENDPOINT
  }
});

// Config logging.
debug.enable(config.system.debug);

/**
 * Retrieve dynamic configuration via `./well-known` path.
 * https://tools.ietf.org/html/rfc5785
 *
 * Called by client before rendering each page to override config defaults.
 * @param {string} [url]
 * @returns {Promise<{}>}
 */
// TODO(burdon): Get this from wire on startup (shouldn't poll this endpoint).
export const getDyanmicConfig = async (url = config.system.wellknownEndpoint) => {
  if (!url) {
    console.warn('No metadata endpoint.');
    return config;
  }

  return httpGet(url)
    .then(({ result }) => {
      return {
        ...config,
        ...result
      };
    });
};

/**
 * Returns a relative URL if a route is specifed.
 * @param {Object} config
 * @param {string} service
 * @param {string} [pathname]
 * @returns {string|*}
 */
export const getServiceUrl = (config, service, pathname) => {
  const { routes, services } = config;

  const url = get(routes, service, get(services, service));
  assert(url, `Invalid service definition: ${service}`);

  return joinUrl(url, pathname);
};

export default config;
