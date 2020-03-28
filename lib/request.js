//
// Copyright 2020 DxOS
//

import superagent from 'superagent';

/** Useful so that react effects do not receive promises (i.e., must not return a promise). */
export const noPromise = f => (...args) => { f(...args); };

/**
 * HTTP GET wrapper to normalize error handling.
 * Dashboard API calls contains optional { error } message.
 *
 * @param {string} url
 * @returns {Promise<{ts, result} | {ts, error:string}>}
 */
export const apiRequest = async url => superagent.get(url)
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
 * @returns {Promise<T | {error, ts: number}>}
 */
export const httpRequest = async url => superagent.get(url)
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