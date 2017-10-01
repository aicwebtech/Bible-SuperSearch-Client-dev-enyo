var kind = require('enyo/kind');
var Model = require('enyo/Model');
var LocalStorageSource = require('../sources/LocalStorage');

module.exports = kind({
    name: 'UserConfig',
    kind: Model,
    source: LocalStorageSource,
    primaryKey: 'id',
    url: '', ///,
    
    attributes: {
        id: null,
        paragraph: false,
        copy: true,
        something: 'else',
        mmm: 'bacon'
    },

    getUrl: function() {
        // do something?
    }
});

