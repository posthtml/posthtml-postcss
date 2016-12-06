/* global Promise */
var postcss = require('postcss');

function indentResolve(str, options) {
    if (str.match(/\n(?!\n)\s*/g) === null) {
        return str;
    }

    if (options.length === undefined) {
        options.lastLine = str.substr(str.lastIndexOf('\n') + 1);
        var newStr = str.substr(0, str.lastIndexOf('\n') + 1);
        options.length = Math.min.apply(Math, newStr.match(/\n(?!\n)\s*/g).filter(function(space) {
            return space.length > 2;
        }).map(function(space) {
            return space.length;
        }));

        if (options.length === Infinity) {
            return str;
        }

        options.match = new Array(options.length).join(' ');
        str = str.replace(new RegExp(options.match,'g'), '');
    } else {
        str = str.replace(/\n/g, '\n' + options.match);
        str = str.substr(0, str.lastIndexOf('\n') + 1) + options.lastLine;
    }
    return str;
}

module.exports = function(plugins, options, filterType) {
    plugins = [].concat(plugins);
    options = options || {};

    var css = postcss(plugins);

    return function posthtmlPostcss(tree) {
        var promises = [];

        tree.walk(function(node) {
            var promise,
                indent = {
                length: undefined,
                match: '',
                lastLine: ''
            };

            if (node.tag === 'style' && node.content) {
                var meetsFilter = true;
                if (filterType) {
                    var typeAttr = (node.attrs && node.attrs.type) ? node.attrs.type.trim() : '';
                    var meetsTypeAttr = filterType.test(typeAttr);
                    var meetsStandardType = filterType.test('text/css') && (meetsTypeAttr || typeAttr === '');
                    var meetsOtherType = !meetsStandardType && meetsTypeAttr;
                    meetsFilter = meetsStandardType || meetsOtherType;
                }

                if (meetsFilter) {
                    var styles = indentResolve([].concat(node.content).join(''), indent);
                    promise = css.process(styles, options)
                        .then(function(result) {
                            node.content = [indentResolve(result.css, indent)];
                        });

                    promises.push(promise);
                }
            }

            if (node.attrs && node.attrs.style) {
                promise = css.process(node.attrs.style, options)
                    .then(function(result) {
                        node.attrs.style = result.css;
                    });

                promises.push(promise);
            }

            return node;
        });

        return Promise.all(promises).then(function() {
            return tree;
        });
    };
};
