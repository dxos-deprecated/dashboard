//
// Copyright 2020 DxOS
//

const path = require('path');
const withImages = require('next-images');
const VersionFile = require('webpack-version-file-plugin');

module.exports = withImages({
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        use: 'js-yaml-loader',
      },
    );

    config.plugins.push(
      new VersionFile({
        packageFile: path.join(__dirname, 'package.json'),
        outputFile: path.join(__dirname, 'version.json')
      })
    );

    return config;
  }
});
