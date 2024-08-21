var kind = require('enyo/kind');
var Controller = require('enyo/ModelController');
var Model = require('../models/Bookmark');

module.exports = kind({
    name: 'Bookmark',
    kind: Controller,
    pk: null, // primary key of the model
    isNew: false,

    newModel: function(pk) {
        this.pk = pk || null;
        this.isNew = pk == null ? true : false;
        var model = new Model({_pid: pk});

        pk && model.fetch({});
        this.set('model', model);
    },
    save: function() {
        model = this.get('model');

        if(this.get('isNew')) {
            this.app.bookmarks.addOne(model);
        } else {
            this.app.bookmarks.add(model);
        }
    }

});

