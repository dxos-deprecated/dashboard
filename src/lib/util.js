//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';
import fetch from 'isomorphic-unfetch';
import get from 'lodash.get';
import buildUrl from 'build-url';

/** Useful so that react effects do not receive promises (i.e., must not return a promise). */
export const ignorePromise = f => (...args) => { f(...args); };

/**
 * Safely parse a string to JSON.
 * @param {string} text
 * @return {Object|undefined}
 */
export const safeParseJson = (text) => {
  try {
    const obj = JSON.parse(text);
    if (obj && typeof (obj) === 'object') {
      return obj;
    }
  } catch (err) {
    // Ignore, it does not have to be JSON.
  }

  return undefined;
};

/**
 * Determine if local server.
 * @param {string} url
 * @return {boolean}
 */
export const isLocalhost = url => {
  const { hostname } = new URL(url);
  return hostname === '127.0.0.1' || hostname === 'localhost';
};

/**
 * Returns the service URL that can be used by the client.
 * @param {Object} config
 * @param {string} service
 * @param {Object} [options]
 * @param {string} [options.path]
 * @param {boolean} [options.absolute]
 * @returns {string|*}
 */
export const getServiceUrl = (config, service, options = {}) => {
  const { path, absolute = false } = options;
  const { routes, services } = config;

  const appendPath = (url) => buildUrl(url, { path });

  // Relative route.
  const routePath = get(routes, service);
  if (routePath) {
    if (absolute) {
      assert(typeof window !== 'undefined');
      return buildUrl(window.location.origin, { path: appendPath(routePath) });
    }

    // Relative.
    return appendPath(routePath);
  }

  // Absolute service path.
  const serviceUrl = get(services, service);
  assert(serviceUrl, `Invalid service definition: ${service}`);
  return appendPath(serviceUrl);
};

/**
 * HTTP GET wrapper to normalize error handling.
 *
 * @param {string} url
 * @param {Object} [queryParams]
 * @returns {Promise<T | {error, ts: number}>}
 */
export const httpGet = async (url, queryParams) => {

  // By default supports CORS with no-cache.
  return fetch(buildUrl(url, { queryParams }))
    .then(async response => {
      const result = await response.json();
      if (!response.ok) {
        // API requests may return an error message.
        const { error = response.statusText } = result;
        return {
          ts: Date.now(),
          result: {},
          error
        };
      }

      return {
        ts: Date.now(),
        result
      };
    })
    .catch(async err => {
      return {
        ts: Date.now(),
        error: String(err)
      };
    });
};
