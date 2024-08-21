var kind = require('enyo/kind');
var formView = require('../../../forms/Blank');
var MinimalBase = require('./MinimalBase');

module.exports = kind({
    name: 'NoForm',
    kind: MinimalBase,
    formView: formView,

    create: function() {
        this.inherited(arguments);
    }
});
