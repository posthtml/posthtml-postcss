/* global Promise */
var postcss = require('postcss');

module.exports = function(plugins, options) {
    plugins = [].concat(plugins);
    options = options || {};

    var css = postcss(plugins);

    return function posthtmlPostcss(tree) {
        var promises = [];

        tree.walk(function(node) {
            var promise;

            if (node.tag === 'style' && node.content) {
                promise = css.process([].concat(node.content).join(''), options)
                    .then(function(result) {
                        node.content = result.css;
                    });

                promises.push(promise);
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
