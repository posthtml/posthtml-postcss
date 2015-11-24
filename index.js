var postcss = require('postcss');
module.exports = function(plugins, options) {
    plugins = [].concat(plugins);
    options = options || {};

    var css = postcss(plugins);

    return function posthtmlPostcss(tree) {
        tree.walk(function(node) {
            if (node.tag === 'style' && node.content) {
                node.content = [css.process([].concat(node.content).join(''), options).css];
            }
            if (node.attrs && node.attrs.style) {
                node.attrs.style = css.process(node.attrs.style, options).css;
            }
            return node;
        });
    };
};
