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
        console.log(data);

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
            this.add(JSON.parse(col));
        }
    },
    list: function() {
        console.log(this.raw());
    }
});
