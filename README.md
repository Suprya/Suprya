<h1 align="center">
	Suprya
	<a href="https://www.npmjs.org/package/suprya"><img src="https://img.shields.io/npm/v/suprya.svg?style=flat" alt="npm"></a> <a href="https://travis-ci.org/Suprya/Suprya"><img src="https://travis-ci.org/Suprya/Suprya.svg?branch=master" alt="Travis CI"></a>
</h1>
<p align="center">The <strong>most flexible</strong> JavaScript static site generator, powered by <a href="https://github.com/webpack/webpack">Webpack</a>.</p>

---

## ✨ Features

- Bundle your app using only a `package.json` and `webpack.config.js`
- Opinionated Webpack defaults for both development and production modes
- Prerenders all your app routes _(via [prerender-loader](https://github.com/GoogleChromeLabs/prerender-loader/))_
- Everything is configurable (and uses technologies you already know)

## 🔧 Installation

Install suprya using [`npm`](https://www.npmjs.com/):

```bash
npm i -D suprya
```

The minimum supported Node version is `v6.9.0`

## 📦 Usage

Suprya takes your Webpack config as an input and adds its own opinionated config values for the ultimate developer experience. To start, open your `webpack.config.js` and wrap your exported config with the `suprya()` function:

```js
const suprya = require('suprya');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = suprya({
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
});
```

Suprya will take care of adding the entry (`./src/index.js`) and output (defaults to the `dist` directory) options, adding vendor chunk splitting and applying all the plugins for you. But, don't worry; you can still change all these options if you need more flexibility.

Next, we will add the `src/template.html` file which will be the base of all the prerendered outputs (but will also be used in development mode):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
  </head>
  <body>
    <div id="root">
      {{prerender:./src/prerender.js}}
    </div>
  </body>
</html>
```

As you can see, we've used a [Handlebars](https://handlebarsjs.com/) expression that tells Suprya that the prerendered content (generated by the `prerender.js` file, which we will create on the next step) needs to be appended under `#root`.

Thanks to [prerender-loader](https://github.com/GoogleChromeLabs/prerender-loader) you can either export a String which will be used as the static HTML or automatically render it on the `#root` element. Depending on what library you're using its contents may vary. Here are some examples:

### React app

Suprya supports any kind of router such as [react-router](https://github.com/ReactTraining/react-router) or [Reach router](https://reach.tech/router).

`src/prerender.js`
```js
import React from 'react';
import { renderToString } from 'react-dom/server';

import App from './components/App';

export default () => renderToString(<App />);
```

You can also take a look at the example React app on [`examples/react`](examples/react). It has a README which explains things related to React in greater detail.

### Preact app

TODO

### Submit your own!

You can add your own library by submitting a PR! :grinning:

Suprya will call your `prerender.js` default exported function on production for each one of your routes (we take care of setting the right `window.location` value for you).

Also note that you can export an async function or a Promise in case you might want to wait for the DOM rendering to settle down before allowing Suprya to serialize the document to static HTML:

```js
// Taken from the prerender-loader docs
import { render, options } from 'dom-library';
import App from './App';

// We're done when there are no renders for 50ms:
const IDLE_TIMEOUT = 50;

export default () => new Promise(resolve => {
  let timer;

  // Each time your library re-renders, reset our idle timer:
  options.debounceRendering = commit => {
    clearTimeout(timer);
    timer = setTimeout(resolve, IDLE_TIMEOUT);
    commit();
  }

  // Render into <body> using normal client-side rendering:
  render(<App />, document.body);
})
```

Everything that's left is telling Suprya about what routes you want to prerender (you might not want to render all of them, but it's recommended) by passing a `routes` array to the Suprya config. Go to your `webpack.config.js` file and add the following:

```js
const suprya = require('suprya');

module.exports = suprya({
  routes: [
    {
      url: '/',
      title: 'Home Page'
    },
    {
      url: '/contact',
      title: 'Contact Me'
    }
  ],
  defaultTitle: 'My Awesome App'
  // ...
});
```

Suprya will now prerender `/` and `/contact` on production mode by calling your `prerender.js` default export to produce the `dist/index.html` and `dist/contact/index.html` files.

That's it! You can now run webpack using your preferred CLI. We recommend using the following:

- [`webpack-command`](https://github.com/webpack-contrib/webpack-command) for bundling your files for production. Here are some useful flags and tips:
  - `--bail` will stop the build on the first error.
  - `--run-prod` will apply additional optimizations such as UglifyJS on top of Suprya. ([Details](https://github.com/webpack-contrib/webpack-command#cli))
  - `--progress` will show a nice progress bar.
  - Don't forget to set `NODE_ENV` to `production` ([Instructions](https://gist.github.com/hugmanrique/8e71844cf20f5f49ff856137b723a7ae))
- [`webpack-serve`](https://github.com/webpack-contrib/webpack-serve) for hot reloading your app during development. Here are some useful flags and tips:
  - `--content public/` will statically serve all the files under the `public` directory.
  - Suprya automatically adds the [History API fallback](https://github.com/webpack-contrib/webpack-serve/blob/master/docs/addons/history-fallback.config.js) to fallback to `index.html`.

## 🔨 Options

Suprya shares the same configuration object as Webpack, but will remove all its values from the final Webpack config e.g., in order to pass the `disabled` option you would add the `disabled` key to your `webpack.config.js` file as follows:


```js
const suprya = require('suprya');

module.exports = suprya({
  disabled: true,
  // Other Webpack or Suprya options
});
```

| Option               | Type                          | Default                 | Description                                                                                                                                                                                         |
| -------------------- | ----------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `routes`             | `[{ url, title, meta, ... }]` | `undefined`             | Which routes you want to prerender. Each route has a required `url` key, an optional `title` and additional [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin#options) options. |
| `defaultTitle`       | `string`                      | `"Suprya App"`          | The default title used for pages which haven't specified one.                                                                                                                                       |
| `templatePath`       | `string`                      | `"src/template.html"`   | The location of the HTML template used for prerendering (also used in `development` mode).                                                                                                          |
| `shouldUseSourceMap` | `boolean`                     | `mode === 'production'` | Whether to generate production or development source maps. You can also add the Webpack's `devtool` option which will override Suprya's choice.                                                     |
| `disabled`           | `boolean`                     | `false`                 | Disables Suprya entirely (will return the same passed config). Useful for debugging.                                                                                                                |

## ✅ Opinionated Webpack options

Suprya is an opinionated static-site generator, but stands to be as flexible as possible, so any settings specified below can be overrided (by setting your preferred value on your `webpack.config.js`):

Suprya applies these Webpack options on `production` mode:

| Option                                                               | Value                                                                                                   | Description                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`entry`](https://webpack.js.org/concepts/#entry)                    | `./src/index.js`                                                                                        | Which module Webpack will use to begin building out its internal _dependency graph_. |
| [`output`](https://webpack.js.org/configuration/output/)             | <pre>{<br>  path: '[cwd]/dist',<br>  filename: '[name].[chunkhash].js',<br>  publicPath: '/'<br>}</pre> | Directory where the compiled files will be written.                                  |
| [`devtool`](https://webpack.js.org/configuration/devtool/)           | `source-map`                                                                                            | Place source maps on a different file (ending in `.js.map`).                         |
| [`optimization`](https://webpack.js.org/configuration/optimization/) | <pre>{<br>  splitChunks: {<br>    chunks: 'all'<br>  },<br>  runtimeChunk: true<br>}</pre>              | Splits vendor dependencies and keeps the runtime chunk separated.                    |

Suprya also applies these Webpack options on `development` mode:


| Option                                                                    | Value                                                                                                   | Description                                                                                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [`entry`](https://webpack.js.org/concepts/#entry)                         | `./src/index.js`                                                                                        | Which module Webpack will use to begin building out its internal _dependency graph_.                        |
| [`output`](https://webpack.js.org/configuration/output/)                  | <pre>{<br>  path: '[cwd]/dist',<br>  filename: '[name].[chunkhash].js',<br>  publicPath: '/'<br>}</pre> | Directory where the compiled files will be written.                                                         |
| [`devtool`](https://webpack.js.org/configuration/devtool/)                | `cheap-module-source-map`                                                                               | Generate fast (but bigger) source maps.                                                                     |
| [`devServer`](https://webpack.js.org/configuration/dev-server/#devserver) | <pre>{<br>  contentBase: '[cwd]/public'<br>}</pre>                                                      | Serve static assets from the `public` directory.                                                            |
| [`serve`](https://github.com/webpack-contrib/webpack-serve)               | [`[see src/historyApiFallback.js]`](src/historyApiFallback.js)                                          | Applies the [`historyApiFallback`](https://github.com/webpack-contrib/webpack-serve#add-on-features) addon. |

Additionally, Suprya adds an `HtmlWebpackPlugin` instance in development mode and multiple ones (to make prerendering possible) on production mode. That means you don't need to add the [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin) to your `webpack.config.js` file.

_Note: `[cwd]` refers to the current working directory i.e. the directory where you run the `webpack` CLI from._

## 🛣 Roadmap

- [ ] Inlining the critical CSS and lazy-loading the rest _(via [Critters](https://github.com/GoogleChromeLabs/critters))_
- [ ] Configless route detection (might involve library specific plugins)
- [ ] Automatic template and `prerender.js` creation.
- [x] Prerender all the routes

## 🥂 License

Suprya is open source software [licensed as MIT](LICENSE).