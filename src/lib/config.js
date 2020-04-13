//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';
import debug from 'debug';
import get from 'lodash.get';
import merge from 'lodash.merge';

import build from '../../version.json';

// Config file is set by webpack.
// eslint-disable-next-line import/no-unresolved
import defaults from '../../config/__DEFAULTS_FILE__.yml';

import { joinUrl } from './util';

// TODO(burdon): Use dxos/config.
const config = merge({}, build, defaults, {
  system: {
    env: process.env.NODE_ENV,
    debug: process.env.DEBUG,
    configFile: process.env.CONFIG_FILE,
    wellknown: process.env.WELLKNOWN_ENDPOINT,
  }
});

// Config logging.
debug.enable(config.system.debug);

/**
 * Return dynamic configuration (loads config file).
 * Returned `props` are passed to the component.
 * NOTE: This function must be exported in each page that requires it.
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering

 * @param {Object} ctx - Request context
 * @returns {Promise<{props}>}
 */
export const getServerSideProps = async () => {
  assert(typeof window === 'undefined');

  const { system: { configFile } } = config;
  if (!configFile) {
    return {
      props: {
        config
      }
    };
  }

  /* eslint-disable global-require */
  const fs = require('fs');
  const yaml = require('js-yaml');

  const result = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));

  const mergedConfig = {
    ...config,
    ...result
  };

  debug.enable(mergedConfig.system.debug);

  return {
    props: {
      config: mergedConfig
    }
  };
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
