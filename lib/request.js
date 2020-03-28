//
// Copyright 2020 DxOS
//

import queryString from 'query-string';
import superagent from 'superagent';

export const createUrl = (url, query = undefined) => (query ? `${url}?${queryString.stringify(query)}` : url);

/**
 * HTTP GET wrapper to normalize error handling.
 * Dashboard API calls contains optional { error } message.
 *
 * @param {string} url
 * @param {Object} query
 * @returns {Promise<{ts, result} | {ts, error:string}>}
 */
export const apiRequest = async (url, query) => superagent.get(createUrl(url, query))
  .then(({ body: { result } }) => {
    return ({ ts: Date.now(), result });
  })
  .catch(({ response: { body: { error }, statusText } }) => {
    return ({ ts: Date.now(), error: error || statusText });
  });

/**
 * HTTP GET wrapper to normalize error handling.
 *
 * @param {string} url
 * @param {Object} query
 * @returns {Promise<T | {error, ts: number}>}
 */
export const httpRequest = async (url, query) => superagent.get(createUrl(url, query))
  .then(({ body: result }) => {
    return ({ ts: Date.now(), result });
  })
  .catch(response => {
    let error;
    if (response instanceof Error) {
      error = String(response);
    } else {
      error = response.statusText;
    }

    return ({ ts: Date.now(), error });
  });
