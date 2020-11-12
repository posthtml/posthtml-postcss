const posthtml = require('posthtml')
const css = require('..')
const expect = require('chai').expect

function test (html, expected, postcssOptions, typeFilter, plugins, done) {
  Object.assign(postcssOptions, { from: undefined })
  plugins = plugins || [require('autoprefixer')({ overrideBrowserslist: ['ie >= 10'] })]
  expect(posthtml([css(plugins, postcssOptions, typeFilter)])
    .process(html)
    .then(function (result) {
      expect(expected).to.eql(result.html)
      done()
    }).catch(function (error) {
      done(error)
    }))
}

describe('use postcss', function () {
  it('object options', function () {
    expect(function () { posthtml([css({})]) }).to.throw(Error)
  })

  it('options', function () {
    expect(function () { posthtml([css([])]) }).to.not.throw(Error)
  })

  it('style tag', function (done) {
    const html = '<style>a {display: flex;}</style>'
    const expected = '<style>a {display: -ms-flexbox;display: flex;}</style>'
    test(html, expected, {}, null, null, done)
  })

  it('style tag empty', function (done) {
    const html = '<style></style>'
    const expected = '<style></style>'
    test(html, expected, {}, null, null, done)
  })

  it('style attrs', function (done) {
    const html = '<div style="display: flex;"></div>'
    const expected = '<div style="display: -ms-flexbox;display: flex;"></div>'
    test(html, expected, {}, null, null, done)
  })

  it('style attrs empty', function (done) {
    const html = '<div style></div>'
    const expected = '<div style=""></div>'
    test(html, expected, {}, null, null, done)
  })

  it('no style', function (done) {
    const html = 'text <div></div>'
    const expected = 'text <div></div>'
    test(html, expected, {}, null, null, done)
  })

  it('filtered style tag with standard type', function (done) {
    const html = '<style type="text/css">a {display: flex;}</style>'
    const expected = '<style type="text/css">a {display: -ms-flexbox;display: flex;}</style>'
    test(html, expected, {}, /^text\/css$/, null, done)
  })

  it('filtered style tag with standard type (with spaces)', function (done) {
    const html = '<style type=" text/css  ">a {display: flex;}</style>'
    const expected = '<style type=" text/css  ">a {display: -ms-flexbox;display: flex;}</style>'
    test(html, expected, {}, /^text\/css$/, null, done)
  })

  it('filtered style tag with standard type (empty string)', function (done) {
    const html = '<style type="">a {display: flex;}</style>'
    const expected = '<style type="">a {display: -ms-flexbox;display: flex;}</style>'
    test(html, expected, {}, /^text\/css$/, null, done)
  })

  it('filtered style tag with standard type (one empty space)', function (done) {
    const html = '<style type=" ">a {display: flex;}</style>'
    const expected = '<style type=" ">a {display: -ms-flexbox;display: flex;}</style>'
    test(html, expected, {}, /^text\/css$/, null, done)
  })

  it('filtered style tag with standard type (two empty spaces)', function (done) {
    const html = '<style type="  ">a {display: flex;}</style>'
    const expected = '<style type="  ">a {display: -ms-flexbox;display: flex;}</style>'
    test(html, expected, {}, /^text\/css$/, null, done)
  })

  it('filtered style tag with non-standard type', function (done) {
    const html = '<style type="text/other">a {display: flex;}</style>'
    const expected = '<style type="text/other">a {display: -ms-flexbox;display: flex;}</style>'
    test(html, expected, {}, /^text\/other$/, null, done)
  })

  it('filtered out style tag with non-standard type', function (done) {
    const html = '<style type="text/other">a {display: flex;}</style>'
    const expected = html
    test(html, expected, {}, /^text\/another$/, null, done)
  })

  it('style tag with newline and not indent', function (done) {
    const html = 'text <style>\n.test { color: red; }</style>'
    const expected = 'text <style>\n.test { color: red; }</style>'
    test(html, expected, {}, null, null, done)
  })

  it('style tag with newline and multyply indent', function (done) {
    const html = 'text <style>\n    .test {\n    color: red;\n}</style>'
    const expected = 'text <style>\n    .test {\n    color: red;\n}</style>'
    test(html, expected, {}, null, null, done)
  })

  it('style tag with newline and indent', function (done) {
    const html = 'text <style>\n    .test { color: red; }</style>'
    const expected = 'text <style>\n    .test { color: red; }</style>'
    test(html, expected, {}, null, null, done)
  })

  it('style tag with newline and indent + plugin remove "\\n" character', function (done) {
    const html = 'text <style>\n    .test { color: red; }</style>'
    const expected = 'text <style>    .test { color: red; }</style>'

    function plugin (root) {
      root.walk(function (node) {
        node.raws.before = node.raws.before.replace('\n', '')
      })
    }

    test(html, expected, {}, null, [plugin], done)
  })
})
