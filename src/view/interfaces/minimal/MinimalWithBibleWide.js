var kind = require('enyo/kind');
var formView = require('../../../forms/MinimalWithBibleWide');
var MinimalBase = require('./MinimalBase');

module.exports = kind({
    name: 'MinimalWithBible',
    kind: MinimalBase,
    formView: formView,
    classes: 'interface_minimal_wide',

    create: function() {
        this.inherited(arguments);
    }
});
