[![NPM][npm]][npm-url]
[![Deps][deps]][deps-url]
[![Tests][travis]][travis-url]
[![Coverage][cover]][cover-url]

<div align="center">
  <img width="220" height="150" title="PostHTML" src="http://posthtml.github.io/posthtml/logo.svg">
  <img width="108" height="108" title="PostCSS"           src="http://postcss.github.io/postcss/logo.svg" hspace="20">
  <h1>PostCSS Plugin</h1>
  <p>Use <a href="https://github.com/postcss/postcss/">PostCSS</a> in HTML</p>
</div>

<h2 align="center">Install</h2>

```bash
npm i -D posthtml-postcss
```

<h2 align="center">Usage</h2>

```js
const { readFileSync } = require('fs')

const posthtml = require('posthtml')
const postcss = require('posthtml-postcss')

const postcssPlugins = []
const postcssOptions = {}
const filterType = /^text\/css$/

const html = readFileSync('./index.html', 'utf8')

posthtml([ postcss(postcssPlugins, postcssOptions, filterType) ])
    .process(html)
    .then((result) => console.log(result.html))
```

<h2 align="center">Example</h2>

```js
const posthtml = require('posthtml')
const postcss = require('posthtml-postcss')

const postcssPlugins = [
  require('autoprefixer')({ browsers: ['last 2 versions'] })
]
const postcssOptions = {}
const filterType = /^text\/css$/

const html = `
  <style>div { display: flex; }</style>
  <div style="display: flex;">Text</div>
`

posthtml([ postcss(postcssPlugins, postcssOptions, filterType) ])
    .process(html)
    .then((result) => console.log(result.html))
```

```html
<style>
  div { display: -webkit-flex;display: -ms-flexbox;display: flex; }
</style>
<div style="display: -webkit-flex;display: -ms-flexbox;display: flex;">
  Text
</div>
```

<h2 align="center">LICENSE</h2>

> MIT License (MIT)

> Copyright (c) PostHTML Ivan Voischev <voischev.ivan@ya.ru>

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[npm]: https://img.shields.io/npm/v/posthtml-postcss.svg
[npm-url]: https://npmjs.com/package/posthtml-postcss

[deps]: https://david-dm.org/posthtml/posthtml-postcss.svg
[deps-url]: https://david-dm.org/posthtml/posthtml-postcss

[style]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[style-url]: http://standardjs.com/

[travis]: http://img.shields.io/travis/posthtml/posthtml-postcss.svg
[travis-url]: https://travis-ci.org/posthtml/posthtml-postcss

[cover]: https://coveralls.io/repos/github/posthtml/posthtml-postcss/badge.svg?branch=master
[cover-url]: https://coveralls.io/github/posthtml/posthtml-postcss?branch=master
