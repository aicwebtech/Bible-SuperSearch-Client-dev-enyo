var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Input = require('enyo/Input');
var utils = require('enyo/utils');
var Dialog = require('./BookmarkEdit');
var i18n = require('../Locale/i18nComponent');
var Model = require('../../data/models/Bookmark');
var Controller = require('../../data/controllers/BookmarkController');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'BookmarkEditCurrentDialog',
    kind: Dialog,
    current: true,

    close: function() {
        this.app.setDialogShowing('BookmarkEditCurrentDialog', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);

        if(is) {
            this.openCurrent();
        }
    },
});
