var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Input = require('enyo/Input');
var utils = require('enyo/utils');
var Dialog = require('./Dialog');
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
    height: '230px',
    classes: 'help_dialog bss_bookmark_edit_dialog',
    isNew: false,
    model: null,
    controller: null,
    current: false, // whether we are editing the current bookmark (linked directly from format buttons, not from bookmarks dialog)
    pk: null,
    previous: {},

    bindings: [
        {from: 'controller.title', to: '$.Title.value', oneWay: false, transform: function(value, dir) {
            console.log('Bookmark title', value, dir);
            return value || null;
        }},                

        {from: 'controller.pageTitle', to: '$.PageTitle.value', oneWay: true, transform: function(value, dir) {
            console.log('Bookmark pageTitle', value, dir);
            return value || null;
        }},        

        // {from: 'controller.link', to: '$.URL.value', oneWay: true, transform: function(value, dir) {
        //     console.log('Bookmark link', value, dir);
        //     return value || null;
        // }}
    ],

    events: {
        onEditBookmark: ''
    },
    
    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, classes: 'bss_dialog_title', content: 'Bookmark'}
        ]}
    ],

    bodyComponents: [
        {tag: 'br'},
        {kind: i18n, content: 'Name'},
        {kind: Input, name: 'Title'},
        {tag: 'br'},
        {tag: 'br'},
        {kind: i18n, content: 'Description'},
        {kind: Input, name: 'PageTitle', attributes:{readonly: 'readonly'}, classes: 'bss_readonly'},        
        {tag: 'br'},
        {tag: 'br'},
    ],

    buttonComponents: [
        {name: 'Save', kind: Button, ontap: 'save', components: [
            {kind: i18n, content: 'Save'},
        ]},        
        {name: 'DeleteSpacer', tag: 'span', classes: 'spacer'},
        {name: 'Delete', kind: Button, ontap: 'delete', components: [
            {kind: i18n, content: 'Delete'},
        ]},
        {name: 'RestoreSpacer', tag: 'span', classes: 'spacer'},
        {name: 'Restore', kind: Button, ontap: 'restore', components: [
            {kind: i18n, content: 'Restore'},
        ]},
        {tag: 'span', classes: 'spacer'},
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
    },
    close: function() {
        this.set('showing', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);
    },
    isNewChanged: function(was, is) {
        this.$.DeleteSpacer.set('showing', !is);
        this.$.Delete.set('showing', !is);        
        this.$.RestoreSpacer.set('showing', !is);
        this.$.Restore.set('showing', !is);
    },
    openNew: function() {
        this.set('isNew', true);

        var title = this.app.get('bssTitle'),
            url = document.location.href,
            limit = this.app.configs.bookmarkLimit || 20;

        this.app.bookmarks.limitReached();

        if(this.app.bookmarks.length >= limit) {
            msg = this.app.t('Limit of') + ' ' + limit + '. ' +
                    this.app.t('Please delete some bookmarks first.')

            this.app.alert(msg);
            this.close();
            return;
        }
        
        this.controller.newModel();
        this.controller.set('title', title);
        this.controller.set('pageTitle', title);
        this.controller.set('link', url);
        this.previous = {};

        // this.model = new Model;
        // this.model.set('title', title);
        // this.model.set('link', url);

        // this.log(this.controller.model.raw());

        this._openHelper(null);
    },
    openEdit: function(pk) {
        this.set('isNew', false);
        this.log(pk);

        var model = this.app.bookmarks.find(function(model) {
            return model.get('pk') == pk;
        });

        if(!model) {
            this.app.alert('Bookmark not found: pk=' + pk);
        }

        this.controller.set('model', model);
        this.previous = model.raw();

        // this.controller.set('model', utils.clone(model));
        this._openHelper(pk);
    },
    openCurrent: function() {
        this.openNew();
    },
    _openHelper: function(pk) {
        this.set('pk', pk);
        this.set('showing', true);
    },
    cancel: function() {
        this.restore();
        this.close();
    },
    restore: function() {
        this.log();

        if(!this.get('isNew') && this.previous) {            
            var model = this.controller.get('model');
            model.set(this.previous);
        }
    },
    save: function(inSender, inEvent) {
        var t = this,
            model = this.controller.get('model'),
            title = this.$.Title.get('value'),
            pk = this.get('pk'),
            sameTitle = this.app.bookmarks.find(function(item) {
                return title == item.get('title') && pk != item.get('pk');
            });

        if(sameTitle) {
            this.app.alert('This bookmark name already exists.');

            // msg = this.app.t('This title already exists.  Okay to update existing bookmark?');

            // this.app.confirm(msg, function(confirm) {
            //     if(confirm) {
            //         t.
            //     }
            // });

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

        this.app.confirm(msg + ': ' + model.get('title'), function(confirm) {
            if(confirm) {
                t.app.bookmarks.remove(model);
                t.app.bookmarks.commit();
                t.doEditBookmark();
                t.close();
            } 
        });

        // if(confirm) {
        //     this.app.bookmarks.remove(model);
        //     this.app.bookmarks.commit();
        //     this.doEditBookmark();
        //     this.close();
        // }
    },
    localeChanged: function(inSender, inEvent) {

    }
});
