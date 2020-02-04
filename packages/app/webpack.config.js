//
// Copyright 2019 Wireline, Inc.
//

const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: './src/main',

  plugins: [
    // https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebPackPlugin({
      template: './public/index.html',
      templateParameters: {
        title: 'Dashboard'
      }
    })
  ],

  devtool: 'eval-source-map',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    disableHostCheck: true,
    port: 8080,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 600
    }
  },

  node: {
    fs: 'empty'
  },

  output: {
    path: `${__dirname}/dist`,
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      // js/mjs
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  resolve: {
    alias: {
      '@material-ui/styles': path.resolve(__dirname, '..', '..', 'node_modules/@material-ui/styles'),
      'react': path.resolve(__dirname, '..', '..', 'node_modules/react'),
      'react-dom': path.resolve(__dirname, '..', '..', 'node_modules/react-dom')
    }
  }
};
