var kind = require('enyo/kind');
var Controller = require('enyo/ModelController');
var Model = require('../models/UserConfig');

module.exports = kind({
    name: 'UserConfig',
    kind: Controller,
    pk: null, // primary key of the model
    lsUrl: 'BibleSuperSearchUserConfig',
    _languageCache: null,

    newModel: function(pk) {
        this.pk = pk;
        var model = new Model({_pid: pk});

        pk && model.fetch({});
        this.set('model', model);
    },
    clear: function() {
        this.newModel(0);
        this._updateDefaults();
    },
    reset: function() {
        this.app.set('localeManual', true); // reset is always manual and since this touches the locale, we need to set it to manual
        // these may be needed??
        // this.set('bibles_selected', []);
        // this.app.set('locale', this.app.configs.language);
        if(!this.saveLanguages()) {
            this._languageCache = this.app.get('locale') || null;
            console.log('userconfig saveLanguages is false!', this._languageCache);
        }

        this.clear();
        this.save();
        this.app.set('localeManual', false);
    },
    load: function() {
        var userConfigs = localStorage.getItem( this.lsUrl ) || null;

        if(userConfigs) {
            try {                
                var userConfigs = userConfigs ? JSON.parse(userConfigs) : {};

                if(!this.saveLanguages()) {
                    userConfigs.locale = this.app.configs.language;
                }

                if(!this.saveBibles()) {
                    console.log('User config NOT loaded, saveUserBibleSelections is false!');
                    userConfigs.bibles_selected = [];
                }

                console.log('User config loaded', userConfigs);

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

        var configs = this.model.raw();

        this.app.debug && console.log('Saving user config', configs);

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
        this.app.debug && console.log('UserConfig._updateDefaults()');
        
        if(this.app.configs.textDisplayDefault) { 
            this.set('render_style', this.app.configs.textDisplayDefault);
            this.set('read_render_style', this.app.configs.textDisplayDefault);
        }

        this.set('locale', this._getDefaultLang());
        this.app.get('appLoaded') && this.app.set('locale', this._getDefaultLang());

        this.set('parallel_search_error_suppress', this.app.configs.parallelSearchErrorSuppress);
        this.set('bibles_selected', []);

        //         if(this.app.parallelSearchErrorSuppressUserConfig) {
        //     var parallelSurpress = this.app.UserConfig.get('parallel_search_error_suppress') || false;
        // } else {
        //     var parallelSurpress = this.app.configs.parallelSearchErrorSuppress || false;
        // }
    },
    saveBibles: function() {
        return this.app.configs.saveUserBibleSelections && this.app.configs.saveUserBibleSelections != 'false';
    },
    saveLanguages: function() {
        return !this.app.configs.omitUserLanguage || this.app.configs.omitUserLanguage == 'false';
    },
    hasBibles: function() {
        if(this.saveBibles()) {
            var bibles = this.get('bibles_selected') || [];
            return Array.isArray(bibles) && bibles.length > 0;
        } else {
            return false;
        }
    },
    _getDefaultLang: function() {
        return this._languageCache || this.app.configs.language;
    },
});
