<div align="center">
  <img width="150" height="150" alt="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>PostCSS Plugin</h1>
  <p>Use <a href="https://github.com/postcss/postcss/">PostCSS</a> with PostHTML</p>

  [![Version][npm-version-shield]][npm]
  [![Build][github-ci-shield]][github-ci]
  [![License][license-shield]][license]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## Install

```bash
npm i -D posthtml-postcss
```

## Usage

```js
import {dirname} from 'node:path'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'

import posthtml from 'posthtml'
import postcss from 'posthtml-postcss'

const postcssPlugins = []
const postcssOptions = {}
const filterType = /^text\/css$/

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const filePath = `${__dirname}/index.html`
const html = readFileSync(filePath, 'utf8')

posthtml([ 
  postcss(postcssPlugins, postcssOptions, filterType) 
])
  .process(html, {from: filePath})
  .then((result) => console.log(result.html))
```

If you don't pass any arguments to `posthtml-postcss`, it will try to use your project's PostCSS configuration (see [`postcss-load-config`](https://www.npmjs.com/package/postcss-load-config)).

Notice that we're setting the option `from` when calling `process`. `posthtml-postcss` forwards this to PostCSS, which is useful for syntax error messages. (`postcss-cli` and `gulp-posthtml` are setting `from` automatically.)

## Example

```js
import posthtml from 'posthtml'
import postcss from 'posthtml-postcss'
import autoprefixer from 'autoprefixer'

const postcssPlugins = [
  autoprefixer({ browsers: ['last 2 versions'] })
]
const postcssOptions = {}
const filterType = /^text\/css$/

const html = `
  <style>div { display: flex; }</style>
  <div style="display: flex;">Text</div>
`

posthtml([ 
  postcss(postcssPlugins, postcssOptions, filterType) 
])
  .process(html)
  .then(result => console.log(result.html))
```

Output:

```html
<style>
  div { display: -webkit-flex;display: -ms-flexbox;display: flex; }
</style>
<div style="display: -webkit-flex;display: -ms-flexbox;display: flex;">
  Text
</div>
```

[npm]: https://www.npmjs.com/package/posthtml-postcss
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-postcss.svg
[npm-stats]: https://npm-stat.com/charts.html?package=posthtml-postcss
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-postcss.svg
[github-ci]: https://github.com/posthtml/posthtml-postcss/actions/workflows/nodejs.yml
[github-ci-shield]: https://github.com/posthtml/posthtml-postcss/actions/workflows/nodejs.yml/badge.svg
[license]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/posthtml-postcss.svg
