var kind = require('enyo/kind');
var formView = require('../../../forms/MinimalGoRandomBible');
var MinimalBase = require('./MinimalBase');

module.exports = kind({
    name: 'MinimalGoRandomBible',
    kind: MinimalBase,
    formView: formView,

    create: function() {
        this.inherited(arguments);
    
    }
});
