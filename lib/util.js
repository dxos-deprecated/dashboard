//
// Copyright 2020 Wireline, Inc.
//

/** Useful so that react effects do not receive promises (i.e., must not return a promise). */
export const noPromise = f => (...args) => { f(...args); };

/** Concat error strings */
export const joinErrors = errors => {
  return errors ? errors.map(({ message }) => message).join('; ') : '';
};
