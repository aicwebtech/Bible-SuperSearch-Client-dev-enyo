var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var utils = require('enyo/utils');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'HistoryDialog',
    kind: Dialog,
    maxWidth: '400px',
    height: '300px',
    // maxHeight: '350px',
    //varyingHeight: true,
    classes: 'help_dialog history_dialog',
    bibleString: null,
    
    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, classes: 'bss_dialog_title', content: 'History'}
        ]}
    ],

    bodyComponents: [
        {classes: 'list history_list', name: 'ListContainer'}
    ],

    buttonComponents: [
        {name: 'Close', kind: Button, ontap: 'close', components: [
            {kind: i18n, content: 'Close'},
        ]}
    ],

    handlers: {
        onLocaleChange: 'localeChanged',
    },

    create: function() {
        if(this.multiColumn) {
            this.width = '1200px';
        }

        this.inherited(arguments);
        this.populateList();
    },
    close: function() {
        this.app.setDialogShowing('HistoryDialog', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);

        if(is) {
            this.populateList(); // redraww the list because the URLs have changed
            this.$.ListContainer.render();
            this.processDimensions();
        }
    },
    // listChanged: function(was, is) {
    //     this.populateList();
    //     this.$.ListContainer.render();
    //     this.processDimensions();
    // },
    populateList: function() {
        this.$.ListContainer.destroyClientControls();

        this.app.history.forEach(function(item) {
            var content = item.title,
                title = null,
                lim = 60;

            if(content.length > lim) {
                title = item.title;
                content = content.substring(0, lim) + ' ...';
            }

            this.$.ListContainer.createComponent({
                verses: item.verses,
                owner: this,
                classes: 'item history_item', components: [
                    //{classes: 'label', content: label},
                    {classes: 'verses', components: [
                        {
                            kind: Anchor, 
                            href: item.url, 
                            content: content,
                            title: title, 
                            ontap: 'handleHistoryTap'
                        }
                    ]},
                    {classes: 'clear-both'}
                ]
            });
        }, this);
    },
    handleHistoryTap: function(inSender, inEvent) {
        this.close();
    },
    localeChanged: function(inSender, inEvent) {
        this.populateList();
        this.render();
    }
});
