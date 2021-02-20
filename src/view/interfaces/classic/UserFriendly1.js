var kind = require('enyo/kind');
var Base = require('./ClassicBase');
var formView = require('../../../forms/ClassicUserFriendly1');

module.exports = kind({
    name: 'UserFriendly1',
    kind: Base,
    formView: formView,
    FormatButtonsHideExtras: true,
    FormatButtonsHideExtrasSupported: true,
    
    create: function() {
        this.inherited(arguments);
    }
});
