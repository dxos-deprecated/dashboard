//
// Copyright 2020 DxOS
//

// TODO(burdon): @dxos/config
import debug from 'debug';

import config from '../config.yml';

import { build } from '../version.json';

debug.enable(config.debug || process.env.DEBUG);

export default {
  ...config,
  build
};
