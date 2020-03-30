//
// Copyright 2020 DxOS
//

const path = require('path');
const webpack = require('webpack');
const withImages = require('next-images');
const VersionFile = require('webpack-version-file-plugin');

const CONFIG_FILE = process.env.NODE_ENV === 'development' ? 'config-dev' : 'config-prod';

module.exports = withImages({
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        use: 'js-yaml-loader',
      },
    );

    config.plugins.push(
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
