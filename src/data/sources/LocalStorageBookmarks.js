var kind = require('enyo/kind');
var Source = require('enyo/LocalStorageSource');

module.exports = kind({
    name: 'LocalStorage',
    kind: Source,
    prefix: 'BibleSuperSearchBookmarks',

    commit: function(model, opts) {
        this.log(model, opts);
    },
    destroy: function(model, opts) {
        this.log(model, opts);
    },
    fetch: function(model, opts) {
        this.log(model, opts);
    },    
    find: function(model, opts) {

    }
});

