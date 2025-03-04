import postcss from 'postcss'
import postcssConfig from 'postcss-load-config'

const plugin = (plugins = null, options = null, filterType = null) => {
  if (plugins === null && options === null && filterType === null) {
    const rc = postcssConfig.sync()
    plugins = rc.plugins
    options = rc.options
  }

  plugins = [].concat(plugins).filter(Boolean)
  options = options || {}

  const css = postcss(plugins)

  return tree => {
    const promises = []

    tree.walk(node => {
      let promise

      if (node?.tag === 'style' && node.content) {
        let meetsFilter = true

        if (filterType) {
          const typeAttr = (node.attrs?.type) ? node.attrs.type.trim() : ''
          const meetsTypeAttr = filterType.test(typeAttr)
          const meetsStandardType = filterType.test('text/css') && (meetsTypeAttr || typeAttr === '')
          const meetsOtherType = !meetsStandardType && meetsTypeAttr
          meetsFilter = meetsStandardType || meetsOtherType
        }

        if (meetsFilter) {
          const styles = [].concat(node.content).join('')
          const from = options.from || tree.options.from

          promise = css.process(styles, {...options, from})
            .then(result => {
              node.content = [result.css]
            })

          promises.push(promise)
        }
      }

      if (node?.attrs?.style) {
        promise = css.process(node.attrs.style, options)
          .then(result => {
            node.attrs.style = result.css
          })

        promises.push(promise)
      }

      return node
    })

    return Promise.all(promises).then(() => {
      return tree
    })
  }
}

export default plugin
