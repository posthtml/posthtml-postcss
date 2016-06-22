# PostHTML-PostCSS
[![npm version](https://badge.fury.io/js/posthtml-postcss.svg)](https://badge.fury.io/js/posthtml-postcss)
[![Build Status](https://travis-ci.org/posthtml/posthtml-postcss.svg?branch=master)](https://travis-ci.org/posthtml/posthtml-postcss?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/posthtml/posthtml-postcss/badge.svg?branch=master)](https://coveralls.io/github/posthtml/posthtml-postcss?branch=master)

[PostHTML](https://github.com/posthtml/posthtml/) plugin for PostCSS. Use [PostCSS](https://github.com/postcss/postcss/) in HTML document

## Usage
```javascript
var posthtml = require('posthtml'),
    html = '<style>div { display: flex; }</style><div style="display: flex;">Text</div>',
    postcssPlugins = [require('autoprefixer')({ browsers: ['last 2 versions'] })],
    postcssOptions = {};

posthtml()
    .use(require('posthtml-postcss')(postcssPlugins, postcssOptions))
    .process(html)
    .then(function(result) {
        console.log(result.html);
        // <style>div { display: -webkit-flex;display: -ms-flexbox;display: flex; }</style><div style="display: -webkit-flex;display: -ms-flexbox;display: flex;">Text</div>
    })
```

## License

[MIT](LICENSE)
