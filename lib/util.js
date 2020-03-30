//
// Copyright 2020 Wireline, Inc.
//

/** Useful so that react effects do not receive promises (i.e., must not return a promise). */
export const ignorePromise = f => (...args) => { f(...args); };
