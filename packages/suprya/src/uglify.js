/**
 * UglifyJS Suprya's config preset.
 * By default, we use multi-process parallel running to improve the
 * build speed and we also enable file caching.
 * @param {boolean} config.sourceMap whether to produce source maps
 */
module.exports = ({ sourceMap = false }) => ({
  uglifyOptions: {
    compress: {
      comparisons: false
    },
    mangle: {
      safari10: true
    },
    output: {
      ascii_only: true
    }
  },
  parallel: true,
  cache: true,
  sourceMap
});
