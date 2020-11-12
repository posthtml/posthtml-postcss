const postcss = require('postcss')

module.exports = function (plugins, options, filterType) {
  plugins = [].concat(plugins).filter(Boolean)
  options = options || {}

  const css = postcss(plugins)

  return function posthtmlPostcss (tree) {
    const promises = []

    tree.walk(function (node) {
      let promise

      if (node.tag === 'style' && node.content) {
        let meetsFilter = true
        if (filterType) {
          const typeAttr = (node.attrs && node.attrs.type) ? node.attrs.type.trim() : ''
          const meetsTypeAttr = filterType.test(typeAttr)
          const meetsStandardType = filterType.test('text/css') && (meetsTypeAttr || typeAttr === '')
          const meetsOtherType = !meetsStandardType && meetsTypeAttr
          meetsFilter = meetsStandardType || meetsOtherType
        }

        if (meetsFilter) {
          const styles = [].concat(node.content).join('')
          promise = css.process(styles, options)
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
