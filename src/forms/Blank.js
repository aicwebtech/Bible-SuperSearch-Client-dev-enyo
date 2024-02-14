var kind = require('enyo/kind');

var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');

// Blank form - no visible form elements but everything else still needs to work!
module.exports = kind({
    name: 'Blank',
    kind: FormBase,

    components: [

    ], 
});
