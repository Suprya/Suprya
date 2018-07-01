const suprya = require('../../dist/suprya');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = suprya({
  routes: [
    {
      url: '/',
      title: 'Home Page',
      meta: {
        description: 'Welcome to my new Home page!'
      }
    },
    {
      url: '/contact',
      title: 'Contact Me'
    }
  ],
  defaultTitle: 'My Awesome App',
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: ['thread-loader', 'babel-loader']
      }
    ]
  }
});
