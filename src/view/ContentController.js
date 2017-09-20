// This is specific to twentytwenty and needs to be moved
var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');
var ContentView = require('./Content');
var SettingsView = require('./SettingsView');
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'ContentController',
    kind: ViewController,
    view: ContentView, 
    resetView: true,
    components: [
        {kind: Signal, onContentChange: 'handleContentChange'}
    ],

    handleContentChange: function(inSender, inEvent) {
        // this.log(inEvent);
        // this.log('ContentView', ContentView);
        // this.log('SettingsView', SettingsView);
        var viewChanged = false;

        if(inEvent.content == 'Form') {
            this.set('view', ContentView);
            this.view.set('formView', inEvent.formView);
            viewChanged = true;
        }
        else if(inEvent.content == 'Settings') {
            this.set('view', SettingsView);
            viewChanged = true;
        }

        if(viewChanged) {
            this.render();
        }
    }
});
