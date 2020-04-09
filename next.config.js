//
// Copyright 2020 DxOS
//

const path = require('path');
const webpack = require('webpack');
const withImages = require('next-images');
const VersionFile = require('webpack-version-file-plugin');

// Build-time config.
const STATIC_CONFIG_FILE = process.env.STATIC_CONFIG_FILE || 'config-dev';

module.exports = withImages({

  // TODO(burdon): Figure out equivalent of PUBLIC_URL for '/console' prefix.

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
        NODE_ENV: String(process.env.NODE_ENV),
        DEBUG: String(process.env.DEBUG),

        //
        // yarn config-server
        // curl http://localhost:9000/.well-known/dxos (dev)
        // curl http://localhost/.well-known/dxos (production)
        //
        CONFIG_ENDPOINT: String(process.env.CONFIG_ENDPOINT)
      }),

      // Define the build config file based on the target.
      // https://webpack.js.org/plugins/normal-module-replacement-plugin
      new webpack.NormalModuleReplacementPlugin(/(.*)__STATIC_CONFIG_FILE__/, (resource) => {
        resource.request = resource.request.replace(/__STATIC_CONFIG_FILE__/, STATIC_CONFIG_FILE);
      }),

      new VersionFile({
        packageFile: path.join(__dirname, 'package.json'),
        outputFile: path.join(__dirname, 'version.json')
      })
    );

    return config;
  }
});
