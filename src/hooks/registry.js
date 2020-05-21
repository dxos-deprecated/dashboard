//
// Copyright 2020 Wireline, Inc.
//

import { Registry } from '@wirelineio/registry-client';

import { getServiceUrl } from '../lib/util';

export const useRegistry = (config) => {
  const { wns: { chainId } = {} } = config.services;
  let endpoint;

  try {
    // NOTE: Does not work server-side.
    endpoint = getServiceUrl(config, 'wns.server', { absolute: true });
  } catch (err) {
    console.warn('Attempted to make client-side call.');
    return {};
  }

  const registry = new Registry(endpoint, chainId);

  return {
    registry,
    webui: getServiceUrl(config, 'wns.webui', { absolute: true })
  };
};
