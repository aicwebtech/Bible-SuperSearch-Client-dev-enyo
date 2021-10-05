var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');
var i18nComponent = require('../Locale/i18nComponent');
var TextArea = require('enyo/TextArea');
var Input = require('enyo/Input');
var Image = require('../Image');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
// var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

// Todo - format clean up!

module.exports = kind({
    name: 'LinkDialog',    
    kind: Dialog,
    maxWidth: '300px',
    height: '475px',
    classes: 'help_dialog link_dialog',
    bibleString: null,
    ezCopy: false,
    
    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, tag: 'h3', content: 'Link'}, 
        ]}
    ],

    bodyComponents: [
        {tag: 'br'},
        {name: 'FullUrlContainer', classes: 'container', components: [
            {kind: Input, name: 'FullUrl'},
            {kind: Button, onclick: 'copyFullUrl', components: [
                {kind: i18n, content: 'Copy'}
            ]}
        ]},
        {name: 'ShortUrlContainer', classes: 'container', components: [
            {tag: 'br'},
            {kind: Input, name: 'ShortUrl'},
            {kind: Button, onclick: 'copyShortUrl', components: [
                {kind: i18n, content: 'Copy'}
            ]}
        ]},
        {tag: 'br'}
    ],

    buttonComponents: [
        {name: 'Close', kind: Button, ontap: 'close', components: [
            {kind: i18n, content: 'Close'}
        ]}
    ],

    handlers: {
        onLocaleChange: 'localeChanged',
        // onFormResponseSuccess: 'handleFormResponse'
    },

    create: function() {
        this.inherited(arguments);
    },
    close: function() {
        this.app.set('linkShowing', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);

        if(is) {
            this.populate(); 
        }
    },
    populate: function() {
        var title = document.title,
            url = window.location.href,
            shortHash = this.app.get('shortHashUrl'),
            parts = url.split('#'),
            baseUrl = parts[0],
            longHash = parts[1],
            shortHashUrl = baseUrl + shortHash;

        this.app.debug && this.log('url', url, 'shortHash', shortHash);

        if(shortHash && !longHash) {
            this.$.FullUrlContainer.set('showing', false);
        }
        else {
            this.$.FullUrlContainer.set('showing', true);
            this.$.FullUrl.set('value', url);
        }

        if(!shortHash && longHash) {
            this.app.debug && this.log('Needs short hash');
            this.$.ShortUrlContainer.set('showing', false);
        }
        else if(shortHashUrl == url) {
            this.app.debug && this.log('Doesnt need long hash');
            this.$.ShortUrlContainer.set('showing', false);
        }
        else {
            this.$.ShortUrlContainer.set('showing', true);
            this.$.ShortUrl.set('value', shortHashUrl);
        }

    },
    localeChanged: function(inSender, inEvent) {

    },
    copyFullUrl: function() {
        return this.app._copyComponentContent(this.$.FullUrl, 'value');
    },    
    copyShortUrl: function() {
        return this.app._copyComponentContent(this.$.ShortUrl, 'value');
    }

});

