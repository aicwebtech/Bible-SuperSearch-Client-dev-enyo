var kind = require('enyo/kind');
var formView = require('../../../forms/MinimalGoRandomParallelBible');
var MinimalBase = require('./MinimalBase');

module.exports = kind({
    name: 'MinimalGoRandomParallelBible',
    kind: MinimalBase,
    formView: formView,

    create: function() {
        this.inherited(arguments);
    
    }
});
