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
    current: null,

    parse: function(data) {
        return data;
    },
    addOne: function(model) {
        model.set('pk', this.getNextPk());
        return this.add(model);
    },
    getNextPk: function() {
        if(this.maxId == 0) {
            var pk = 0;

            this.forEach(function(item) {
                pk = Math.max(pk, item.get('pk'));
            });

            this.maxId = pk;
        }

        this.maxId ++;
        return this.maxId;
    },
    setCurrent: function(pk) {
        this.current = pk;
    },
    getCurrent: function() {
        return this.current || null;
    },
    commit: function() {
        var raw = this.raw();
        localStorage.setItem(this.url, JSON.stringify(raw));
    },
    fetch: function() {
        var col = localStorage.getItem(this.url) || null;

        if(col) {
            // Corrupt/tampered bookmark data shouldn't throw out of init - skip it on failure.
            try {
                this.add(JSON.parse(col));
            }
            catch(e) {
                this.app && this.app.debug && this.app.log('ignoring invalid bookmark data');
            }
        }
    },
    limitReached: function() {
        var limit = this.app.configs.bookmarkLimit || 20;
        return this.length >= limit;
    },
    list: function() {
        // console.log(this.raw());
    },
    findByPk: function(pk) {
        var model = this.app.bookmarks.find(function(model) {
            return model.get('pk') == pk;
        });

        return model;
    }
});
