var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');
var formView = require('../../../forms/ClassicUserFriendly2');
var InterfaceBase = require('../InterfaceBase');
var ContentPane = require('./ContentPane');
var FormatButtons = require('../../../components/FormatButtons/classic/FormatButtonsClassic');

module.exports = kind({
    name: 'ClassicBase',
    kind: InterfaceBase,
    formView: formView,
    classes: 'interface_classic',
    components: [
        /*{components: [
            {name: 'Form', kind: ViewController, resetView: true, view: formView}
            // {name: 'Form', kind: formView}
        ]},
        {name: 'Content', kind: ContentView}*/
    ],
    create: function() {
        this.inherited(arguments);
        this.log();

        this.createComponent({
            name: 'Content',
            kind: ContentPane,
            formView: this.formView,
            displayFormOnCreate: true
        });        

        // this.createComponent({
        //     name: 'Format',
        //     kind: FormatButtons
        // });

        // this.$.Form.render();
    },    
    _create: function() {
        this.inherited(arguments);
        this.log();
        this.$.Form.set('view', this.formView);
        // this.$.Form.render();
    },
    rendered: function() {
        this.inherited(arguments);
    }
});
