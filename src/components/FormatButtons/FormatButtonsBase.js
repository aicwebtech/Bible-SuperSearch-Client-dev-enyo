var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var Signal = require('../Signal');
var Help = require('../dialogs/Help');
var Confirm = require('../dialogs/Confirm');

module.exports = kind({
    name: 'FormatButtonsBase',
    classes: 'bss_format_buttons',
    // Whether to include the toggle button for advanced search
    // Should be disabled if already displaying the advanced search button
    includeAdvancedToggle: true,
    onlyExtraButtons: false, // indicates the current kind ONLY contains 'extra' buttons (start/download,ect)
    uc: null,

    handlers: {
        onkeydown: 'handleKey'
    },

    bindings: [
        {from: 'app.UserConfig', to: 'uc'}
    ],

    observers: [
        {method: 'watchRenderStyle', path: ['uc.render_style']},
        {method: 'watchStyleFlags', path: ['uc.paragraph', 'uc.single_line', 'uc.passages']}
    ],

    create: function() {
        this.inherited(arguments);

        this.createComponent({
            name: 'Dialogs', components: [
                {name: 'HelpDialog', kind: Help, showing: false},
                {name: 'ConfirmDialog', kind: Confirm, showing: false}
            ]
        });
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

        if(!this.includeAdvancedToggle || !advancedView || !this.app.configs.toggleAdvanced) {
            this.$.advanced_toggle && this.$.advanced_toggle.destroy();
        }
    },
    handleFontChange: function(inSender, inEvent) {
        val = inSender.val || 'serif';
        this.app.UserConfig.set('font', val);
        this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ...
    },    
    handleRenderStyle: function(inSender, inEvent) {
        val = inSender.val || 'passage';
        this.app.UserConfig.set('render_style', val);
        this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ...
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
        this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
        // this.log(this.app.UserConfig.getAttributes());
    },
    handleHelp: function(inSender, inEvent) {
        // this.app.showHelp(null);
        this.app.set('helpShowing', true);
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
    handleLink: function(inSender, inEvent) {
        this.app.set('linkShowing', true);
    },        
    handleHistory: function(inSender, inEvent) {
        this.app.setDialogShowing('HistoryDialog', true);
    },        
    handleBookmark: function(inSender, inEvent) {
        this.app.setDialogShowing('BookmarkDialog', true);
    },       
    handleBookmarkCurrent: function(inSender, inEvent) {
        this.app.setDialogShowing('BookmarkEditCurrentDialog', true);
    },
    handleResetSetting: function(inSender, inEvent) {
        var t = this,
            msg = this.app.t('Are you sure?') + ' ' +
                this.app.t('This will reset the settings to defaults.');

        this.$.ConfirmDialog.confirm(msg, function(confirm) {
            if(confirm) {
                t.app.set('_blockAutoScroll', true);
                t.app.UserConfig.reset();
            }
        });
    }, 
    handleSettings: function(inSender, inEvent) {
        this.app.set('settingsShowing', true);
    },
    handleClearForm: function() {
        Signal.send('onClearForm');
    },
    handleCopyInstant: function(inSender, inEvent) {
        var copy = this.app.UserConfig.get('copy');

        this.app.UserConfig.set('copy', true);
        Signal.send('onTriggerCopy', {inSender: inSender, inEvent: inEvent});
        this.app.UserConfig.set('copy', copy);
    },
    handkeKey: function(inSender, inEvent) {
        this.log(inEvent);
    },
    watchRenderStyle: function(pre, cur, prop) {
        // switch(cur) {
        //     case 'verse':
        //         this.app.UserConfig.set('passages', false);
        //         this.app.UserConfig.set('single_verses', true);
        //         break;            
        //     case 'verse_passage':
        //         this.app.UserConfig.set('passages', true);
        //         this.app.UserConfig.set('single_verses', true);
        //         break;
        //     default:
        //         this.app.UserConfig.set('single_verses', false);
        //         this.app.UserConfig.set('passages', false);
        //         this.app.UserConfig.set('paragraph', !!(cur == 'paragraph'));
        // }

        this.$.renderstyle_paragraph && this.$.renderstyle_paragraph.addRemoveClass('bss_selected', cur == 'paragraph');
        this.$.renderstyle_passage && this.$.renderstyle_passage.addRemoveClass('bss_selected', cur == 'passage');
        this.$.renderstyle_verse && this.$.renderstyle_verse.addRemoveClass('bss_selected', cur == 'verse');
        this.$.renderstyle_verse_passage && this.$.renderstyle_verse_passage.addRemoveClass('bss_selected', cur == 'verse_passage');
    },    
    watchStyleFlags: function(pre, cur, prop) {
        this.app.debug && this.log(pre, cur, prop);
    },
    _hideExtras: function() {
        var softConfig = typeof this.app.configs.extraButtonsSeparate == 'undefined' ? null : this.app.configs.extraButtonsSeparate,
            displayConfig = this.app.configs.extraButtonsDisplay;
            supported = this.app.view.FormatButtonsHideExtrasSupported || false,
            hide = null;


        // To make this backward-compatible, we look at the legacy config if it's not undefined
        var effectiveConfig = (softConfig == null) ? displayConfig : softConfig;

        if(effectiveConfig == 'none') {
            return true; // does NOT toggle based on this.onlyExtraButtons
        }

        if(!supported) {
            hide = false;
        }
        else if(effectiveConfig == 'separate' || effectiveConfig === true || effectiveConfig == 'true') {
            hide = true;
        }
        else if(effectiveConfig == 'format' || effectiveConfig === false || effectiveConfig == 'false') {
            hide = false;
        }
        else {
            hide = this.app.view.FormatButtonsHideExtras;
        }

        return this.onlyExtraButtons ? !hide : hide;
    }
});
