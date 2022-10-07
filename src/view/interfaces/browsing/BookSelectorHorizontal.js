var kind = require('enyo/kind');
var Base = require('./BrowsingBase');
var formView = require('../../../forms/BrowsingBookSelectorHorizontal');

module.exports = kind({
    name: 'BookSelectorHorizontal',
    kind: Base,
    formView: formView,
    FormatButtonsHideExtras: false,
    FormatButtonsHideExtrasSupported: false,
    
    create: function() {
        this.inherited(arguments);
    }
});
