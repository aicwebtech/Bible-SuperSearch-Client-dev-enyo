var kind = require('enyo/kind');
var Controller = require('enyo/ModelController');
var Model = require('../models/UserConfig');

module.exports = kind({
    name: 'UserConfig',
    kind: Controller,
    pk: null, // primary key of the model

    newModel: function(pk) {
        this.pk = pk;
        var model = new Model({_pid: pk});

        pk && model.fetch({});
        this.set('model', model);
    }

});

