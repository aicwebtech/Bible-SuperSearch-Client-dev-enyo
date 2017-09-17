var Ajax = require('enyo/Ajax');
var kind = require('enyo/kind');
var Button = require('enyo/Button');
var TopMenu = require('./TopMenu');
var Middle = require('./Middle');
var FittableRows = require('layout/FittableRows');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: "MainView",
    //kind: FittableRows,
    fit: true,
    classes: 'biblesupersearch_container',
    handlers: [
        {'onTapMenu': 'tapMenu'}
    ],
    components: [
        //{content: 'bob'},
        {name: 'TopMenu', kind: TopMenu},
        {name: 'Middle', kind: Middle, fit: true},
        {kind: Signal, onSignalBibleSuperSearch: 'handleBssSignal'}
    ],
    tapMenu: function(inSender, inEvent) {
        this.$.Middle.toggleMenu();
    },
    handleBssSignal: function(inSender, inEvent) {
        this.log(inSender);
        this.log(inEvent);
    },
    sendSignal: function(inSender, inEvent) {
        var sig1 = {
            'sending_app': 'biblesupersearch',
            'target_app': 'test_client',
            'action': 'satisfaction'
        };

        var sig2 = {
            'sending_app': 'biblesupersearch',
            'target_app': 'biblesupersearch',
            'action': 'poke'
        };

        Signal.send('onSignalTestClient', sig1);
        Signal.send('onSignalBibleSuperSearch', sig2);
    }
});
