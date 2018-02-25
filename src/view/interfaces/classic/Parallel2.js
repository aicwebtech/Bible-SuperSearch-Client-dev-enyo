var kind = require('enyo/kind');
var Base = require('./ClassicBase');
var formView = require('../../../forms/ClassicParallel2');

module.exports = kind({
    name: 'Parallel2',
    kind: Base,
    formView: formView,
    create: function() {
        this.inherited(arguments);
    }
});
