var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var Signal = require('../Signal');

module.exports = kind({
    name: 'FormatButtonsBase',
    classes: 'format_buttons',
    // Whether to include the toggle button for advanced search
    // Should be disabled if already displaying the advanced search button
    includeAdvancedToggle: true,

    create: function() {
        this.inherited(arguments);
    },
    rendered: function() {
        this.inherited(arguments);
        this._initAdvancedToggle();
    },

    _initAdvancedToggle: function() {
        var advancedView = this.app.getViewProp('FormatButtonsIncludeAdvancedToggle');

        this.app.debug && this.log('advancedToggle - CONFIG', this.app.configs.toggleAdvanced, this.app.configs);
        this.app.debug && this.log('advancedToggle - Interface', advancedView, this.app.view.FormatButtonsIncludeAdvancedToggle);
        this.app.debug && this.log('advancedToggle - Format Buttons Toggle', this.app.configs.formatButtonsToggle);

        if(!this.includeAdvancedToggle || !advancedView || !this.app.configs.toggleAdvanced || this.app.configs.formatButtonsToggle) {
            this.$.advanced_toggle && this.$.advanced_toggle.destroy();
        }
    },
    handleFontChange: function(inSender, inEvent) {
        val = inSender.val || 'serif';
        this.app.UserConfig.set('font', val);
        // this.log(this.app.UserConfig.getAttributes());
    },
    handleSizeChange: function(inSender, inEvent) {
        var curVal = this.app.UserConfig.get('text_size');
        var newVal = 0;

        if(inSender.val == 'plus') {
            newVal = curVal + 1;
        }        

        if(inSender.val == 'minus') {
            newVal = curVal - 1;
        }

        this.app.UserConfig.set('text_size', newVal);
        // this.log(this.app.UserConfig.getAttributes());
    },
    handleHelp: function(inSender, inEvent) {
        this.app.showHelp(null);
        return;


        // this.app.debug && this.log(inSender);
        // this.app.debug && this.log(inEvent);

        // this.$.HelpDialog && this.$.HelpDialog.set('showing', true);
        // Todo - reformat user guild, redesign help based on context, needs to work on phones, ect
        
        // Temporary!
        window.open(
            this.app.get('rootDir') +  '/user_guide.html', 
            'helpDialog',
            'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,height=800,width=600'
        );
    },
    handlePrint: function(inSender, inEvent) {
        Signal.send('onResultsPrint');
    },

    handleSos: function(inSender, inEvent) {
        this.app.set('sosShowing', true);
    },    
    handleStart: function(inSender, inEvent) {
        this.app.set('startShowing', true);
    },    
    handleDownload: function(inSender, inEvent) {
        this.app.set('downloadShowing', true);
    },    
    handleShare: function(inSender, inEvent) {
        this.app.set('shareShowing', true);
    },
    _hideExtras: function() {
        var softConfig = this.app.configs.extraButtonsSeparate,
            supported = this.app.view.FormatButtonsHideExtrasSupported || false;

        if(!supported) {
            return false;
        }

        this.log('extras soft config', softConfig);

        if(softConfig === true || softConfig == 'true') {
            return true;
        }
        else if (softConfig === false || softConfig == 'false') {
            return false;
        }
        else {
            return this.app.view.FormatButtonsHideExtras;
        }
    }
});
