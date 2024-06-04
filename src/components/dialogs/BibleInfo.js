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
    maxWidth: '350px',
    height: '575px',
    classes: 'help_dialog bible_settings',
    bibleString: null,

    handlers: {
        // onActiveChanged: 'handleActiveChanged'
    },
    
    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, classes: 'bss_dialog_title', content: 'Settings'}, 
        ]}
    ],

    bodyComponents: [
        {
            name: 'container',
            allowHtml: true,
        },    
    ],

    buttonComponents: [
        {name: 'Close', kind: Button, ontap: 'close', components: [
            {kind: i18n, content: 'Close'},
        ]}
    ],

    bindings: [    

    ],

    handlers: {
        onLocaleChange: 'localeChanged',
    },

    create: function() {
        this.inherited(arguments);
    },
    close: function() {
        //this.app.set('bibleInfoShowing', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);
    },
    localeChanged: function(inSender, inEvent) {
        // this.render();
    },
});
