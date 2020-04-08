//
// Copyright 2020 Wireline, Inc.
//

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
 * @param parts
 * @return {*}
 */
export const joinUrl = (...parts) => parts.filter(Boolean).map(p => (p[0] === '/' ? p.substring(1) : p)).join('/');
