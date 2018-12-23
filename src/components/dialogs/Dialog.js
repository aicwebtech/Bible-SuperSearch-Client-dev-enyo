var kind = require('enyo/kind');
var Button = require('enyo/Button');

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
        {name: 'Container', classes: 'biblesupersearch_center_element', components: [
            {name: 'TitleBar', showing: false},
            {name: 'Body', showing: true},
            {name: 'ButtonBar', showing: false}
        ] },
    ],

    create: function() {
        this.inherited(arguments);
        // var style = 'background-color: white; opacity: 1;  margin: 30% auto 30% auto;'
        var style = 'background-color: white; opacity: 1;'
        style += 'width: ' + this.width + '; ';
        style += 'height: ' + this.height + '; ';
        style += 'margin-top: calc(50vh - ' + this.height + ' / 2);'; // Vertical align using height

        this.$.Container.setStyle(style);
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
    }

});
