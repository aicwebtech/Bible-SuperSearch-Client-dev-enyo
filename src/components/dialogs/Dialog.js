var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Signal = require('../Signal');

module.exports = kind({
    name: 'Dialog',
    showing: false,
    width: '300px',
    height: '200px',
    classes: 'biblesupersearch_dialog',

    published: {
        title: null,
    },

    bodyComponents: [],
    titleComponents: [],
    buttonComponents: [],

    components: [
        {name: 'Container', classes: 'biblesupersearch_center_element dialog', components: [
            {name: 'TitleBar', classes: 'title', showing: false},
            {name: 'Body', classes: 'content', showing: true},
            {name: 'ButtonBar', classes: 'buttons', showing: false}
        ] },
        {
            kind: Signal, 
            onkeyup: 'handleKey'
        }
    ],

    create: function() {
        this.inherited(arguments);
        // var style = 'background-color: white; opacity: 1;  margin: 30% auto 30% auto;'
        // var style = 'background-color: white; opacity: 1;'
        var style = '';
        style += 'width: ' + this.width + '; ';
        style += 'height: ' + this.height + '; ';
        style += 'margin-top: calc(50vh - ' + this.height + ' / 2);'; // Vertical align using height

        this.$.Container.setStyle(style);

        if(this.titleComponents.length > 0) {
            this.$.TitleBar.createComponents(this.titleComponents);
            this.$.TitleBar.set('showing', true);
        }

        this.$.Body.createComponents(this.bodyComponents, {owner: this});

        if(this.buttonComponents.length > 0) {
            this.$.ButtonBar.createComponents(this.buttonComponents, {owner: this});
            this.$.ButtonBar.set('showing', true);
        }
    }, 
    showingChanged: function(was, is) {
        this.inherited(arguments);
    },
    close: function() {
        this.set('showing', false);
    },
    handleKey: function(inSender, inEvent) {
        if(inEvent.code == 'Escape') {
            this.close();
        }
    }

});
