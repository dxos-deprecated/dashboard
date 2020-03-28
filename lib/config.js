//
// Copyright 2020 DxOS
//

// TODO(burdon): @dxos/config

import config from '../config.yml';

import { version } from '../package.json';

config.version = version;

export default config;
