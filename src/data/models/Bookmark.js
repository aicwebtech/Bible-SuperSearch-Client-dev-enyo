var kind = require('enyo/kind');
var Model = require('enyo/Model');
var LocalStorageSource = require('../sources/LocalStorageBookmarks');

module.exports = kind({
    name: 'Bookmark',
    kind: Model,
    source: LocalStorageSource,
    primaryKey: 'pk',
    url: 'BibleSuperSearchBookmarks', ///,
    
    attributes: {
        pk: null,
        title: null, // given to bookmark by user
        pageTitle: null, // Title from page, not directly editable by user
        link: null,   // url to BSS bookmark, not directly editable by user
    }
});

