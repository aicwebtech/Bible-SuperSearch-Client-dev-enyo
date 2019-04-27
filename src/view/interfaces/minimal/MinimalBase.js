var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');
var formView = require('../../../forms/Minimal');
var InterfaceBase = require('../InterfaceBase');
var ContentPane = require('./ContentPane');
// var FormatButtons = require('../../../components/FormatButtons/classic/FormatButtonsClassic');
// var advancedFormView = require('../../../forms/ClassicAdvanced');

module.exports = kind({
    name: 'MinimalBase',
    kind: InterfaceBase,
    formView: formView,
    advancedFormView: null, //advancedFormView,
    classes: 'interface_minimal',

    create: function() {
        this.inherited(arguments);

        this.createComponent({
            name: 'Content',
            kind: ContentPane,
            formView: this.formView,
            displayFormOnCreate: true
        });        
    }
});
