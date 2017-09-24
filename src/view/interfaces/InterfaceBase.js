var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');

// Base kind for all Application views
module.exports = kind({
    name: 'InterfaceBase',

    create: function() {
        this.inherited(arguments);
    }
});
