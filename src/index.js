/* eslint-disable no-use-before-define */

import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import historyApiFallback from './historyApiFallback';
import { getCwd, getPrerenderSettings } from './util';

const OUTPUT_PATH = 'dist';
const PUBLIC_PATH = 'public';

export default function Suprya(options) {
  const {
    disabled,
    routes,
    templatePath = 'src/template.html',
    defaultTitle = 'Suprya App',
    shouldUseSourceMap,
    ...webpackConfig
  } = options;

  if (disabled === true) {
    return webpackConfig;
  }

  const isProduction = webpackConfig.mode === 'production';
  const basePath = getCwd();

  addWebpackDefaults({
    config: webpackConfig,
    basePath,
    isProduction,
    shouldUseSourceMap: shouldUseSourceMap || isProduction
  });

  addHtmlPlugins({
    plugins: webpackConfig.plugins,
    isProduction,
    basePath,
    routes,
    template: templatePath,
    defaultTitle
  });

  // Return optimized webpack config
  return webpackConfig;
}

function addWebpackDefaults({ config, basePath, isProduction, shouldUseSourceMap }) {
  // Set the default entry if not set
  config.entry = config.entry || './src/index.js';

  // Set default output options
  config.output = {
    path: path.resolve(basePath, OUTPUT_PATH),
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    publicPath: '/',
    ...config.output
  };

  if (!config.devtool) {
    config.devtool = shouldUseSourceMap ? 'source-map' : 'cheap-module-source-map';
  }

  if (!config.plugins) {
    config.plugins = [];
  }

  if (isProduction) {
    if (!config.optimization) {
      config.optimization = {
        // Automatically split vendor and commons
        // https://twitter.com/wSokra/status/969633336732905474
        splitChunks: {
          chunks: 'all'
        },
        // Keep the runtime chunk seperated to enable long term caching
        // https://twitter.com/wSokra/status/969679223278505985
        runtimeChunk: true
      };
    }

    // 'Hoist' or concatenate the scope of all the modules
    // https://webpack.js.org/plugins/module-concatenation-plugin/
    config.plugins.push(new webpack.optimize.ModuleConcatenationPlugin());
  } else {
    const publicDir = path.resolve(basePath, PUBLIC_PATH);

    // Serve physical files from the public directory
    config.devServer = {
      contentBase: publicDir
    };

    // Apply the webpack-serve historyApiFallback addon
    config.serve = historyApiFallback(publicDir);
  }
}

function addHtmlPlugins({ plugins, isProduction, basePath, routes, template, defaultTitle }) {
  // Serve default index.html when not in production
  if (!isProduction) {
    plugins.push(
      new HtmlWebpackPlugin({
        template
      })
    );

    return;
  }

  const htmlPrerenderConfig = values => {
    const { url, title } = values;
    const settings = getPrerenderSettings(url);

    return {
      ...values,
      filename: path.resolve(basePath, url.substring(1), 'index.html'),
      template: `!!prerender-loader?${settings}!${template}`,
      // Opinionated minify options
      // https://github.com/kangax/html-minifier#options-quick-reference
      minify: {
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeComments: true
      },
      compile: true,
      title: title || defaultTitle
    };
  };

  const htmlPlugins = routes.map(htmlPrerenderConfig).map(config => new HtmlWebpackPlugin(config));

  plugins.push(...htmlPlugins);
}
