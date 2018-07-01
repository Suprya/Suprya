import history from 'connect-history-api-fallback';
import convert from 'koa-connect';

export default basePath => ({
  content: basePath,
  add(app) {
    app.use(convert(history()));
  }
});
