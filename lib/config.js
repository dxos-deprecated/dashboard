//
// Copyright 2020 DxOS
//

// TODO(burdon): @dxos/config
import debug from 'debug';

// TODO(burdon): Dynamic config?
import config from '../config-localhost.yml';

import { build } from '../version.json';

debug.enable(config.app.debug || process.env.DEBUG);

export default {
  ...config,
  build
};
