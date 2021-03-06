const { resolve } = require('path');
const rtl = require('postcss-rtl');
const defaultWebpackConfig = require('terra-toolkit/config/webpack/webpack.config');
const merge = require('webpack-merge');
const webpackConfigLoader = require('react-on-rails/webpackConfigLoader');
const Autoprefixer = require('autoprefixer');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const GatherDependencies = require('./plugins/gather-dependencies');
const theme = require('./themes/default');

const configPath = resolve('..', 'config');
const { output } = webpackConfigLoader(configPath);

const config = {
  context: resolve(__dirname),
  entry: {
    attributes: ['raf/polyfill', 'core-js/stable', './app/bundles/kaiju/startup/attributesRegistration'],
    code: ['raf/polyfill', 'core-js/stable', './app/bundles/kaiju/startup/codeRegistration'],
    component: ['raf/polyfill', 'core-js/stable', './app/bundles/kaiju/startup/componentRegistration'],
    guide: ['raf/polyfill', 'core-js/stable', './app/bundles/kaiju/startup/guideRegistration'],
    launch: ['raf/polyfill', 'core-js/stable', './app/bundles/kaiju/startup/launchPageRegistration'],
    preview: ['raf/polyfill', 'core-js/stable', './app/bundles/kaiju/startup/previewRegistration'],
    project: ['raf/polyfill', 'core-js/stable', './app/bundles/kaiju/startup/projectRegistration'],
  },
  output: {
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].chunk.js',
    publicPath: output.publicPath,
    path: output.path,
  },
  plugins: [
    new GatherDependencies(),
    new ManifestPlugin({ publicPath: output.publicPath, writeToFileEmit: true }),
  ],
  module: {
    rules: [
      {
        test: /\.(less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
              modules: {
                mode: 'global',
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins() {
                return [
                  rtl(),
                  Autoprefixer(),
                ];
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: theme,
              javascriptEnabled: true,
            },
          },
        ],
      },
    ],
  },
};

module.exports = (env, argv) => (
  merge(defaultWebpackConfig(env, argv), config)
);
