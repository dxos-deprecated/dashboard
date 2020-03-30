//
// Copyright 2020 Wireline, Inc.
//

/** Useful so that react effects do not receive promises (i.e., must not return a promise). */
export const ignorePromise = f => (...args) => { f(...args); };

export const createAbsoluteUrl = ({ port, path }) => {
  // eslint-disable-next-line prefer-const
  let { protocol, hostname } = window.location;
  if (hostname === 'localhost') {
    hostname = '127.0.0.1';
  }

  return port ? `${protocol}//${hostname}:${port}${path}` : `${protocol}//${hostname}${path}`;
};
