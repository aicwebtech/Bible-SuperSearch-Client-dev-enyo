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
        //this._updateDefaults();
    },
    clear: function() {
        this.newModel(0);
        this._updateDefaults();
    },
    reset: function() {
        this.clear();
        this.save();
    },
    load: function() {
        var userConfigs = localStorage.getItem( this.lsUrl ) || null;

        if(userConfigs) {
            try {                
                var userConfigs = userConfigs ? JSON.parse(userConfigs) : {};

                if(this.app.configs.omitUserLanguage) {
                    userConfigs.locale = this.app.configs.language;
                }

                this.model.set(userConfigs);
                this.app.debug && console.log('User config loaded', userConfigs);
            } 
            catch(e) {
                console.log('error loading user config', e);
                this.clear();
            }
        } else {
            this.clear();
        }
    }, 
    save: function() {
        if(!this.app.configs.saveUserSettings) {
            this.app.debug && console.log('User config NOT saved, saveUserSettings is false!');
            return;
        }

        console.log('Saving user config');

        var configs = this.model.raw();

        if(configs.copy) {
            configs.copy_render_style = configs.render_style;
        } else {
            configs.read_render_style = configs.render_style;
        }
        
        this.set('locale', this.app.get('locale'));
        localStorage.setItem(this.lsUrl, JSON.stringify( configs ));
    },
    /*
     * Populate the user config model with default values
     * @private
     */
    _updateDefaults: function() {
        if(this.app.configs.textDisplayDefault) { 
            this.set('render_style', this.app.configs.textDisplayDefault);
            this.set('read_render_style', this.app.configs.textDisplayDefault);
        }

        this.set('locale', this.app.configs.language);
        this.app.get('appLoaded') && this.app.set('locale', this.app.configs.language);

        this.set('parallel_search_error_suppress', this.app.configs.parallelSearchErrorSuppress);

        //         if(this.app.parallelSearchErrorSuppressUserConfig) {
        //     var parallelSurpress = this.app.UserConfig.get('parallel_search_error_suppress') || false;
        // } else {
        //     var parallelSurpress = this.app.configs.parallelSearchErrorSuppress || false;
        // }
    }
});
