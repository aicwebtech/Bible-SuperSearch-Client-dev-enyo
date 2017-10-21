var kind = require('enyo/kind');
var Anchor = require('enyo/Anchor');
var LinkBuilder = require('./LinkBuilder');

module.exports = kind({
    name: 'Link',
    kind: Anchor,
    LinkBuilder: LinkBuilder,

});
