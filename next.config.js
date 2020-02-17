//
// Copyright 2020 DxOS
//

const withImages = require('next-images');

module.exports = withImages({
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        use: 'js-yaml-loader',
      },
    );

    return config;
  }
});
