var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');

// Base kind for all Application views
module.exports = kind({
    name: 'InterfaceBase',
    classes: 'biblesupersearch_container',

    create: function() {
        this.inherited(arguments);
    }
});
