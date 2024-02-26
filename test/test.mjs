import posthtml from 'posthtml'
import {test, expect} from 'vitest'
import plugin from '../lib/index.js'
import autoprefixer from 'autoprefixer'

function process(html, expected, postcssOptions, typeFilter, plugins) {
  return new Promise((resolve, reject) => {
    plugins = plugins || [autoprefixer({ overrideBrowserslist: ['ie >= 10'] })]

    posthtml([plugin(plugins, postcssOptions, typeFilter)])
      .process(html, { from: 'test/test.js' })
      .then(result => {
        if (expected === result.html) {
          resolve()
        } else {
          reject(new Error('Expected HTML does not match result.'))
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

test('object options', () => {
  expect(() => {
    posthtml([plugin({})])
  }).to.throw(Error)
})

test('options', () => {
  expect(() => {
    posthtml([plugin([])])
  }).to.not.throw(Error)
})

test('style tag', () => {
  const html = '<style>a {display: flex;}</style>'
  const expected = '<style>a {display: -ms-flexbox;display: flex;}</style>'

  process(html, expected, {}, null, null)
})

test('style tag (empty)', () => {
  const html = '<style></style>'
  const expected = '<style></style>'

  process(html, expected, {}, null, null)
})

test('style attribute', () => {
  const html = '<div style="display: flex;"></div>'
  const expected = '<div style="display: -ms-flexbox;display: flex;"></div>'

  process(html, expected, {}, null, null)
})

test('style attribute (empty)', () => {
  const html = '<div style></div>'
  const expected = '<div style=""></div>'

  process(html, expected, {}, null, null)
})

test('no style', () => {
  const html = 'text <div></div>'
  const expected = 'text <div></div>'

  process(html, expected, {}, null, null)
})

test('filtered style tag with standard type', () => {
  const html = '<style type="text/css">a {display: flex;}</style>'
  const expected = '<style type="text/css">a {display: -ms-flexbox;display: flex;}</style>'

  process(html, expected, {}, /^text\/css$/, null)
})

test('filtered style tag with standard type (with spaces)', () => {
  const html = '<style type=" text/css  ">a {display: flex;}</style>'
  const expected = '<style type=" text/css  ">a {display: -ms-flexbox;display: flex;}</style>'

  process(html, expected, {}, /^text\/css$/, null)
})

test('filtered style tag with standard type (empty string)', () => {
  const html = '<style type="">a {display: flex;}</style>'
  const expected = '<style type="">a {display: -ms-flexbox;display: flex;}</style>'

  process(html, expected, {}, /^text\/css$/, null)
})

test('filtered style tag with standard type (one empty space)', () => {
  const html = '<style type=" ">a {display: flex;}</style>'
  const expected = '<style type=" ">a {display: -ms-flexbox;display: flex;}</style>'

  process(html, expected, {}, /^text\/css$/, null)
})

test('filtered style tag with standard type (two empty spaces)', () => {
  const html = '<style type="  ">a {display: flex;}</style>'
  const expected = '<style type="  ">a {display: -ms-flexbox;display: flex;}</style>'

  process(html, expected, {}, /^text\/css$/, null)
})

test('filtered style tag with non-standard type', () => {
  const html = '<style type="text/other">a {display: flex;}</style>'
  const expected = '<style type="text/other">a {display: -ms-flexbox;display: flex;}</style>'

  process(html, expected, {}, /^text\/other$/, null)
})

test('filtered out style tag with non-standard type', () => {
  const html = '<style type="text/other">a {display: flex;}</style>'
  const expected = html

  process(html, expected, {}, /^text\/another$/, null)
})

test('style tag with newline and no indentations', () => {
  const html = 'text <style>\n.test { color: red; }</style>'
  const expected = 'text <style>\n.test { color: red; }</style>'

  process(html, expected, {}, null, null)
})

test('style tag with newline and multiple indentations', () => {
  const html = 'text <style>\n    .test {\n    color: red;\n}</style>'
  const expected = 'text <style>\n    .test {\n    color: red;\n}</style>'

  process(html, expected, {}, null, null)
})

test('style tag with newline and indentation', () => {
  const html = 'text <style>\n    .test { color: red; }</style>'
  const expected = 'text <style>\n    .test { color: red; }</style>'

  process(html, expected, {}, null, null)
})

test('style tag with newline and indent + plugin remove "\\n" character', () => {
  const html = 'text <style>\n    .test { color: red; }</style>'
  const expected = 'text <style>    .test { color: red; }</style>'

  function plugin(root) {
    root.walk(node => {
      node.raws.before = node.raws.before.replace('\n', '')
    })
  }

  process(html, expected, {}, null, [plugin])
})

test('includes the file name in the syntax error', () => {
  const html = '<style>.test { color: red</style>'

  posthtml([plugin([autoprefixer({overrideBrowserslist: ['ie >= 10']})])])
    .process(html, {from: 'test/test.js'})
    .catch(error => {
      expect(error.file).to.include('test.js')
    })
})

test('throws if PostCSS configuration is not found', () => {
  expect(() => {
    posthtml([plugin()])
  }).to.throw(Error)
})
