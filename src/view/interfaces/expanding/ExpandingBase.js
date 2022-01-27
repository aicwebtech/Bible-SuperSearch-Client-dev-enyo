var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');
var formView = require('../../../forms/expanding/Expanding');
var InterfaceBase = require('../InterfaceBase');
var ContentPane = require('./ContentPane');
var FormatButtons = require('../../../components/FormatButtons/FormatButtonsHtmlNarrow');
var NavButtons = require('../../../components/NavButtons/NavHtml');
// var advancedFormView = require('../../../forms/ClassicAdvanced');
var Pager = require('../../../components/Pagers/CleanPager');

module.exports = kind({
    name: 'ExpandingBase',
    kind: InterfaceBase,
    formView: formView,
    NavButtonsControl: NavButtons,
    advancedFormView: null, //advancedFormView,
    PagerControl: Pager,
    FormatButtonsHideExtras: true,
    FormatButtonsHideExtrasSupported: true,
    classes: 'interface_expanding',
    expanded: false,

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
