//
// Copyright 2020 Wireline, Inc.
//

import { Registry } from '@wirelineio/registry-client';

import { getServiceUrl, isLocalhost } from '../lib/util';

export const useRegistry = (config) => {
  let endpoint;

  try {
    // If this is tried server-side, it will fail.
    endpoint = getServiceUrl(config, 'wns.server', { absolute: true });
  } catch (err) {
    return {};
  }

  const registry = new Registry(endpoint);

  return {
    registry,
    webui: getServiceUrl(config, 'wns.webui', { absolute: true }),

    // True if can start/stop from dashbaord.
    local: isLocalhost(endpoint),
  };
};
