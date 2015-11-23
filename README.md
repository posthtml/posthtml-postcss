# posthtml-postcss plugin
[![npm version](https://badge.fury.io/js/posthtml-postcss.svg)](http://badge.fury.io/js/posthtml-postcss)

Use PostCSS in HTML document

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
