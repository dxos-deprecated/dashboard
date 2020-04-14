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

const log = debug('dxos:dashboard:config');

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
 * Return dynamic configuration (loads config file).
 * Returned `props` are passed to the component.
 * NOTE: This function must be exported in each page that requires it.
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering

 * @param {Object} ctx - Request context
 * @returns {Promise<{props}>}
 */
export const getServerSideProps = async (ctx) => {
  assert(typeof window === 'undefined');

  const config = await getConfig();

  if (process.env.BASE_URL) {
    config.baseUrl = process.env.BASE_URL;
    log('Base URL set by ENV.');
  } else if (!config.baseUrl) {
    const protocol = ctx.req.socket.encrypted ? 'https' : 'http';
    const { host } = ctx.req.headers;
    config.baseUrl = `${protocol}://${host}`;
    log('Base URL not configured, using default value.');
  }
  log(`Base URL: ${config.baseUrl}`);

  // Must set `null` because `undefined` is not serializable.
  return {
    props: {
      config
    }
  };
};
