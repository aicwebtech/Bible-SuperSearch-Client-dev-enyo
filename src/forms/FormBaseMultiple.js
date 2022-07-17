var FormBase = require('./FormBase');
var kind = require('enyo/kind');

module.exports = kind({
   name: 'FormBaseMultiple',
   kind: FormBase,
   containsSubforms: true
});
