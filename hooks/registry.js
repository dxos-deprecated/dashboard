//
// Copyright 2020 Wireline, Inc.
//

import { Registry } from '@wirelineio/registry-client';

export const useRegistry = (config) => {
  // eslint-disable-next-line prefer-destructuring
  let endpoint = config.services.wns.endpoint;

  // If localhost, then use the current hostname.
  if (typeof window !== 'undefined' && (endpoint.indexOf('127.0.0.1') !== -1)) {
    const { protocol, hostname } = window.location;
    const { port, graphql } = config.routes.wns;
    endpoint = `${protocol}//${hostname}:${port || 80}${graphql}`;
  }

  return {
    endpoint: endpoint.substring(0, endpoint.lastIndexOf('/')),
    // TODO(burdon): Get endpoint from Registry and do basic checks.
    registry: new Registry(endpoint),
  };
};
