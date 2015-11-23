/* jshint mocha: true, maxlen: false */
var posthtml = require('posthtml');
var plugin = require('../index.js');
var expect = require('chai').expect;

function test(html, referense, options, done) {
    expect(posthtml([plugin([require('autoprefixer')({ browsers: ['last 2 versions'] })], options)])
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
        var html = '<style>display: flex;</style>';
        var referense = '<style>display: -webkit-flex;display: -ms-flexbox;display: flex;</style>';
        test(html, referense, {}, done);
    });

    it('style attrs', function(done) {
        var html = '<div style="display: flex;"></div>';
        var referense = '<div style="display: -webkit-flex;display: -ms-flexbox;display: flex;"></div>';
        test(html, referense, {}, done);
    });
});

