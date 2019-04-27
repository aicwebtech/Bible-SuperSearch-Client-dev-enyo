var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');
var formView = require('../../../forms/ClassicUserFriendly2');
var InterfaceBase = require('../InterfaceBase');
var ContentPane = require('./ContentPane');
var FormatButtons = require('../../../components/FormatButtons/classic/FormatButtonsClassic');
var advancedFormView = require('../../../forms/ClassicAdvanced');

module.exports = kind({
    name: 'ClassicBase',
    kind: InterfaceBase,
    formView: formView,
    advancedFormView: advancedFormView,
    classes: 'interface_classic',

    create: function() {
        this.inherited(arguments);

        this.createComponent({
            name: 'Content',
            kind: ContentPane,
            formView: this.formView,
            displayFormOnCreate: true
        });        
    },    
    _create: function() {
        this.inherited(arguments);
        this.$.Form.set('view', this.formView);
        // this.$.Form.render();
    },
    rendered: function() {
        this.inherited(arguments);
    }
});
