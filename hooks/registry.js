//
// Copyright 2020 Wireline, Inc.
//

import { Registry } from '@wirelineio/registry-client';

import { getServiceUrl } from '../lib/config';
import { isLocalhost } from '../lib/util';

export const useRegistry = () => {
  const endpoint = getServiceUrl('wns.endpoint');

  return {
    webui: getServiceUrl('wns.webui'),
    registry: new Registry(endpoint),
    local: isLocalhost(endpoint)
  };
};
