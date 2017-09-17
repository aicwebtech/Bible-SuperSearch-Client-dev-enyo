var kind = require('enyo/kind');
var Base = require('./ClassicBase');
var formView = require('../../../forms/ClassicUserFriendly2');

module.exports = kind({
    name: 'UserFriendly2',
    kind: Base,
    formView: formView,
    create: function() {
        this.inherited(arguments);
        this.log();
    }
});
