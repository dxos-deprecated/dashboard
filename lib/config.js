//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';
import debug from 'debug';
import defaultsdeep from 'lodash.defaultsdeep';
import get from 'lodash.get';
import superagent from 'superagent';

import logo from '../config/logo.txt';
import build from '../version.json';

// Config file is set by webpack.
// eslint-disable-next-line import/no-unresolved
import defaults from '../config/__CONFIG_FILE__.yml';

import { joinUrl } from './util';

// TODO(burdon): Use dxos/config.
const config = defaultsdeep({}, build, defaults, {
  system: {
    env: process.env.NODE_ENV,

    /**
     * Endpoint for dynamic configuration.
     * https://tools.ietf.org/html/rfc5785
     * @type {string}
     */
    metadataEndpoint: process.env.CONFIG_ENDPOINT
  }
});

// Config logging.
const log = debug('dxos:dashboard');
debug.enable(process.env.DEBUG);
console.log(logo);
log('Config:', JSON.stringify(config, undefined, 2));

/**
 * Called by client before rendering each page to override config defaults.
 * @param {string} [url]
 * @returns {Promise<{}>}
 */
export const getDyanmicConfig = async (url = config.system.metadataEndpoint) => {
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
