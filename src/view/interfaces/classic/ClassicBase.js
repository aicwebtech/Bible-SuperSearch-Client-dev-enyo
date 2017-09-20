var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');
var formView = require('../../../forms/ClassicUserFriendly2');
var ContentView = require('../../Results');

module.exports = kind({
    name: 'ClassicBase',
    formView: formView,
    components: [
        {content: 'classic base'},
        {components: [
            {name: 'Form', kind: ViewController, resetView: true, view: formView}
            // {name: 'Form', kind: formView}
        ]},
        {name: 'Content', kind: ContentView}
    ],
    create: function() {
        this.inherited(arguments);
        this.log();
        this.$.Form.set('view', this.formView);
        // this.$.Form.render();
    },
    rendered: function() {
        this.inherited(arguments);
    }
});
