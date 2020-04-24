//
// Copyright 2020 Wireline, Inc.
//

import { Registry } from '@wirelineio/registry-client';

import { getServiceUrl, isLocalhost } from '../lib/util';

export const useRegistry = (config) => {
  const endpoint = getServiceUrl(config, 'wns.server', { absolute: true });
  const registry = new Registry(endpoint);

  return {
    registry,

    webui: getServiceUrl(config, 'wns.webui', { absolute: true }),

    // True if can start/stop from dashbaord.
    local: isLocalhost(endpoint),
  };
};
