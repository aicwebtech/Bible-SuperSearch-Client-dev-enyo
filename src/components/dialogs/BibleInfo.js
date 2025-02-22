var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Input = require('enyo/Input');
var Checkbox = require('enyo/Checkbox');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');
var inc = require('../../components/Locale/i18nComponent');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'BibleInfoDialog',
    kind: Dialog,
    maxWidth: '800px',
    height: '575px',
    classes: 'bss_help_dialog',
    bibleString: null,

    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, classes: 'bss_dialog_title', name: 'title', content: 'Settings'}, 
        ]}
    ],

    bodyComponents: [
        {
            name: 'container',
            style: 'text-align: justify',
            classes: 'bss_bible_info_container',
            allowHtml: true,
            attributes: {dir: 'auto'},
        },    
        {
            kind: Signal,
            onBibleInfo: 'handleOpen'
        }
    ],

    buttonComponents: [
        {name: 'Close', kind: Button, ontap: 'close', components: [
            {kind: i18n, content: 'Close'},
        ]}
    ],

    close: function() {
        this.app.setDialogShowing('BibleInfo', false);
    },
    handleOpen: function(inSender, inEvent) {
        var mod = inEvent.module || null;

        if(!mod || typeof this.app.statics.bibles[mod] == 'undefined') {
            return;
        }
        
        var bibleInfo = this.app.statics.bibles[mod];

        if(typeof bibleInfo.description == 'undefined') {
            return;  // don't display if no description
        }

        this.$.title.set('content', bibleInfo.name);
        this.$.container.set('content', bibleInfo.description);
        this.app.setDialogShowing('BibleInfo', true);
    }
});
