var kind = require('enyo/kind');
var Signal = require('enyo/Signals');
var Component = require('enyo/Component');

module.exports = kind({
    tag: '',

    published: {
        string: '',
    },

    components: [
        {kind: Signal, onLocaleChange: 'localeChanged'},
        {name: 'Content', tag: 'span'}, // tag required?
    ],

    create: function() {
        this.inherited(arguments);
        this.translate();
    },
    stringChanged: function(was, is) {
        this.translate();
    },
    localeChanged: function(inSender, inEvent) {
        this.translate();
    },
    translate: function() {
        var Locale = this.app.get('localeData'),
            string = this.get('string'),
            trans = Locale[string] || string;

        this.$.Content.setContent(trans);
    }
});
