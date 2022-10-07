var kind = require('enyo/kind');
var Base = require('./BrowsingBase');
var formView = require('../../../forms/BrowsingBookSelector');

module.exports = kind({
    name: 'BookSelector',
    kind: Base,
    formView: formView,
    FormatButtonsHideExtras: true,
    FormatButtonsHideExtrasSupported: true,
    
    create: function() {
        this.inherited(arguments);
    }
});
