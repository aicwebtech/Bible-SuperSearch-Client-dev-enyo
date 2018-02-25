var kind = require('enyo/kind');
var formView = require('../../../forms/MinimalGoRandom');
var MinimalBase = require('./MinimalBase');

module.exports = kind({
    name: 'MinimalGoRandom',
    kind: MinimalBase,
    formView: formView,

    create: function() {
        this.inherited(arguments);
    
    }
});
