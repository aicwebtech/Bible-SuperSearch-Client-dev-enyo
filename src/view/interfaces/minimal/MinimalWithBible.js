var kind = require('enyo/kind');
var formView = require('../../../forms/MinimalWithBible');
var MinimalBase = require('./MinimalBase');

module.exports = kind({
    name: 'MinimalWithBible',
    kind: MinimalBase,
    formView: formView,

    create: function() {
        this.inherited(arguments);
    
    }
});
