//
// Copyright 2020 Wireline, Inc.
//

import debug from 'debug';
import merge from 'lodash.merge';
import sort from 'sort-json';

import build from '../../version.json';

import defaults from '../../config/defaults.yml';
// Config file is set by webpack.
// eslint-disable-next-line import/no-unresolved
import defaultsForEnv from '../../config/__DEFAULTS_FILE__.yml';

// TODO(burdon): Use dxos/config.
const config = sort(merge({}, build, defaults, defaultsForEnv, {
  system: {
    env: process.env.NODE_ENV,
    debug: process.env.DEBUG,
    configFile: process.env.CONFIG_FILE
  }
}));

// Config logging.
debug.enable(config.system.debug);

export default config;
