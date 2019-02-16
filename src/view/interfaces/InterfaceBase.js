var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');
var LoadingDialog = require('../../components/dialogs/Loading');
var NavButtons = require('../../components/NavButtons/NavClassic');
var FormatButtons = require('../../components/FormatButtons/classic/FormatButtonsClassic');
var Pager = require('../../components/Pagers/ClassicPager');

// Base kind for all Application views
module.exports = kind({
    name: 'InterfaceBase',
    classes: 'biblesupersearch_main',
    
    // Variable Sub Components, to be overridden by child interface kinds
    NavButtonsControl: NavButtons,
    // FormatButtonsControl: FormatButtons,    // Set to null to disable format buttons entirely
    FormatButtonsIncludeAdvancedToggle: true,
    // formatButtonsToggle: false,             // Set to true to cause format buttons to display ONLY when displaying results
    PagerControl: Pager,

    published: {
        ajaxLoading: false,
    },
    create: function() {
        this.inherited(arguments);
    },
    ajaxLoadingChanged: function(was, is) {
        this.log(is);

        if(!this.$.LoadingDialog) {
            this.createComponent({
                name: 'LoadingDialog',
                kind: LoadingDialog,
                showing: false
            }).render();
        }

        this.$.LoadingDialog.set('showing', is);
    },
    formHasField: function(fieldName) {
        // For special interfaces, implement on child!
        return this._formHasFieldStandard(fieldName);
    },
    _formHasFieldStandard: function(fieldName) {
        if(this.$.Content && this.$.Content.$.FormController && this.$.Content.$.FormController.view) {
            return (this.$.Content.$.FormController.view.$[fieldName]) ? true : false;
        }

        return false;
    }
});
