var kind = require('enyo/kind');
var Button = require('enyo/Button');
var ClassicPager = require('./ClassicPager');

module.exports = kind({
    name: 'CleanPager',
    kind: ClassicPager,

    firstPageText:  '|&#8678',
    prevPageText: '&#8678',
    nextPageText: '&#8680',
    lastPageText: '&#8680|'

});
