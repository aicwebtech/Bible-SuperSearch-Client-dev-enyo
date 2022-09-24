var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');
var formView = require('../../../forms/BrowsingBookSelector');
var InterfaceBase = require('../InterfaceBase');
var ContentPane = require('./ContentPane');
var FormatButtons = require('../../../components/FormatButtons/FormatButtonsHtml');
var advancedFormView = require('../../../forms/ClassicAdvanced');

module.exports = kind({
    name: 'BrowsingBase',
    kind: InterfaceBase,
    formView: formView,
    advancedFormView: advancedFormView,
    FormatButtonsHideExtras: false,
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
