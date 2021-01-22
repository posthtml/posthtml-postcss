const posthtml = require('posthtml');
const css = require('..');
const {expect} = require('chai');
const autoprefixer = require('autoprefixer')({overrideBrowserslist: ['ie >= 10']});

function test(html, expected, postcssOptions, typeFilter, plugins, done) {
  plugins = plugins || [autoprefixer];
  expect(posthtml([css(plugins, postcssOptions, typeFilter)])
    .process(html, {from: 'test/test.js'})
    .then(result => {
      expect(expected).to.eql(result.html);
      done();
    }).catch(error => {
      done(error);
    }));
}

describe('use postcss', () => {
  it('object options', () => {
    expect(() => {
      posthtml([css({})]);
    }).to.throw(Error);
  });

  it('options', () => {
    expect(() => {
      posthtml([css([])]);
    }).to.not.throw(Error);
  });

  it('style tag', done => {
    const html = '<style>a {display: flex;}</style>';
    const expected = '<style>a {display: -ms-flexbox;display: flex;}</style>';
    test(html, expected, {}, null, null, done);
  });

  it('style tag empty', done => {
    const html = '<style></style>';
    const expected = '<style></style>';
    test(html, expected, {}, null, null, done);
  });

  it('style attrs', done => {
    const html = '<div style="display: flex;"></div>';
    const expected = '<div style="display: -ms-flexbox;display: flex;"></div>';
    test(html, expected, {}, null, null, done);
  });

  it('style attrs empty', done => {
    const html = '<div style></div>';
    const expected = '<div style=""></div>';
    test(html, expected, {}, null, null, done);
  });

  it('no style', done => {
    const html = 'text <div></div>';
    const expected = 'text <div></div>';
    test(html, expected, {}, null, null, done);
  });

  it('filtered style tag with standard type', done => {
    const html = '<style type="text/css">a {display: flex;}</style>';
    const expected = '<style type="text/css">a {display: -ms-flexbox;display: flex;}</style>';
    test(html, expected, {}, /^text\/css$/, null, done);
  });

  it('filtered style tag with standard type (with spaces)', done => {
    const html = '<style type=" text/css  ">a {display: flex;}</style>';
    const expected = '<style type=" text/css  ">a {display: -ms-flexbox;display: flex;}</style>';
    test(html, expected, {}, /^text\/css$/, null, done);
  });

  it('filtered style tag with standard type (empty string)', done => {
    const html = '<style type="">a {display: flex;}</style>';
    const expected = '<style type="">a {display: -ms-flexbox;display: flex;}</style>';
    test(html, expected, {}, /^text\/css$/, null, done);
  });

  it('filtered style tag with standard type (one empty space)', done => {
    const html = '<style type=" ">a {display: flex;}</style>';
    const expected = '<style type=" ">a {display: -ms-flexbox;display: flex;}</style>';
    test(html, expected, {}, /^text\/css$/, null, done);
  });

  it('filtered style tag with standard type (two empty spaces)', done => {
    const html = '<style type="  ">a {display: flex;}</style>';
    const expected = '<style type="  ">a {display: -ms-flexbox;display: flex;}</style>';
    test(html, expected, {}, /^text\/css$/, null, done);
  });

  it('filtered style tag with non-standard type', done => {
    const html = '<style type="text/other">a {display: flex;}</style>';
    const expected = '<style type="text/other">a {display: -ms-flexbox;display: flex;}</style>';
    test(html, expected, {}, /^text\/other$/, null, done);
  });

  it('filtered out style tag with non-standard type', done => {
    const html = '<style type="text/other">a {display: flex;}</style>';
    const expected = html;
    test(html, expected, {}, /^text\/another$/, null, done);
  });

  it('style tag with newline and not indent', done => {
    const html = 'text <style>\n.test { color: red; }</style>';
    const expected = 'text <style>\n.test { color: red; }</style>';
    test(html, expected, {}, null, null, done);
  });

  it('style tag with newline and multyply indent', done => {
    const html = 'text <style>\n    .test {\n    color: red;\n}</style>';
    const expected = 'text <style>\n    .test {\n    color: red;\n}</style>';
    test(html, expected, {}, null, null, done);
  });

  it('style tag with newline and indent', done => {
    const html = 'text <style>\n    .test { color: red; }</style>';
    const expected = 'text <style>\n    .test { color: red; }</style>';
    test(html, expected, {}, null, null, done);
  });

  it('style tag with newline and indent + plugin remove "\\n" character', done => {
    const html = 'text <style>\n    .test { color: red; }</style>';
    const expected = 'text <style>    .test { color: red; }</style>';

    function plugin(root) {
      root.walk(node => {
        node.raws.before = node.raws.before.replace('\n', '');
      });
    }

    test(html, expected, {}, null, [plugin], done);
  });

  it('includes the file name in the syntax error', done => {
    const html = '<style>.test { color: red</style>';

    posthtml([css([autoprefixer])])
      .process(html, {from: 'test/test.js'})
      .catch(error => {
        expect(error.message).to.include('test/test.js');
        done();
      });
  });

  it('throws if PostCSS configuration is not found', () => {
    expect(() => {
      posthtml([css()]);
    }).to.throw(Error);
  });
});
