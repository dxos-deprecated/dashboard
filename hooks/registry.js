//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';

import { Registry } from '@wirelineio/registry-client';

import { getServiceUrl } from '../lib/config';
import { isLocalhost } from '../lib/util';

export const useRegistry = (config) => {
  const endpoint = getServiceUrl(config, 'wns.endpoint');
  assert(endpoint);

  return {
    webui: getServiceUrl(config, 'wns.webui'),
    registry: new Registry(endpoint),
    local: isLocalhost(endpoint)
  };
};
