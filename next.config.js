//
// Copyright 2020 DxOS
//

const path = require('path');
const webpack = require('webpack');
const withImages = require('next-images');
const VersionFile = require('webpack-version-file-plugin');

// Build-time config.
const CONFIG_FILE = (process.env.NODE_ENV === 'production') ? 'config-prod' : 'config-dev';

module.exports = withImages({

  // https://github.com/zeit/next.js/issues/5602
  assetPrefix: (process.env.NODE_ENV === 'production') ? '/console' : '',

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
      // Define directly since EnvironmentPlugin shows warnings for undefined variables.
      new webpack.DefinePlugin({

        // production/development
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),

        // Logging.
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG),

        //
        // yarn well-known
        // curl http://localhost:9000/.well-known/dxos (dev)
        //
        'process.env.WELLKNOWN_ENDPOINT': JSON.stringify(process.env.WELLKNOWN_ENDPOINT),
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
