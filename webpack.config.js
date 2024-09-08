const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = [
  // Browser configuration
  {
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.browser.js',
      library: {
        name: '@xinferai/help-utils',
        type: 'umd',
      },
      globalObject: 'this',
    },
    target: 'web',
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    devtool: 'source-map',
  },
  // Node.js configuration
  {
    entry: './index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.node.js',
      library: {
        type: 'commonjs2',
      },
    },
    target: 'node',
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    devtool: 'source-map',
  },
];
