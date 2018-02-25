var kind = require('enyo/kind');
var formView = require('../../../forms/MinimalWithShortBible');
var MinimalBase = require('./MinimalBase');

module.exports = kind({
    name: 'MinimalWithShortBible',
    kind: MinimalBase,
    formView: formView,

    create: function() {
        this.inherited(arguments);
    
    }
});
