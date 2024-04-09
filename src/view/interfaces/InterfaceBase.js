var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');
var LoadingDialog = require('../../components/dialogs/Loading');
var SosDialog = require('../../components/dialogs/SOS');
var StartDialog = require('../../components/dialogs/Start');
var DownloadDialog = require('../../components/dialogs/Download');
var HelpDialog = require('../../components/dialogs/Help');
var ShareDialog = require('../../components/dialogs/Share');
var HistoryDialog = require('../../components/dialogs/History');
var LinkDialog = require('../../components/dialogs/Link');
var SettingsDialog = require('../../components/dialogs/Settings');

var Dialogs = {
    'HistoryDialog': require('../../components/dialogs/History'),
    'BookmarkDialog': require('../../components/dialogs/Bookmarks'),
    'BookmarkEditCurrentDialog': require('../../components/dialogs/BookmarkEditCurrent')
};

var NavButtons = require('../../components/NavButtons/NavClassic');
var FormatButtons = require('../../components/FormatButtons/FormatButtonsHtml');
var Pager = require('../../components/Pagers/ClassicPager');
var MaterialIconsStyle = require('../../components/Styles/MaterialIcons');
var FreeSansStyle = require('../../components/Styles/FreeSans');

// Base kind for all Application views
module.exports = kind({
    name: 'InterfaceBase',
    classes: 'biblesupersearch_main',
    
    // Variable Sub Components, to be overridden by child interface kinds
    NavButtonsControl: NavButtons,
    // FormatButtonsControl: FormatButtons,    // Set to null to disable format buttons entirely
    FormatButtonsIncludeAdvancedToggle: true,
    // formatButtonsToggle: false,             // Set to true to cause format buttons to display ONLY when displaying results
    FormatButtonsHideExtras: false,             // Set to true if the 'extra' (non-formatting) buttons are displaying elsewhere on the form, to hide them on the Format Buttons
    FormatButtonsHideExtrasSupported: false,    // Indicates the interface actually has a place to dsiplay the 'extra' buttons outside of the format buttons
    PagerControl: Pager,

    handlers: {
        onLocaleChange: 'handleLocaleChanged',
        onFormResponseError: 'handleFormResponse',
        onFormResponseSuccess: 'handleFormResponse',
        onFormViewChanged: 'handleFormViewChanged',
        onmouseover: 'handleMouseEvent',
        onmouseout: 'handleMouseEvent',
        onkeydown: 'handleKey'
        // ontap: 'handleTap'
    },

    published: {
        ajaxLoading: false,
        sosShowing: false
    },
    create: function() {
        this.inherited(arguments);

        if(this.app.navigationButtonsView) {
            this.NavButtonsControl = this.app.navigationButtonsView;
        }        

        if(this.app.pagerView) {
            this.PagerControl = this.app.pagerView;
        }

        this.addRemoveClass('rtl', this.app.isRtl);

        client = this.app.get('client');

        this.addRemoveClass('bss_is_mobile', client.isMobile);
        this.addRemoveClass('bss_is_desktop', !client.isMobile);
        this.addRemoveClass('bss_browser_is_webkit', client.isWebkit);
        this.addClass('bss_os_' + client.os.toLowerCase());
        this.addClass('bss_browser_' + client.browser.toLowerCase());

        this.createComponent({kind: MaterialIconsStyle});
        this.createComponent({kind: FreeSansStyle});

        this._dialogCreateHelper(SettingsDialog, 'SettingsDialog');

        // if(!this.$.HelpDialog) {
        //     this.createComponent({
        //         name: 'HelpDialog',
        //         kind: HelpDialog,
        //         showing: false
        //     });
        // }
    },
    rendered: function() {
        this.inherited(arguments);
        var t = this;

        document.body.addEventListener('click', function(e) {
            t.handleTap(null, e);
        });         

        document.body.addEventListener('keydown', function(e) {
            t.handleKey(null, e);
        });         

        document.addEventListener('scroll', function(e) {
            t.handleScroll(null, e);
        });         

        document.addEventListener('scrollend', function(e) {
            t.handleScrollEnd(null, e);
        });         

        this.hasNode().addEventListener('scroll', function(e) {
            t.handleScroll(null, e);
        });         

        this.hasNode().addEventListener('scrollend', function(e) {
            t.handleScrollEnd(null, e);
        }); 
    },
    handleTap: function(inSender, inEvent) {
        this.waterfall('onGlobalTap', {sender: inSender, e: inEvent});
    },
    handleKey: function(inSender, inEvent) {
        if(inEvent.code == 'Escape') {
            this.waterfall('onGlobalEscape');
        }
    },
    handleScroll: function(inSender, inEvent) {
        this.waterfall('onGlobalScroll')
    },    
    handleScrollEnd: function(inSender, inEvent) {
        this.waterfall('onGlobalScrollEnd')
    },
    handleMouseEvent: function(inSender, inEvent) {
        //this.log(inSender);
        // this.log(inEvent);
        this.app.set('hasMouse', true)

        //this.addClass('bss_has_mouse');
    },
    ajaxLoadingChanged: function(was, is) {
        if(!this.$.LoadingDialog) {
            this.createComponent({
                name: 'LoadingDialog',
                kind: LoadingDialog,
                showing: false
            }).render();
        }

        this.$.LoadingDialog.set('showing', is);
    },    
    sosShowingChanged: function(was, is) {
        if(!this.$.SosDialog) {
            this.createComponent({
                name: 'SosDialog',
                kind: SosDialog,
                showing: false
            }).render();
        }

        this.$.SosDialog.set('showing', is);
    },    
    startShowingChanged: function(was, is) {
        if(!this.$.StartDialog) {
            this.createComponent({
                name: 'StartDialog',
                kind: StartDialog,
                showing: false
            }).render();
        }

        this.$.StartDialog.set('showing', is);
    },    
    downloadShowingChanged: function(was, is) {
        if(!this.$.DownloadDialog) {
            this.createComponent({
                name: 'DownloadDialog',
                kind: DownloadDialog,
                showing: false
            }).render();
        }

        this.$.DownloadDialog.set('showing', is);
    },    
    helpShowingChanged: function(was, is) {
        if(!this.$.HelpDialog) {
            this.createComponent({
                name: 'HelpDialog',
                kind: HelpDialog,
                showing: false
            }).render();
        }

        this.$.HelpDialog.set('showing', is);
    },
    shareShowingChanged: function(was, is) {
        this._dialogShowingHelper(ShareDialog, 'ShareDialog', is);
    },    
    linkShowingChanged: function(was, is) {
        this._dialogShowingHelper(LinkDialog, 'LinkDialog', is);
    },    
    settingsShowingChanged: function(was, is) {
        this._dialogShowingHelper(SettingsDialog, 'SettingsDialog', is);
    },
    setDialogShowing: function(dialog, showing) {
        this._dialogShowingHelper(Dialogs[dialog], dialog, showing);
    },
    _dialogShowingHelper: function(kind, name, showing) {
        if(!this.$[name]) {
            this.createComponent({
                name: name,
                kind: kind,
                showing: false
            }).render();
        }

        this.$[name].set('showing', showing);
    },    
    _dialogCreateHelper: function(kind, name) {
        if(!this.$[name]) {
            this.createComponent({
                name: name,
                kind: kind,
                showing: false
            }); //.render();
        }
    },
    formHasField: function(fieldName) {
        // For special interfaces, implement on child!
        return this._formHasFieldStandard(fieldName);
    },
    getFormFieldValue: function(fieldName) {
        if(this.$.Content && this.$.Content.$.FormController && this.$.Content.$.FormController.view && this.$.Content.$.FormController.view) {
            return this.$.Content.$.FormController.view.getFormFieldValue(fieldName);
        }

        return false;
    },
    _formHasFieldStandard: function(fieldName) {
        if(this.$.Content && this.$.Content.$.FormController && this.$.Content.$.FormController.view && this.$.Content.$.FormController.view.$) {
            return (this.$.Content.$.FormController.view.$[fieldName]) ? true : false;
        }

        return false;
    },
    _formIsShortHashable: function() {
        if(this.$.Content && this.$.Content.$.FormController && this.$.Content.$.FormController.view && this.$.Content.$.FormController.view) {
            return this.$.Content.$.FormController.view.isShortHashable();
        }

        return false;
    },

    scrollToTop: function() {
        this.hasNode().scrollTop = 0;
    },
    handleLocaleChanged: function(inSender, inEvent) {
        this.addRemoveClass('rtl', this.app.isRtl);
    },
    handleFormResponse: function(inSender, inEvent) {
        // this.scrollToTop();
    },
    handleFormViewChanged: function(inSender, inEvent) {
        //this.scrollToTop();
    },
    handkeKey: function(inSender, inEvent) {
        this.log(inEvent);
    }
});
