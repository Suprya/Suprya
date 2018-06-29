const HtmlWebpackPlugin = require('html-webpack-plugin');
const uglify = require('./uglify');

const getTemplateForUrl = (url, templatePath) =>
  `!!prerender-loader?${encodeURIComponent(
    JSON.stringify({ strings: true, params: { url } })
  )}!${templatePath}`;

const createPlugins = (routes, templatePath) =>
  routes.map(
    url =>
      new HtmlWebpackPlugin({
        inject: true,
        filename: `${url}/index.html`,
        template: getTemplateForUrl(url, templatePath)
      })
  );

const createDefaultPlugin = templatePath =>
  new HtmlWebpackPlugin({ inject: true, template: templatePath });

/**
 * @param {string...} config.routes All the routes that will be prerendered using `prerender-loader`
 * @param {boolean} [config.render=true] Whether to enable the prerendering. Only enable this on a production build.
 * @param {templatePath} [config.templatePath="index.html"] webpack require path to the template.
 * @param {*} webpackConfig The webpack config (without HtmlWebpackPlugin plugin instances)
 */
function suprya(config, webpackConfig) {
  const { routes, render = true, templatePath = 'index.html' } = config;

  if (!routes) {
    console.error('No routes to prerender were provided, exiting...');
    process.exit(1);
    return;
  }

  if (!webpackConfig || typeof webpackConfig !== 'object') {
    console.error('Invalid Webpack config was provided. Expected an object');
    process.exit(1);
    return;
  }

  const htmlPlugins = render
    ? createPlugins(routes, templatePath)
    : createDefaultPlugin(templatePath);

  webpackConfig.plugins = (webpackConfig.plugins || []).concat(htmlPlugins);

  return webpackConfig;
}

// Export the uglify module
suprya.uglify = uglify;

module.exports = suprya;
