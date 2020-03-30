//
// Copyright 2020 Wireline, Inc.
//

import debug from 'debug';

import { Registry } from '@wirelineio/registry-client';

import { createAbsoluteUrl } from '../lib/util';

const log = debug('dxos:dashboard:util');

export const useRegistry = (config) => {
  // eslint-disable-next-line prefer-destructuring
  let endpoint = config.services.wns.endpoint;

  if (endpoint.indexOf('localhost') !== -1) {
    log(`WARNING: Use 127.0.0.1 instead of localhost: ${endpoint}`);
    endpoint = endpoint.replace('localhost', '127.0.0.1');
  }

  const local = endpoint.indexOf('127.0.0.1') !== -1;

  // If localhost, then use the current hostname.
  if (typeof window !== 'undefined' && local) {
    const { port, graphql } = config.routes.wns;
    endpoint = createAbsoluteUrl({ port, path: graphql });
  }

  return {
    endpoint: endpoint.substring(0, endpoint.lastIndexOf('/')),
    // TODO(burdon): Get endpoint from Registry and do basic checks.
    registry: new Registry(endpoint),
    local
  };
};
