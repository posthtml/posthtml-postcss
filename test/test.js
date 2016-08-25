/* jshint mocha: true, maxlen: false */
var posthtml = require('posthtml');
var css = require('..');
var expect = require('chai').expect;

function test(html, expected, postcssOptions, done) {
    expect(posthtml([css([require('autoprefixer')({ browsers: ['last 2 versions'] })], postcssOptions)])
        .process(html)
        .then(function(result) {
            expect(expected).to.eql(result.html);
            done();
        }).catch(function(error) {
            done(error);
        }));
}

describe('use postcss', function() {
    it('options', function() {
        expect(function() { posthtml([css([])]); }).to.not.throw(Error);
    });

    it('style tag', function(done) {
        var html = '<style>a {display: flex;}</style>';
        var expected = '<style>a {display: -ms-flexbox;display: flex;}</style>';
        test(html, expected, {}, done);
    });

    it('style tag empty', function(done) {
        var html = '<style></style>';
        var expected = '<style></style>';
        test(html, expected, {}, done);
    });

    it('style attrs', function(done) {
        var html = '<div style="display: flex;"></div>';
        var expected = '<div style="display: -ms-flexbox;display: flex;"></div>';
        test(html, expected, {}, done);
    });

    it('style attrs empty', function(done) {
        var html = '<div style></div>';
        var expected = '<div style=""></div>';
        test(html, expected, {}, done);
    });

    it('no style', function(done) {
        var html = 'text <div></div>';
        var expected = 'text <div></div>';
        test(html, expected, {}, done);
    });

    it('style tag with newline and not indent', function(done) {
        var html = 'text <style>\n.test { color: red; }</style>';
        var expected = 'text <style>\n.test { color: red; }</style>';
        test(html, expected, {}, done);
    });

    // Angular edge cases
    it('style attrs angular', function(done) {
        var html = '<div style="width: {{mywidth}}"></div>';
        var expected = '<div style="width: {{mywidth}}"></div>';
        test(html, expected, {}, done);
    });
});
