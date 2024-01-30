var Collection = require('enyo/Collection');
var kind = require('enyo/kind');
var Source = require('../sources/LocalStorageBookmarks');

module.exports = kind({
    kind: Collection,
    name: 'BookmarkCollection',
    source: Source,
    options: {parse: true},
    url: 'BibleSuperSearchBookmarks',
    maxId: 0,

    parse: function(data) {
        console.log(data);

        return data;
    },
    addOne: function(model) {
        this.maxId ++;
        model.set('pk', this.maxId);
        return this.add(model);
    },
    commit: function() {
        var raw = this.raw();
        localStorage.setItem(this.url, JSON.stringify(raw));
    },
    fetch: function() {
        var col = localStorage.getItem(this.url) || null;

        if(col) {
            this.add(JSON.parse(col));
        }
    }
});
