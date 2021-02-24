var kind = require('enyo/kind');
var formView = require('../../../forms/MinimalWithParallelBible');
var MinimalBase = require('./MinimalBase');

module.exports = kind({
    name: 'MinimalWithParallelBible',
    kind: MinimalBase,
    formView: formView,

    create: function() {
        this.inherited(arguments);
    
    }
});
