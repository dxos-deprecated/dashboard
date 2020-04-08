//
// Copyright 2020 DxOS
//

const path = require('path');
const webpack = require('webpack');
const withImages = require('next-images');
const VersionFile = require('webpack-version-file-plugin');

// Build-time config.
const CONFIG_FILE = process.env.CONFIG_FILE || 'config-dev';

//
// yarn config-server
// curl http://localhost:9000/.well-known/dxos (dev)
// curl http://localhost/.well-known/dxos (production)
//
const CONFIG_ENDPOINT = process.env.CONFIG_ENDPOINT || 'http://127.0.0.1:9000/.well-known/dxos';

module.exports = withImages({

  // https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
  serverRuntimeConfig: {},
  publicRuntimeConfig: {},

  webpack(config) {
    config.module.rules.push(
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
      {
        test: /\.ya?ml$/,
        use: 'js-yaml-loader',
      },
    );

    config.plugins.push(
      new webpack.EnvironmentPlugin({
        CONFIG_ENDPOINT: String(CONFIG_ENDPOINT),
        DEBUG: String(process.env.DEBUG),
        NODE_ENV: String(process.env.NODE_ENV),
      }),

      // Define the build config file based on the target.
      // https://webpack.js.org/plugins/normal-module-replacement-plugin
      new webpack.NormalModuleReplacementPlugin(/(.*)__CONFIG_FILE__/, (resource) => {
        resource.request = resource.request.replace(/__CONFIG_FILE__/, CONFIG_FILE);
      }),

      new VersionFile({
        packageFile: path.join(__dirname, 'package.json'),
        outputFile: path.join(__dirname, 'version.json')
      })
    );

    return config;
  }
});
