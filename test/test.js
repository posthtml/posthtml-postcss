/* jshint mocha: true, maxlen: false */
var posthtml = require('posthtml');
var css = require('..');
var expect = require('chai').expect;

function test(html, referense, postcssOptions, done) {
    expect(posthtml([css([require('autoprefixer')({ browsers: ['last 2 versions'] })], postcssOptions)])
        .process(html)
        .then(function(result) {
            expect(referense).to.eql(result.html);
            done();
        }).catch(function(error) {
            done(error);
        }));
}

describe('use postcss', function() {

    it('style tag', function(done) {
        var html = '<style>a {display: flex;}</style>';
        var referense = '<style>a {display: -webkit-flex;display: -ms-flexbox;display: flex;}</style>';
        test(html, referense, {}, done);
    });

    it('style tag empty', function(done) {
        var html = '<style></style>';
        var referense = '<style></style>';
        test(html, referense, {}, done);
    });

    it('style attrs', function(done) {
        var html = '<div style="display: flex;"></div>';
        var referense = '<div style="display: -webkit-flex;display: -ms-flexbox;display: flex;"></div>';
        test(html, referense, {}, done);
    });

    it('style attrs empty', function(done) {
        var html = '<div style></div>';
        var referense = '<div style></div>';
        test(html, referense, {}, done);
    });

    it('no style', function(done) {
        var html = 'text <div></div>';
        var referense = 'text <div></div>';
        test(html, referense, {}, done);
    });
});

