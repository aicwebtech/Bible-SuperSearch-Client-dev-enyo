var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var utils = require('enyo/utils');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');
var ConfirmDialog = require('./Confirm');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'HistoryDialog',
    kind: Dialog,
    maxWidth: '400px',
    height: '300px',
    classes: 'bss_help_dialog bss_history_dialog',
    
    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, classes: 'bss_dialog_title', content: 'History'}
        ]}
    ],

    bodyComponents: [
        {classes: 'bss_history_list', name: 'ListContainer'}
    ],

    buttonComponents: [
        {name: 'Clear', kind: Button, ontap: 'clear', components: [
            {kind: i18n, content: 'Clear'},
        ]},
        {tag: 'span', classes: 'bss_spacer'},     
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

        this.createComponent({
            name: 'ConfirmDialog',
            kind: ConfirmDialog,
            showing: false
        });
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
    populateList: function() {
        this.$.ListContainer.destroyClientControls();

        this.app.history.forEach(function(item) {
            var content = item.title,
                title = null,
                lim = 50,
                trun = lim;

            if(content.length > lim) {
                title = item.title;
                var lwordPos = content.lastIndexOf(' ', lim);

                if(lwordPos != -1) {
                    trun = lwordPos;
                }

                content = content.substring(0, trun) + ' ...';
            }

            this.$.ListContainer.createComponent({
                verses: item.verses,
                owner: this,
                classes: 'bss_list_item bss_history_item', components: [
                    {classes: 'verses', components: [
                        {
                            kind: Anchor, 
                            href: item.url, 
                            content: content,
                            title: title, 
                            ontap: 'handleHistoryTap'
                        }
                    ]},
                    {classes: 'bss-clear-both'}
                ]
            });
        }, this);

        var count = this.$.ListContainer.getClientControls().length;

        while(count < 9) {
            this.$.ListContainer.createComponent({
                owner: this,
                content: '&nbsp;',
                allowHtml: true,
                classes: 'bss_list_item bss_history_item'
            });

            count ++;
        }
    },
    handleHistoryTap: function(inSender, inEvent) {
        this.close();
    },
    localeChanged: function(inSender, inEvent) {
        this.populateList();
        this.render();
    },
    clear: function() {
        
        var t = this,
            msg = this.app.t('Are you sure?') + ' ' +
                this.app.t('This will delete all history.');

        this.$.ConfirmDialog.confirm(msg, function(confirm) {
            if(confirm) {
                t.app.clearHistory();
                t.app.clearVisited();
                t.close();
            }
        });
    },
});
