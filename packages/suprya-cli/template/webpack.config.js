const suprya = require('suprya');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const isProd = env === 'production';
const shouldUseSourceMap = isProd;

module.exports = suprya(
  { routes: ['/', '/contact'], render: isProd },
  {
    mode: env,
    entry: 'src/index.js',
    // Don't continue if there are any errors
    bail: isProd,
    devtool: shouldUseSourceMap ? 'source-map' : 'cheap-module-source-map',
    output: {
      path: 'dist',
      publicPath: 'public'
    },
    optimization: isProd
      ? {
          minimizer: [new UglifyJsPlugin(suprya.uglify({ sourceMap: shouldUseSourceMap }))],
          splitChunks: {
            chunks: 'all',
            name: 'vendors'
          },
          // Keep the runtime chunk separated to enable long term caching
          runtimeChunk: true
        }
      : {},
    module: {
      rules: [
        {
          test: /\.js$/,
          include: 'src',
          exclude: /node_modules/,
          use: ['thread-loader', 'babel-loader']
        }
      ]
    },
    plugins: [
      isProd && new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env)
      })
    ].filter(Boolean)
  }
);
