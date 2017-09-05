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

});
