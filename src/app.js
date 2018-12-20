var kind = require('enyo/kind');
//var Button = require('enyo/Button');
var Application = require('enyo/Application');
var options = require('enyo/options');
var Ajax = require('enyo/Ajax');
var defaultConfig = require('./config/default');
var buildConfig = require('./config/build');
var systemConfig = require('./config/system');
var utils = require('enyo/utils');
var DefaultInterface = require('./view/interfaces/twentytwenty/TwentyTwenty');
var Interfaces = require('./view/Interfaces');
var UserConfigController = require('./data/controllers/UserConfig');
var Router = require('enyo/Router');
var Loading = require('./components/LoadingInline');

//var MainView = require('./view/Content');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

var App = Application.kind({
    name: 'BibleSuperSearch',

    defaultView: DefaultInterface,
    //renderTarget: 'biblesupersearch_container',
    configs: {},
    build: {},
    system: {},
    // view: Loading, // Loading will be replaced with actual UI
    renderOnStart: false,       // We need to load configs first
    rootDir: null,
    testing: false,             // Indicates unit tests are running
    statics: {},
    maximumBiblesDisplayed: 8,  // The absolute maximum number of parallel bibles that can be possibly displayed
    bibleDisplayLimit: 8,       // Maximum number of paralell Bibles that can be displayed, calculated based on screen size
    resetView: true,
    appLoaded: false,
    ajaxLoadingDelayTimer: null,
    baseTitle: null,
    clientBrowser: null,

    published: {
        ajaxLoading: false,
        ajaxLoadingDelay: false
    },

    components: [
        {name: 'UserConfig', kind: UserConfigController, publish: true},
        {
            name: 'Router',
            kind: Router,
            triggerOnStart: true,
            routes: [ {handler: 'handleHashGeneric', default: true} ]
        }
    ],

    create: function() {
        this.inherited(arguments);
        this.log('defaultConfig', defaultConfig);
        this.configs = defaultConfig;
        this.build = buildConfig;
        this.system = systemConfig;
        this.set('baseTitle', document.title);
        
        // Older rootDir code, retaining for now
        this.rootDir = (typeof biblesupersearch_root_directory == 'string') ? biblesupersearch_root_directory : '/biblesupersearch';
        
        if(navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1) {
            this.clientBrowser = 'IE';
            this.log('Using Internet Explorer ... some minor functionality may be disabled ...');
        }
        
        // Experimental code for determining root dir from script
        // Appears to be working
        // Set biblesupersearch_root_directory for best performance
        if(typeof biblesupersearch_root_directory == 'string') {
            this.rootDir = biblesupersearch_root_directory;
        }
        else {        
            var path = document.querySelector('script[src*="biblesupersearch.js"]').getAttribute('src');
            var dirParts = path.split('/'); 
            var name = dirParts.pop();
            var dir = dirParts.join('/') || null;

            if(!dir) {
                var hashParts = window.location.href.split('#');
                dirParts = hashParts[0].split('/'); 
                name = dirParts.pop();
                dir = dirParts.join('/') || window.location.href;
            }
            
            // dir = dir.replace('/'+name,"");
            this.log('bss script dir', dir, dirParts, path, hashParts, dirParts, name, window.location.href);
            this.rootDir = dir;
        }

        this.log('rootDir - FINAL', this.rootDir);

        // If user provided a config path, use it.
        var config_path = (typeof biblesupersearch_config_path == 'string') ? biblesupersearch_config_path + '/config.json' : this.rootDir + '/config.json';

        if(typeof biblesupersearch_config_options == 'object') {
            utils.mixin(this.configs, biblesupersearch_config_options);
            this.log('configs - preloaded');
            this.handleConfigFinal();
            return;
        }

        if(this.build.dynamicConfig == true) {
            config_path = this.build.dynamicConfigUrl;
        }

        var loader = new Ajax({
            url: config_path,
            method: 'GET'
        });

        loader.go(); // for GET
        loader.response(this, 'handleConfigLoad');
        loader.error(this, 'handleConfigError');
    },
    handleConfigError: function() {
        alert('Error: Failed to load application configuration.  Error code 1');
        this.handleConfigFinal();
    },
    handleConfigLoad: function(inSender, inResponse) {
        utils.mixin(this.configs, inResponse);
        this.log('configs - loaded', utils.clone(this.configs));
        this.handleConfigFinal();
    },
    handleConfigFinal: function() {
        if(this.configs.target) {
            this.renderTarget = this.configs.target;
        }


        // this.render();
        this.log(this.configs);
        var view = null;
        this.UserConfig.newModel(0);
        this.log('USER', this.UserConfig.model);

        if(this.configs.interface) {
            this.log('Interface ', this.configs.interface);

            if(Interfaces[this.configs.interface]) {
                this.log('secondary view found', this.configs.interface);
                view = Interfaces[this.configs.interface];
            }
            else {
                this.log('Config error: interface \'' + this.configs.interface + '\' not found, using default interface');
                view = this.defaultView;
            }
        }

        // Render 'Loading' view
        // Todo - set css style based on selected interface
        this.set('view', Loading);
        // var ViewObject = new view;
        // this.log('ViewObject', ViewObject);
        // this.view.addClass(view.getClass);
        this.render();
        this.configs.apiUrl += '/api';

        // Load Static Data (Bibles, Books, ect)
        var ajax = new Ajax({
            url: this.configs.apiUrl + '/statics',
            method: 'GET'
        });

        // Experimental
        // if(view && view != null) {
        //     this.log('view set');
        //     this.set('view', view);
        // }
        
        // this.render();
        // this.set('ajaxLoading', true);
        // Experimental

        this.log('loading statics');
        ajax.go();
        ajax.response(this, function(inSender, inResponse) {
            // this.set('ajaxLoading', false);
            this.log(inResponse);
            this.test();
            this.log('statics loaded');
            this.set('statics', inResponse.results);
            this.waterfall('onStaticsLoaded');

            if(view && view != null) {
                this.log('view set');
                this.set('view', view);
            }
            
            this.render();

            this.appLoaded = true;
            this.$.Router.trigger();
        });    

        ajax.error(this, function(inSender, inResponse) {
            // this.set('ajaxLoading', false);
            alert('Error: Failed to load application static data.  Error code 2');
        });    
    },
    rendered: function() {
        this.inherited(arguments);

        this.log('view node', this.view.hasNode());
    },

    /*  Used to run unit tests within app */
    test: function() {
        if(!this.testing || !QUnit) {
            return;
        }

        this.log();
        var t = this;

        //QUnit && QUnit.module("Basic Tests");

        QUnit.test( "Post Rendering", function( assert ) {
            assert.ok( t.viewReady, "The view should be rendered by the time we get here" );
        });

        // Test form stuff

        // Test AJAX calls
    },
    handleHashGeneric: function(hash) {
        if(!this.appLoaded) {
            return;
        }

        if(hash && hash != '') {
            hash = decodeURI(hash);
            var parts = hash.split('/');
            var mode  = parts.shift();

            if(mode == '') {
                var mode = parts.shift();
            }

            switch(mode) {
                case 'c':   // Cache uuid (hash) 
                    return this._hashCache(parts);
                    break;
                case 'p':   // Passage
                    return this._hashPassage(parts);
                    break;                   
                case 'r':   // Reference string
                    return this._hashReference(parts);
                    break;
                case 's':   // Search string
                    return this._hashSearch(parts);
                    break;                
                case 'context': // Contextual lookup
                    return this._hashContext(parts);
                    break;
                case 'strongs': // Strongs lookup
                    return this._hashSearch(parts);
                    break;
                case 'f': // JSON-endoded form data
                    return this._hashContext(parts);
                    break;
            }
        }
        else {
            this.log('no hash');
        }
    },    
    _hashCache: function(parts) {
        this.log();
        var hash = parts[0] || null;
        var page = parts[1] || null;
        this.waterfall('onCacheChange', {cacheHash: hash, page: page});
    },
    _hashPassage: function(parts) {
        var partsObj = this._explodeHashPassage(parts);
        var formData = this._assembleHashPassage(partsObj);
        this.waterfall('onHashRunForm', {formData: formData, newTab: 'auto'});
    },    
    _hashStrongs: function(parts) {
        this.log(parts);
        var strongsNum = parts[0] || null;
        
        var formData = {
            search: strongsNum
        };

        // var partsObj = this._explodeHashPassage(parts);
        // var formData = this._assembleHashPassage(partsObj);
        this.waterfall('onHashRunForm', {formData: formData, newTab: 'auto'});
    },
    _hashContext: function(parts) {
        var partsObj = this._explodeHashPassage(parts);

        if(!partsObj.chap || !partsObj.verse || partsObj.chap.indexOf('-') != -1 || partsObj.verse.indexOf('-') != -1) {
            this.log('invalid context');
            return;
        }

        var formData = this._assembleHashPassage(partsObj);
        formData.context = true;
        this.waterfall('onHashRunForm', {formData: formData, newTab: true});
    },    
    _hashReference: function(parts) {
        var partsObj = this._explodeHashPassage(parts);

        partsObj.chap  = null;
        partsObj.verse = null;

        var formData = this._assembleHashPassage(partsObj);
        this.waterfall('onHashRunForm', {formData: formData, newTab: true});
    },   
     _hashSearch: function(parts) {
        var bible  = parts[0] || null;
        var search = parts[1] || null;

        var formData = {
            search: search.replace(/%20/g, ' '),
            bible: bible ? bible.split(',') : null,
        };
        
        this.waterfall('onHashRunForm', {formData: formData, newTab: true});
    },
    _hashForm: function(parts) {
        var formData = (parts[0]) ? JSON.parse(parts[0]) : {};
        this.waterfall('onHashRunForm', {formData: formData, newTab: true});
    },
    _explodeHashPassage: function(parts) {
        var exploded = {
            bible : parts[0] || null,
            book  : parts[1] || null,
            chap  : parts[2] || null,
            verse : parts[3] || null
        }

        return exploded;
    },
    _assembleHashPassage: function(partsObj) {
        if(!partsObj.book) {
            return {};
        }

        var ref = partsObj.book.replace(/%20/g, ' ');

        if(partsObj.chap) {
            ref += ' ' + partsObj.chap;

            if(partsObj.verse && partsObj.chap.indexOf('-') == -1) {
                ref += ':' + partsObj.verse;
            }
        }

        var formData = {
            bible: partsObj.bible ? partsObj.bible.split(',') : null,
            reference: ref
        };

        this.log(formData);
        return formData;
    },
    handleCacheHash: function(inSender, inEvent) {
        this.log(arguments);
        this.log(inSender);
        this.log(inEvent);
    },    
    handlePassageHash: function(inSender, inEvent) {
        this.log(arguments);
        this.log(inSender);
        this.log(inEvent);
    },
    ajaxLoadingChanged: function(was, is) {
        this.log(is);

        if(this.view && this.view.set) {
            this.log('setting');
            this.view.set('ajaxLoading', is);
        }
    },
    ajaxLoadingDelayChanged: function(was, is) {
        var delay = is || false,
            t = this;

        if(!delay) {
            this.ajaxLoadingDelay = false;
            window.clearTimeout(this.ajaxLoadingDelayTimer);
            this.set('ajaxLoading', false);
        }
        else {
            this.ajaxLoadingDelayTimer = window.setTimeout(function() {
                t.set('ajaxLoading', true);
            }, delay);
        }
    },
    getSubControl: function(name) {
        var varName = name + 'Control';
        return this.getViewProp(varName);
    },
    getViewProp: function(prop) {
        var val = (this.view && this.view.get) ? this.view.get(prop) : null;
        return val || null;
    },
    getBook: function(id) {
        return this.statics.books[id - 1] || null;
    },
    getNumberOfEnabledBibles: function() {
        if(this.numberOfEnabledBibles) {
            return this.numberOfEnabledBibles;
        }

        var bibleCount = 0;

        if(this.configs.enabledBibles) {
            bibleCount = this.configs.enabledBibles.length;
        }

        if(bibleCount == 0) {        
            bibleCount = this.getNumberOfAvailableBibles();
        }

        this.log('bibleCount', bibleCount);
        this.numberOfEnabledBibles = bibleCount;
        return bibleCount;
    },
    getNumberOfAvailableBibles: function() {
        var bibleCount = 0;

        for(i in this.statics.bibles) {
            bibleCount ++;
        }

        return bibleCount;
    },
    singleBibleEnabled: function() {
        return (this.getNumberOfEnabledBibles() == 1) ? true : false;
    },
    staticsChanged: function(was, is) {
        for(i in is.bibles) {
            is.bibles[i].rtl = this._isRtl(is.bibles[i].lang_short);
        }
    },
    _isRtl: function(language) {
        return (language == 'he' || language == 'ar') ? true : false;
    }
});

module.exports = App;
