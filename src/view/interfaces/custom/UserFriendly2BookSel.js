var kind = require('enyo/kind');
var Base = require('../classic/ClassicBase');
var formView = require('../../../forms/CustomUserFriendly2BookSel');

module.exports = kind({
    name: 'UserFriendly2BookSel',
    kind: Base,
    formView: formView,
    FormatButtonsHideExtras: true,
    FormatButtonsHideExtrasSupported: true,

    create: function() {
        this.inherited(arguments);
    }
});
