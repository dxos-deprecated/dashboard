//
// Copyright 2020 DxOS
//

// TODO(burdon): @dxos/config
import debug from 'debug';

// Config file is set by webpack.
// eslint-disable-next-line import/no-unresolved
import config from '../__CONFIG_FILE__.yml';

import { build } from '../version.json';

debug.enable(config.app.debug || process.env.DEBUG);

export default {
  ...config,
  build
};
