var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var i18n = require('../Locale/i18nContent');
var Dialog = require('./Dialog');
var ConfirmDialog = require('./Confirm');
var LinkBuilder = require('../Link/LinkBuilder');
var Signal = require('enyo/Signals');

// If the global enyo.Signals is available, use it. This is needed to allow
// bi-directional communication with Apps of older Enyo versions. Guard the
// `enyo` reference with typeof so builds without the global don't throw.
if(typeof enyo != 'undefined' && enyo && enyo.Signals) {
    Signal = enyo.Signals;
}

module.exports = kind({
    name: 'SessionVerseListDialog',
    kind: Dialog,
    maxWidth: '460px',
    height: '340px',
    classes: 'bss_help_dialog bss_history_dialog',

    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, classes: 'bss_dialog_title', content: 'Verse List'}
        ]}
    ],

    bodyComponents: [
        {
            kind: Signal,
            onSessionVerseListChanged: 'refreshList'
        },
        {classes: 'bss_history_list', name: 'ListContainer'}
    ],

    buttonComponents: [
        {name: 'Show', kind: Button, ontap: 'showList', components: [
            {kind: i18n, content: 'Show'}
        ]},
        {tag: 'span', classes: 'bss_spacer'},
        {name: 'Clear', kind: Button, ontap: 'clearList', components: [
            {kind: i18n, content: 'Clear'}
        ]},
        {tag: 'span', classes: 'bss_spacer'},
        {name: 'Close', kind: Button, ontap: 'close', components: [
            {kind: i18n, content: 'Close'}
        ]}
    ],

    handlers: {
        onLocaleChange: 'localeChanged'
    },

    linkBuilder: LinkBuilder,

    create: function() {
        this.inherited(arguments);

        this.createComponent({
            name: 'ConfirmDialog',
            kind: ConfirmDialog,
            showing: false
        });

        this.populateList();
    },
    close: function() {
        this.app.setDialogShowing('SessionVerseListDialog', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);

        if(is) {
            this.refreshList();
            this.processDimensions();
        }
    },
    localeChanged: function() {
        this.refreshList();
    },
    refreshList: function() {
        this.populateList();
        this.render();
    },
    populateList: function() {
        this.$.ListContainer.destroyClientControls();

        this.app.sessionVerseList.forEach(function(item, idx) {
            var reference = this._formatListReference(item);
            var href = this._getListItemHref(item);

            this.$.ListContainer.createComponent({
                owner: this,
                classes: 'bss_list_item bss_history_item',
                components: [
                    {
                        classes: 'verses',
                        style: 'float: inline-start',
                        components: [
                            {
                                kind: Anchor,
                                href: href,
                                content: reference,
                                title: reference,
                                ontap: 'handleItemTap'
                            }
                        ]
                    },
                    {
                        kind: i18n,
                        ontap: 'moveUp',
                        style: 'float: inline-end',
                        attributes: {title: 'Move up'},
                        idx: idx,
                        components: [
                            {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'arrow_upward'}
                        ]
                    },
                    {
                        kind: i18n,
                        ontap: 'moveDown',
                        style: 'float: inline-end',
                        attributes: {title: 'Move down'},
                        idx: idx,
                        components: [
                            {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'arrow_downward'}
                        ]
                    },
                    {
                        kind: i18n,
                        ontap: 'deleteItem',
                        style: 'float: inline-end',
                        attributes: {title: 'Delete'},
                        idx: idx,
                        components: [
                            {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'delete'}
                        ]
                    },
                    {classes: 'bss-clear-both'}
                ]
            });
        }, this);

        var count = this.$.ListContainer.getClientControls().length;

        while(count < 8) {
            this.$.ListContainer.createComponent({
                owner: this,
                content: '&nbsp;',
                allowHtml: true,
                classes: 'bss_list_item bss_history_item'
            });

            count ++;
        }
    },
    moveUp: function(inSender) {
        var idx = parseInt(inSender.get('idx'), 10);

        if(idx <= 0) {
            return;
        }

        // onSessionVerseListChanged signal triggers refreshList via the Signals component
        this.app.moveSessionVerseListItem(idx, idx - 1);
    },
    moveDown: function(inSender) {
        var idx = parseInt(inSender.get('idx'), 10);

        if(idx >= this.app.sessionVerseList.length - 1) {
            return;
        }

        // onSessionVerseListChanged signal triggers refreshList via the Signals component
        this.app.moveSessionVerseListItem(idx, idx + 1);
    },
    deleteItem: function(inSender) {
        var idx = parseInt(inSender.get('idx'), 10);
        // onSessionVerseListChanged signal triggers refreshList via the Signals component
        this.app.deleteSessionVerseListItem(idx);
    },
    clearList: function() {
        var t = this,
            msg = this.app.t('Are you sure?') + ' ' +
                this.app.t('This will clear everything from the verse list.');

        this.$.ConfirmDialog.confirm(msg, function(confirm) {
            if(confirm) {
                // onSessionVerseListChanged signal triggers refreshList via the Signals component
                t.app.clearSessionVerseList();
            }
        });
    },
    showList: function() {
        if(this.app.showSessionVerseList()) {
            this.close();
        }
    },
    handleItemTap: function() {
        this.close();
    },
    _formatListReference: function(item) {
        var bookName = this.app.getLocaleBookName(item.b, item.b + 'B');
        var cv = item.cva || item.cv;

        return bookName + ' ' + cv;
    },
    _getListItemHref: function(item) {
        var reference = this._formatListReference(item);
        var bibles = this.app.getSelectedBibles(true);
        var hash = this.linkBuilder.buildReferenceLink('r', bibles, reference);

        return this.app.getAbsoluteUrl(hash);
    }
});
