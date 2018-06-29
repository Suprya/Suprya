# :gem: Suprya

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![license][license]][license-url]

A super-flexible React static site generator based on [Webpack](https://webpack.js.org/) and [Reach Router](https://reach.tech/router) and inspired by [create-react-app](https://github.com/facebook/create-react-app).

## Features

- Get started inmediately, you don't need to configure any tools like Webpack or Babel.
- Prerenders all your pages with [prerender-loader](https://github.com/GoogleChromeLabs/prerender-loader/).
- Wraps webpack, which means you can use your own loaders and plugins by default.
- Works with `webpack-serve` and `webpack-command`
- Uses the latest technology (Babel 7, React 16, Webpack 4...)

## Getting Started

Install suprya using [`npm`](https://www.npmjs.com/):

```bash
npm i -g suprya-cli
```

Or via [`yarn`](https://yarnpkg.com/en/package/suprya-cli):

```bash
yarn global add suprya-cli
```

The minimum supported Node version is `v6.9.0`.

## Creating an app

To create a new app, use this command:

```bash
npx suprya my-awesome-app
```

([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher)

It will create a directory called `my-awesome-app` inside the current folder.
Inside that directory, it will generate the initial project structure and install all the dependencies:

```
my-awesome-app
├── webpack.config.js
├── .babelrc
├── node_modules
├── package.json
├── .gitignore
└── src
    ├── index.js
    └── index.html
```

Once the installation is done, you can open your project folder:

```bash
cd my-awesome-app
```

## Creating a page

First, go to the `webpack.config.js` file and add the new route on the `routes` object:

```js
module.exports = suprya(
  {
    routes: ['/', '/hey'],
    ...
  },
  ...
);
```

Next, let's create the `Hey` component in `index.js` and add it to the [Reach router](https://reach.tech/router) component:

```js
...

const Home = () => <div>Home</div>;
const Hey = () => <div>Hey!</div>;

ReactDOM.render(
  <Router>
    <Home path="/" />
    <Hey path="/hey" />
  </Router>,
  document.getElementById('root')
);
```

Finally, we can either run the app in development mode to see our changes instantaneously or build it to prerender it:

### `npm run start` or `yarn start`

Runs the app in development. Open http://localhost:8080 to view it in the browser.

The page will automatically reload if you make changes to the code. You will see the build errors and lint warnings in the console.

### `npm run build` or `yarn build`

Builds the app for production to the `dist` folder.

It correctly prerenders all your pages (specified on the `webpack.config.js`) and bundles React in production mode. The build is minified using UglifyJS.

Your app is ready to be deployed! :)

## Philosophy

TODO

## What's included?

TODO

## Popular Alternatives

TODO

## License

Suprya is open source software [licensed as MIT](LICENSE).

[npm]: https://img.shields.io/npm/v/suprya-cli.svg
[npm-url]: https://npmjs.com/package/suprya-cli
[node]: https://img.shields.io/node/v/suprya-cli.svg
[node-url]: https://nodejs.org
[deps]: https://img.shields.io/david/suprya/suprya.svg
[deps-url]: https://david-dm.org/suprya/suprya
[tests]: https://img.shields.io/travis/suprya/suprya/master.svg
[tests-url]: https://travis-ci.org/suprya/suprya
[license-url]: LICENSE
[license]: https://img.shields.io/github/license/suprya/suprya.svg