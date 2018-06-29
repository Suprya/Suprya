const history = require('connect-history-api-fallback');
const convert = require('koa-connect');

// See https://github.com/bripkens/connect-history-api-fallback
module.exports = {
  add: app => {
    app.use(convert(history()));
  }
};
