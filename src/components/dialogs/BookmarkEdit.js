var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Input = require('enyo/Input');
var utils = require('enyo/utils');
var Dialog = require('./Dialog');
var ConfirmDialog = require('./Confirm');
var i18n = require('../Locale/i18nComponent');
var Model = require('../../data/models/Bookmark');
var Controller = require('../../data/controllers/BookmarkController');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'BookmarkEditDialog',
    kind: Dialog,
    maxWidth: '400px',
    height: '300px',
    classes: 'bss_help_dialog bss_bookmark_edit_dialog',
    isNew: false,
    moving: false,
    model: null,
    controller: null,
    current: false, // whether we are editing the current bookmark (linked directly from format buttons, not from bookmarks dialog)
    pk: null,
    previous: {},

    bindings: [
        {from: 'controller.title', to: '$.Title.value', oneWay: false, transform: function(value, dir) {
            // console.log('Bookmark title', value, dir);
            return value || null;
        }},                

        {from: 'controller.pageTitle', to: '$.PageTitle.value', oneWay: true, transform: function(value, dir) {
            // console.log('Bookmark pageTitle', value, dir);
            return value || null;
        }}
    ],

    events: {
        onEditBookmark: ''
    },
    
    titleComponents: [
        {classes: 'header', components: [
            {name: 'Header', kind: i18n, classes: 'bss_dialog_title', content: 'Bookmark'}
        ]}
    ],

    bodyComponents: [
        
        {name: 'PlaceHolderTop', components: [
            {tag: 'br'},
            {tag: 'br'},
        ]},

        // {tag: 'br'},
        {tag: 'br'},
        {kind: i18n, content: 'Name'},
        {kind: Input, name: 'Title'},
        {tag: 'br'},
        {tag: 'br'},
        {kind: i18n, name: 'PageTitleLabel', content: 'Description'},
        {kind: i18n, name: 'PageTitleLabelNew', content: 'New', showing: false},
        {kind: Input, name: 'PageTitle', attributes:{_readonly: 'readonly', disabled: 'disabled'}, classes: 'bss_readonly', disabled: true,},        
        {tag: 'br'},
        {name: 'PlaceHolderBot', components: [
            {tag: 'br'},
            {tag: 'br'},
        ]},
        {tag: 'br'},
        {kind: i18n, name: 'PageTitleLabelOld', content: 'Old', showing: false},
        {kind: Input, name: 'PageTitleMove', attributes:{_readonly: 'readonly', disabled: 'disabled'}, classes: 'bss_readonly', showing: false, disabled: true},        
        {tag: 'br'},
        {tag: 'br'},
        {tag: 'br'},
        {tag: 'br'},
    ],

    buttonComponents: [
        {name: 'Save', kind: Button, ontap: 'save', components: [
            {kind: i18n, content: 'Save'},
        ]},        
        {name: 'MoveSpacer', tag: 'span', classes: 'bss_spacer'},
        {name: 'Move', kind: Button, ontap: 'moveToCurrent', components: [
            {kind: i18n, content: 'Move to Current'},
        ]},
        {tag: 'span', classes: 'bss_spacer'},
        {name: 'Cancel', kind: Button, ontap: 'cancel', components: [
            {kind: i18n, content: 'Cancel'},
        ]}
    ],

    handlers: {
        onLocaleChange: 'localeChanged',
    },

    create: function() {
        this.inherited(arguments);
        this.controller = new Controller();

        this.createComponent({
            name: 'ConfirmDialog',
            kind: ConfirmDialog,
            showing: false
        });
    },
    close: function() {
        this.set('showing', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);
    },
    isNewChanged: function(was, is) {     
        this.$.MoveSpacer.set('showing', !is);
        this.$.Move.set('showing', !is);
    },
    openNew: function() {
        this.set('isNew', true);
        this.set('moving', false);
        this.setTitle('Add');

        var title = this.app.get('bssTitle'),
            url = document.location.href,
            limit = this.app.configs.bookmarkLimit || 20;

        this.app.bookmarks.limitReached();

        if(this.app.bookmarks.length >= limit) {
            msg = //this.app.t('Limit of') + ' ' + limit + '. ' +
                    this.app.t('Please delete some bookmarks before adding more.')

            this.$.ConfirmDialog.alert(msg, this.close);
            return;
        }
        
        this.controller.newModel();
        this.controller.set('title', title);
        this.controller.set('pageTitle', title);
        this.controller.set('link', url);
        this.previous = {};

        this._openHelper(null);
    },
    openEdit: function(pk) {
        this.set('isNew', false);
        this.set('moving', false);
        this.setTitle('Edit');
        this.app.debug && this.log(pk);

        var model = this.app.bookmarks.find(function(model) {
            return model.get('pk') == pk;
        });

        if(!model) {
            this.$.ConfirmDialog.alert('Error: Bookmark not found: pk=' + pk);
        }

        this.controller.set('model', model);
        this.previous = model.raw();
        this._openHelper(pk);
    },
    openMove: function(pk) {
        this.set('isNew', false);
        this.set('moving', true);
        this.setTitle('Move to Current');
        var model = this.app.bookmarks.findByPk(pk);

        if(!model) {
            this.$.ConfirmDialog.alert('Error: Bookmark not found: pk=' + pk);
        }

        this.controller.set('model', model);
        this.previous = model.raw();

        this.moveToCurrent();
        this._openHelper(pk);
    },
    openCurrent: function() {
        this.openNew();
    },
    _openHelper: function(pk) {
        this.set('pk', pk);
        this.set('showing', true);
    },
    movingChanged: function(was, is) {
        this.$.PageTitleMove.set('showing', !!is);
        this.$.PageTitleLabel.set('showing', !is);
        this.$.PageTitleLabelOld.set('showing', !!is);
        this.$.PageTitleLabelNew.set('showing', !!is);
        this.$.MoveSpacer.set('showing', !is);
        this.$.Move.set('showing', !is);
        this.$.PlaceHolderTop.set('showing', !is);
        this.$.PlaceHolderBot.set('showing', !is);
    },
    cancel: function() {
        this.restore();
        this.close();
    },
    restore: function() {
        if(!this.get('isNew') && this.previous) {            
            var model = this.controller.get('model');
            model.set(this.previous);
        }
    },
    setTitle: function(title) {
        this.$.Header.set('content', this.app.t('Bookmark') + ': ' + this.app.t(title));
    },
    save: function(inSender, inEvent) {
        var t = this,
            model = this.controller.get('model'),
            title = this.$.Title.get('value') || null,
            pk = this.get('pk'),
            sameTitle = this.app.bookmarks.find(function(item) {
                return title == item.get('title') && pk != item.get('pk');
            });

        if(!title) {
            this.$.ConfirmDialog.alert( this.app.t('Bookmark name is required.') );
            return;
        }

        if(sameTitle) {
            this.$.ConfirmDialog.alert( this.app.t('This bookmark name already exists.') );
            return;
        }

        if(this.get('isNew')) {
            this.app.bookmarks.addOne(model);
        } else {
            this.app.bookmarks.add(model);
        }

        this.app.bookmarks.commit();
        this.doEditBookmark({model: model});
        this.close();
    },
    delete: function(inSender, inEvent) {
        var t = this;
            model = this.controller.get('model'),
            msg = this.app.t('Are you sure you want to delete');
            // confirm = window.confirm(msg + ': ' + model.get('title'));

        this.$.ConfirmDialog.confirm(msg + ': ' + model.get('title'), function(confirm) {
            if(confirm) {
                t.app.bookmarks.remove(model);
                t.app.bookmarks.commit();
                t.doEditBookmark();
                t.close();
            } 
        });
    },
    moveToCurrent: function() {
        var title = this.app.get('bssTitle'),
            url = document.location.href;

        this.controller.set('pageTitle', title);
        this.controller.set('link', url);
        this.$.PageTitleMove.set('value', this.previous.pageTitle);
    },
    localeChanged: function(inSender, inEvent) {

    }
});
