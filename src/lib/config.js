//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';
import debug from 'debug';
import get from 'lodash.get';
import merge from 'lodash.merge';
import sort from 'sort-json';

import build from '../../version.json';

// Config file is set by webpack.
// eslint-disable-next-line import/no-unresolved
import defaults from '../../config/__DEFAULTS_FILE__.yml';

import { joinUrl } from './util';

// TODO(burdon): Use dxos/config.
const config = sort(merge({}, build, defaults, {
  system: {
    env: process.env.NODE_ENV,
    debug: process.env.DEBUG,
    configFile: process.env.CONFIG_FILE
  }
}));

// Config logging.
debug.enable(config.system.debug);

/**
 * Returns an absolute URL to the specified service. If a route is specified that will be used,
 * but if not, it will be a direct URL to the service.
 * // TODO(telackey): Do we have to deal with multiaddrs?
 * @param {Object} config
 * @param {string} service
 * @param {string} [pathname]
 * @returns {string|*}
 */
export const getServiceUrl = (config, service, pathname) => {
  const { routes, services, baseUrl } = config;
  assert(baseUrl, `Invalid baseUrl: ${baseUrl}`);

  const routeOrService = get(routes, service, get(services, service));
  assert(routeOrService, `Invalid service definition: ${service}`);

  const url = joinUrl(routeOrService, pathname);

  return url.match(/^https?:/) ? url : joinUrl(config.baseUrl, url);
};

export default config;
