//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';
import debug from 'debug';
import get from 'lodash.get';
import merge from 'lodash.merge';
import superagent from 'superagent';

import build from '../version.json';

// Config file is set by webpack.
// eslint-disable-next-line import/no-unresolved
import defaults from '../config/__CONFIG_FILE__.yml';

import { joinUrl } from './util';

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
 * Called by client before rendering each page to override config defaults.
 * @param {string} [url]
 * @returns {Promise<{}>}
 */
export const getDyanmicConfig = async (url = config.system.wellknownEndpoint) => {
  if (!url) {
    console.warn('No metadata endpoint.');
    return config;
  }

  return superagent.get(url)
    .then(({ text }) => {
      return {
        ...config,
        ...JSON.parse(text)
      };
    })
    .catch(() => {
      console.error('Error loading system metadata.');
      return config;
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
