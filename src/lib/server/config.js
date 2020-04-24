//
// Copyright 2020 Wireline, Inc.
//

import assert from 'assert';
import debug from 'debug';
import fs from 'fs';
import merge from 'lodash.merge';
import sort from 'sort-json';
import yaml from 'js-yaml';

import staticConfig from '../config';

/**
 * Loads the config file.
 * @return {Promise<Object>}
 */
export const getConfig = async () => {
  const { system: { configFile } } = staticConfig;
  if (!configFile) {
    return staticConfig;
  }

  const runtimeConfig = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'));

  const config = sort(merge({}, staticConfig, runtimeConfig));

  debug.enable(config.system.debug);

  return config;
};

/**
 * Config middleware
 * @param {Function} handler
 */
export const withConfig = handler => async (req, res) => {
  const config = await getConfig();
  req.config = config;
  return handler(req, res);
};

/**
 * Return dynamic configuration (loads config file).
 * Returned `props` are passed to the component.
 * NOTE: This function must be exported in each page that requires it.
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering

 * @param {Object} ctx - Request context
 * @returns {Promise<{props}>}
 */
export const getServerSideProps = async () => {
  assert(typeof window === 'undefined');

  return {
    props: {
      config: await getConfig()
    }
  };
};
