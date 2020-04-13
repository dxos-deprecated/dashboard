//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';
import get from 'lodash.get';

import { Registry } from '@wirelineio/registry-client';

import { getServiceUrl } from '../lib/config';
import { isLocalhost } from '../lib/util';

export const useRegistry = (config) => {
  const endpoint = get(config, 'services.wns.server');
  assert(endpoint);

  const registry = new Registry(endpoint);

  return {
    webui: getServiceUrl(config, 'wns.webui'),
    local: isLocalhost(endpoint),
    registry,
  };
};
