var kind = require('enyo/kind');
var Base = require('./ClassicBase');
var formView = require('../../../forms/advanced/AdvancedClassic');

module.exports = kind({
    name: 'Advanced',
    FormatButtonsIncludeAdvancedToggle: false,
    kind: Base,
    formView: formView,
    create: function() {
        this.inherited(arguments);
    }
});
