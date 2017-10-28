var kind = require('enyo/kind');
var Button = require('enyo/Button');

module.exports = kind({
    name: 'Dialog',
    showing: false,
    width: '300px',
    height: '200px',
    classes: 'biblesupersearch_dialog',

    dialogComponents: [],

    components: [
        {name: 'TitleBar', showing: false},
        {name: 'Container', classes: 'biblesupersearch_center_element' },
        {name: 'ButtonBar', showing: false}
    ],

    create: function() {
        this.inherited(arguments);
        // var style = 'background-color: white; opacity: 1;  margin: 30% auto 30% auto;'
        var style = 'background-color: white; opacity: 1;'
        style += 'width: ' + this.width + '; ';
        style += 'height: ' + this.height + '; ';

        this.$.Container.setStyle(style);
        this.$.Container.createComponents(this.dialogComponents);

    }, 
    showingChanged: function(was, is) {
        this.inherited(arguments);


    }

});
