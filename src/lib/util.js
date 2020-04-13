//
// Copyright 2020 Wireline, Inc.
//

import fetch from 'isomorphic-unfetch';
import queryString from 'query-string';

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
 * Join URL parts.
 * @return {string}
 */
export const joinUrl = (...parts) => parts.filter(Boolean).map(p => (p[0] === '/' ? p.substring(1) : p)).join('/');

/**
 * Creates URL with query string.
 * @param {string} url
 * @param {Object} [query]
 * @return {string}
 */
export const createUrl = (url, query = undefined) => (query ? `${url}?${queryString.stringify(query)}` : url);

/**
 * HTTP GET wrapper to normalize error handling.
 *
 * @param {string} url
 * @param {Object} [query]
 * @returns {Promise<T | {error, ts: number}>}
 */
export const httpGet = async (url, query) => {

  // By default supports CORS with no-cache.
  return fetch(createUrl(url, query))
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
