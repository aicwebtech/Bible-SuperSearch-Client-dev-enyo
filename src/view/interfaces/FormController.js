// View Controller Extension for use with forms
// Not sure this is really needed but use anyway
var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'FormController',
    kind: ViewController,
    view: null, 
    resetView: true,
    components: [
        {kind: Signal}
    ],
    create: function() {
        this.inherited(arguments);
        // is this kind even used?
        this.log('yes this is used!');
    }
});
