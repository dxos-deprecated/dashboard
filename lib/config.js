//
// Copyright 2020 DxOS
//

// TODO(burdon): @dxos/config

import config from '../config.yml';

import { build } from '../version.json';

export default {
  ...config,
  build
};
