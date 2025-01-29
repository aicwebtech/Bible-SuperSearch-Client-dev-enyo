var kind = require('enyo/kind');
var Controller = require('enyo/ModelController');
var Model = require('../models/UserConfig');

module.exports = kind({
    name: 'UserConfig',
    kind: Controller,
    pk: null, // primary key of the model
    lsUrl: 'BibleSuperSearchUserConfig',

    newModel: function(pk) {
        this.pk = pk;
        var model = new Model({_pid: pk});

        pk && model.fetch({});
        this.set('model', model);
        this._updateDefaults();
    },
    clear: function() {
        this.newModel(0);
    },
    load: function() {
        var userConfigs = localStorage.getItem( this.lsUrl ) || null;

        if(userConfigs) {
            try {                
                var userConfigs = userConfigs ? JSON.parse(userConfigs) : {};
                this.model.set(userConfigs);
            } 
            catch(e) {
                console.log('error loading configs', e);
                this.clear();
            }
        }
    }, 
    save: function() {
        this.set('locale', this.app.get('locale'));
        localStorage.setItem(this.lsUrl, JSON.stringify( this.model.raw() ));
    },
    /*
     * @private
     */
    _updateDefaults: function() {
        if(this.app.configs.textDisplayDefault && this.app.configs.textDisplayDefault != 'passage') {
            this.set('render_style', this.app.configs.textDisplayDefault);
            this.set('read_render_style', this.app.configs.textDisplayDefault);
        }

        this.set('locale', this.app.configs.language);
    }
});
