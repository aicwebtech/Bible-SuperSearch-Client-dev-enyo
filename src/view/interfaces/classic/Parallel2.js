var kind = require('enyo/kind');
var Base = require('./ClassicBase');
var formView = require('../../../forms/ClassicParallel2');

module.exports = kind({
    name: 'Parallel2',
    kind: Base,
    formView: formView,
    FormatButtonsHideExtras: false,
    FormatButtonsHideExtrasSupported: false,

    create: function() {
        this.inherited(arguments);
    }
});
