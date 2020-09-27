var postcss = require('postcss')
var postcssrc = require('postcss-load-config')

module.exports = function (plugins, options, filterType) {
  if (arguments.length === 0) {
    var rc = postcssrc.sync()
    plugins = rc.plugins
    options = rc.options
  }

  plugins = [].concat(plugins).filter(plugin => typeof plugin === 'function')
  options = options || {}

  var css = postcss(plugins)

  return function posthtmlPostcss (tree) {
    var promises = []

    tree.walk(function (node) {
      var promise

      if (node.tag === 'style' && node.content) {
        var meetsFilter = true
        if (filterType) {
          var typeAttr = (node.attrs && node.attrs.type) ? node.attrs.type.trim() : ''
          var meetsTypeAttr = filterType.test(typeAttr)
          var meetsStandardType = filterType.test('text/css') && (meetsTypeAttr || typeAttr === '')
          var meetsOtherType = !meetsStandardType && meetsTypeAttr
          meetsFilter = meetsStandardType || meetsOtherType
        }

        if (meetsFilter) {
          var styles = [].concat(node.content).join('')
          var from = options.from || tree.options.from
          promise = css.process(styles, Object.assign({}, options, { from: from }))
            .then(function (result) {
              node.content = [result.css]
            })

          promises.push(promise)
        }
      }

      if (node.attrs && node.attrs.style) {
        promise = css.process(node.attrs.style, options)
          .then(function (result) {
            node.attrs.style = result.css
          })

        promises.push(promise)
      }

      return node
    })

    return Promise.all(promises).then(function () {
      return tree
    })
  }
}
