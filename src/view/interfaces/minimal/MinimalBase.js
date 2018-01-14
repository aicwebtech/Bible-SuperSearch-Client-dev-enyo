var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');
var formView = require('../../../forms/Minimal');
var InterfaceBase = require('../InterfaceBase');
var ContentPane = require('./ContentPane');
var FormatButtons = require('../../../components/FormatButtons/classic/FormatButtonsClassic');
var advancedFormView = require('../../../forms/ClassicAdvanced');

module.exports = kind({
    name: 'ClassicBase',
    kind: InterfaceBase,
    formView: formView,
    advancedFormView: null, //advancedFormView,
    classes: 'interface_classic',

    create: function() {
        this.inherited(arguments);
        this.log();

        this.createComponent({
            name: 'Content',
            kind: ContentPane,
            formView: this.formView,
            displayFormOnCreate: true
        });        
    }
});
