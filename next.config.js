//
// Copyright 2020 DxOS
//

const path = require('path');
const webpack = require('webpack');
const withImages = require('next-images');
const VersionFile = require('webpack-version-file-plugin');

// Build-time config.
const DEFAULTS_FILE = (process.env.NODE_ENV === 'production') ? 'defaults-prod' : 'defaults-dev';

module.exports = withImages({

  // The equivalent of PUBLIC_URL is not supported so fake it by serving pages and assets from the "/console" folder.
  // https://github.com/zeit/next.js/issues/5602
  assetPrefix: (process.env.NODE_ENV === 'production') ? '/console' : '',

  webpack(config) {

    // Required for getServerSideProps server-only require/imports.
    config.node = {
      fs: 'empty'
    };

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

        // Dynamic config.
        'process.env.CONFIG_FILE': JSON.stringify(process.env.CONFIG_FILE),

        //
        // yarn well-known
        // curl http://localhost:9000/.well-known/dxos (dev)
        //
        'process.env.WELLKNOWN_ENDPOINT': JSON.stringify(process.env.WELLKNOWN_ENDPOINT),
      }),

      // Define the build config file based on the target.
      // https://webpack.js.org/plugins/normal-module-replacement-plugin
      new webpack.NormalModuleReplacementPlugin(/(.*)__DEFAULTS_FILE__/, (resource) => {
        resource.request = resource.request.replace(/__DEFAULTS_FILE__/, DEFAULTS_FILE);
      }),

      new VersionFile({
        packageFile: path.join(__dirname, 'package.json'),
        outputFile: path.join(__dirname, 'version.json')
      })
    );

    return config;
  }
});
