# posthtml-postcss plugin
[![npm version](https://badge.fury.io/js/posthtml-postcss.svg)](http://badge.fury.io/js/posthtml-postcss)

Use PostCSS in HTML

## Usage
```javascript
var posthtml = require('posthtml'),
    html = '<html><head><style>a { display: flex; }</style></head><body><a style="border-radius: 5px;" href="#">Text</a></body></html>',
    postcssPlugins = [require('autoprefixer')({ browsers: ['last 2 versions'] })],
    postcssOptions = {};

posthtml()
    .use(require('posthtml-postcss')(postcssPlugins, postcssOptions))
    .process(html)
    .then(function(result) {
        console.log(result.html);
        // <span class="my-component"><span class="my-text text">Text</span></span>
    })
```

## License

[MIT](LICENSE)
