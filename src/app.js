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
var FormatButtons = require('./view/FormatButtons');
var NavigationButtons = require('./view/BrowsingButtons');
var Pagers = require('./view/Pagers');
var UserConfigController = require('./data/controllers/UserConfig');
var Router = require('enyo/Router');
var i18n = require('enyo/i18n');
var Loading = require('./components/LoadingInline');
var Locales = require('./i18n/LocaleLoader');
var Validators = require('./lib/Validators');
var Utils = require('./lib/Utils');
var AlertDialog = require('./components/dialogs/Alert');
var ResponseCollection = require('./data/collections/ResponseCollection');
var BookmarkCollection = require('./data/collections/BookmarkCollection');
var StorageManager = require('./data/LocalStorageManager');
var ErrorView = require('./view/ErrorView');

//var MainView = require('./view/Content');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

// Extend Router to suppres _currentChanged console logging.
var BssRouter = kind({
    name: 'BssRouter',
    kind: Router,
    _currentChanged: function(was, is) {} 
});

var App = Application.kind({
    name: 'BibleSuperSearch',
    applicationVersion: '5.4.0',
    defaultView: DefaultInterface,
    // renderTarget: 'biblesupersearch_container',
    configs: {},
    build: {},
    system: {},
    // view: Loading, // Loading will be replaced with actual UI
    renderOnStart: false,       // We need to load configs first
    rootDir: null,
    testing: false,             // Indicates unit tests are running
    debug: false,
    statics: {},
    maximumBiblesDisplayed: 8,  // The absolute maximum number of parallel bibles that can be possibly displayed
    bibleDisplayLimit: 8,       // Maximum number of paralell Bibles that can be displayed, calculated based on screen size
    defaultBibles: [],
    history: [],
    bookmarks: null,
    resetView: true,
    appLoaded: false,
    ajaxLoadingDelayTimer: null,
    baseTitle: null,
    bssTitle: null,
    baseUrl: null,
    clientBrowser: null, // legacy
    client: {
        os: null,
        browser: null,
        isMobile: false,
    },
    preventRedirect: false,
    shortHashUrl: '',
    biblesDisplayed: [],
    locale: 'en',
    defaultLocale: 'en', // hardcoded
    localeManual: false, // whether locale has been manually changed
    localeData: Locales.en,
    localeDatasetsRaw: Locales,
    localeDatasets: {},
    localeBibleBooks: {},
    validate: Validators,
    AlertDialog: AlertDialog,
    responseCollection: ResponseCollection,
    storage: StorageManager,
    utils: Utils,
    hasAjaxSuccess: false,
    hasMouse: false, // use mouse events to detect

    useNewSelectors: false,

    // 'container_top' or 'results_top'
    scrollMode: 'container_top',   // Ensures default loading page does NOT scroll down
    scrollModeDefault: 'results_top',
    
    // Selectable sub-views:
    formatButtonsView: null,
    navigationButtonsView: null,
    pagerView: null,

    published: {
        ajaxLoading: false,
        ajaxLoadingDelay: false
    },

    components: [
        {name: 'UserConfig', kind: UserConfigController, publish: true},
        {
            name: 'Router',
            kind: BssRouter,
            triggerOnStart: true,
            routes: [ {handler: 'handleHashGeneric', default: true} ]
        }
    ],

    observers: [
        //{method: 'watchSingleVerses', path: ['UserConfig.single_verses', 'UserConfig.passages']}
        {method: 'watchRenderStyle', path: ['UserConfig.render_style']}
    ],

    create: function() {
        this.inherited(arguments);
        this.configs = utils.clone(defaultConfig);
        this.build = buildConfig;
        this.system = systemConfig;
        this.set('baseTitle', document.title);
        var t = this;
        // this.log('defaultConfig', defaultConfig);

        window.console && console.log('BibleSuperSearch client version', this.applicationVersion);
        
        // Older rootDir code, retaining for now
        this.rootDir = (typeof biblesupersearch_root_directory == 'string') ? biblesupersearch_root_directory : '/biblesupersearch';
        
        this.detectClient();

        if(typeof biblesupersearch != 'object' || biblesupersearch == null) {
            biblesupersearch = {
                app: this,
                instances: {}
            }
        }
        
        // Code for determining root dir from script
        // Set biblesupersearch_root_directory for best performance
        if(typeof biblesupersearch_root_directory == 'string') {
            this.rootDir = biblesupersearch_root_directory;
            // this.log('rootDir - using biblesupersearch_root_directory');
        }
        else {        
            var dir = null;
            var script = document.querySelector('script[src*="biblesupersearch.js"]');

            // script = null;

            if(script) {
                var path = script.getAttribute('src');
                var dirParts = path.split('/'); 
                var name = dirParts.pop();
                dir = dirParts.join('/') || null;
                // this.log('rootDir - using script path');
            }

            if(!dir) {
                var hashParts = window.location.href.split('#');
                dirParts = hashParts[0].split('/'); 
                name = dirParts.pop();
                dir = dirParts.join('/') || hashParts[0];
                // this.log('rootDir - using window location');
            }
            
            // dir = dir.replace('/'+name,"");
            // this.log('bss script dir', dir, dirParts, path, hashParts, dirParts, name, window.location.href);
            this.rootDir = dir;
        }

        // this.log('rootDir - FINAL', this.rootDir);
        var urlParts = window.location.href.split('#');
        this.baseUrl = urlParts[0];
        // this.log('baseUrl - FINAL', this.baseUrl);

        // If user provided a config path, use it.
        var config_path = (typeof biblesupersearch_config_path == 'string') ? biblesupersearch_config_path + '/config.json' : this.rootDir + '/config.json';

        if(typeof biblesupersearch_config_options == 'object') {
            utils.mixin(this.configs, biblesupersearch_config_options);
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
    detectClient: function() {
        this.debug && this.log('navigator', navigator);

        if(navigator.platform == 'Win32' || navigator.userAgent.indexOf('Windows') !== -1) {
            this.client.os = 'Windows';
        } 
        else if(navigator.userAgent.indexOf('Android') !== -1) {
            this.client.os = 'Andriod';
            this.client.isMobile = true;
        }

        // todo: Mac OS / iOS detection, the below are just guesses
        else if (navigator.userAgent.indexOf('OSX') !== -1 || navigator.userAgent.indexOf('MacOS') !== -1) {
            this.client.os = 'MacOS';
        } else if (navigator.userAgent.indexOf('iOS') !== -1) {
            this.client.os = 'iOS';
            this.client.isMobile = true;
        }

        if(navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1) {
            this.client.browser = 'IE'; // MS IE no longer officially supported ... 
            window.console && console.log('Using Internet Explorer ... some minor functionality may be disabled ...');
        } else if(navigator.userAgent.indexOf('Firefox') !== -1) {
            this.client.browser = 'Firefox';
        } else if(navigator.userAgent.indexOf('WebKit') !== -1) {
            this.client.browser = 'WebKit'; // Chrome, Safari, Edge, ect
        }

        this.clientBrowser = this.client.browser;
        this.debug && this.log('client', this.client);
    },
    createInstance: function(container, configs) {
        var inst = new App;

        configs = configs || this.configs;
        configs.target = container;
        inst.configs = configs;
        inst.renderInto(container);
        // this.log('New instance:', inst);
        biblesupersearch.instances[container] = inst;
    },
    handleConfigError: function() {
        alert('Error: Failed to load application configuration.  Error code 1');
        this.handleConfigFinal();
    },
    handleConfigLoad: function(inSender, inResponse) {
        utils.mixin(this.configs, inResponse);
        this.handleConfigFinal();
    },
    handleConfigFinal: function() {
        if(this.configs.target) {
            this.renderTarget = this.configs.target;
        }

        var view = null;
        this.UserConfig.newModel(0);
        this.initBookmarks();

        if(this.configs.interface) {

            if(Interfaces[this.configs.interface]) {
                view = Interfaces[this.configs.interface];
            }
            else {
                this.log('Config error: interface \'' + this.configs.interface + '\' not found, using default interface');
                view = this.defaultView;
            }
        }

        if(this.configs.formatButtons && this.configs.formatButtons != 'default') {
            if(FormatButtons[this.configs.formatButtons]) {
                this.formatButtonsView = FormatButtons[this.configs.formatButtons];
            }
        }        

        if(this.configs.navigationButtons && this.configs.navigationButtons != 'default') {
            if(NavigationButtons[this.configs.navigationButtons]) {
                this.navigationButtonsView = NavigationButtons[this.configs.navigationButtons];
            }
        }        

        if(this.configs.pager && this.configs.pager != 'default') {
            if(Pagers[this.configs.pager]) {
                this.pagerView = Pagers[this.configs.pager];
            }
        }

        if(this.configs.defaultBible) {
            this.defaultBibles = (typeof this.configs.defaultBible == 'string') ? this.configs.defaultBible.split(',') : this.configs.defaultBible;
        } else {
            this.defaultBibles = ['kjv'];
        }

        this.defaultBiblesRaw = utils.clone(this.defaultBibles);

        if(this.configs.pageScrollTopPadding) {
            if(typeof this.configs.pageScrollTopPadding == 'string') {
                this.configs.pageScrollTopPadding = parseInt(this.configs.pageScrollTopPadding, 10);
            }
        }

        if(this.configs.textDisplayDefault && this.configs.textDisplayDefault != 'passage') {
            this.UserConfig.set('render_style', this.configs.textDisplayDefault);
            this.UserConfig.set('read_render_style', this.configs.textDisplayDefault);
        }

        if(
            this.configs.parallelBibleLimitByWidth && 
            Array.isArray(this.configs.parallelBibleLimitByWidth) &&
            this.configs.parallelBibleLimitByWidth.length > 0
        ) {

            var pMax = 0,
                bMax = 1,
                bLast = 0,
                gMaxReached = false,
                hasError = false,
                hasZeroPixel = false;

            for(i in this.configs.parallelBibleLimitByWidth) {
                if(gMaxReached) {
                    this.log('Error: parallelBibleLimitByWidth has values past the global maximum');
                    hasError = true;
                    continue;
                }

                pLimit = this.configs.parallelBibleLimitByWidth[i];

                pLim = parseInt(pLimit.minWidth, 10);
                bLim = parseInt(pLimit.maxBibles, 10);
                bMin = parseInt(pLimit.minBibles, 10);
                bStart = parseInt(pLimit.startBibles, 10);

                if(bStart < bMin) {
                    this.log('Error: parallelBibleLimitByWidth: startBibles must be equal or greater than minBibles!');
                    hasError = true;
                }                

                if(bStart > bLim) {
                    this.log('Error: parallelBibleLimitByWidth: startBibles must be equal or less than maxBibles!');
                    hasError = true;
                }

                this.debug && this.log('parallel', pLimit, pLim, bLim);

                if(!this.configs.parallelBibleLimitByWidth[i].minBibles) {
                    this.configs.parallelBibleLimitByWidth[i].minBibles = 1;
                }

                if(i == 0 && pLim == 0) {
                    hasZeroPixel = true;
                }

                if(pLimit.maxBibles == 'max') {
                    this.configs.parallelBibleLimitByWidth[i].maxBibles = bLim = 9999;
                    gMaxReached = true;
                } 

                // if(pLim < pMax || bLim < bMax) {
                if(pLim < pMax) {
                    //this.log('Error: parallelBibleLimitByWidth has values out of order, width and Bible limits must be in ascending order!');
                    this.log('Error: parallelBibleLimitByWidth has values out of order, width limits must be in ascending order!');
                    hasError = true;
                }

                this.configs.parallelBibleLimitByWidth[i].minWidth = pLim;
                this.configs.parallelBibleLimitByWidth[i].maxBibles = bLim;
                this.configs.parallelBibleLimitByWidth[i].minBibles = bMin;
                this.configs.parallelBibleLimitByWidth[i].startBibles = bStart;

                pMax = pLim;
                bMax = bLim;
            }

            if(hasError) {
                this.configs.parallelBibleLimitByWidth = false;
            } else {            
                if(!hasZeroPixel) {
                    this.configs.parallelBibleLimitByWidth.unshift({'minWidth' : 0, 'maxBibles' : 1});
                }
            }
        } else {
            this.configs.parallelBibleLimitByWidth = false;
        }

        this.debug && this.log('parallelBibleLimitByWidth', this.configs.parallelBibleLimitByWidth);

        // Render 'Loading' view
        // Todo - set css style based on selected interface
        this.set('view', Loading);
        this.render();

        this.configs.apiUrl = this.configs.apiUrl.replace(/\/+$/, '') + '/api';
        this.configs.apiKeyStr = (this.configs.apiKey && this.configs.apiKey != '') ? '&key=' + this.configs.apiKey : '';
        
        if(this.configs.debug) {
            this.debug = this.configs.debug;
        }

        //window.biblesupersearch_configs_final = this.configs;

        if(typeof biblesupersearch_statics == 'object' && biblesupersearch_statics != null) {
            if(this._validateStatics(biblesupersearch_statics)) {            
                this.debug && this.log('Using provided biblesupersearch_statics');
                this._handleStaticsLoad(biblesupersearch_statics, view);
                return;
            } else {
                this.log('ERROR: Provided biblesupersearch_statics is not valid, defaulting to API-provided statics.');
            }
        }

        // Load Static Data (Bibles, Books, ect)
        var ajax = new Ajax({
            url: this.configs.apiUrl + '/statics?language=en' + this.configs.apiKeyStr,
            method: 'GET'
        });

        var ajaxData = {};
        ajaxData.bible_order_by = this._getBibleOrderBy();

        ajax.go(ajaxData);
        ajax.response(this, function(inSender, inResponse) {
            this.hasAjaxSuccess = true;
            this._handleStaticsLoad(inResponse.results, view);
        });    

        ajax.error(this, function(inSender, inResponse) {
            // this.set('ajaxLoading', false);
            var msg = 'Failed to load application static data from API.';

            this.displayInitError(msg, 2, inSender, inResponse);
        });    
    },
    _getBibleOrderBy: function() {
        var groupOrder = null;

        switch (this.configs.bibleGrouping) {
            case 'language':
            case 'language_and_english':
                groupOrder = 'lang_name';
                break;            
            case 'language_english':
                groupOrder = 'lang_name_english';
                break;
            case 'none':
            default:
                groupOrder = null;
        }

        return (groupOrder) ? groupOrder + '|' + this.configs.bibleSorting : this.configs.bibleSorting;
    },
    _validateStatics: function(statics) {
        var strings = ['name', 'version', 'environment'];
            arrays = ['books', 'search_types', 'shortcuts', 'download_formats'];
            objects = ['bibles'];

        for(i in strings) {
            item = strings[i];

            if(typeof statics[item] !== 'string') {
                return false;
            }
        }        

        for(i in arrays) {
            item = arrays[i];

            if(typeof statics[item] == 'undefined' || !Array.isArray(statics[item])) {
                return false;
            }
        }

        for(i in objects) {
            item = objects[i];

            if(typeof statics[item] !== 'object' || Array.isArray(statics[item]) || statics[item] === null) {
                return false;
            }
        }

        return true;
    },
    _handleStaticsLoad: function(statics, view) {
        this.test();
        this.set('statics', statics);
        this.processBiblesDisplayed();

        if(!statics.download_enabled) {
            defaultConfig._downloadDisabledNotice();
        }

        //this.localeBibleBooks.en = statics.books; // prepopulate the English book list

        var localeData = {}; // empty like my mind

        this._initLocaleBibleBooks('en', localeData, statics.books, 'statics');
        statics.books = this.localeBibleBooks.en;

        this.debug && this.log('Config language locale', this.configs.language);
        this.configs.language && this.set('locale', this.configs.language);
        this.waterfall('onStaticsLoaded');

        window.console && console.log('BibleSuperSearch API version', this.statics.version);

        this.configs.apiUrl == defaultConfig.apiUrl + '/api' ? defaultConfig._urlDefaultNotice() : defaultConfig._urlLocalNotice();

        if(view && view != null) {
            this.set('view', view);
            this.set('viewCache', view);
        }
        
        this.render();
        this.appLoaded = true;
        this.$.Router.trigger();

        this.waterfall('onAppLoaded');

        if(this.configs.query_string) {
            this.handleHashGeneric(this.configs.query_string);
        }
    },
    processBiblesDisplayed: function() {
        this.biblesDisplayed = [];

        var bibles = this.statics.bibles,
            displayed = [],
            enabled = this.configs.enabledBibles,
            orderBy = this._getBibleOrderBy().split('|'),
            t = this,

            processBible = function(bible) {
                bible.lang = t.utils.ucfirst(bible.lang);
                bible.lang_native = t.utils.ucfirst(bible.lang_native);
                displayed.push(bible);
            };

        if(Array.isArray(enabled) && enabled.length) {
            for(i in enabled) {
                //bibles[enabled[i]] && displayed.push(bibles[enabled[i]]);
                bibles[enabled[i]] && processBible(bibles[enabled[i]]);
            }
        }
        else {        
            for(i in bibles) {
                //displayed.push(bibles[i]);
                processBible(bibles[i]);
            }
        } 

        displayed.sort(function(a, b) {
            var ob = null,
                compA = null,
                compB = null;

            for(i in orderBy) {
                ob = orderBy[i];

                switch(ob) {
                    case 'lang_name':
                    case 'language':
                    case 'language_and_english':
                        ob = 'lang_native';
                        break;
                    case 'lang_name_english':
                    case 'language_english':
                        ob = 'lang';
                        break;
                }

                compA = a[ob] || null;
                compB = b[ob] || null;

                compA = (typeof compA == 'String') ? compA.toUpperCase() : compA;
                compB = (typeof compB == 'String') ? compB.toUpperCase() : compB;

                // Todo - implement descending sort option!
                if(compA > compB) {
                    return 1;
                }
                else if(compB > compA) {
                    return -1;
                }
            }

            return 0;
        });

        if(this.configs.bibleDefaultLanguageTop) {
            var lang = this.configs.language;

            var displayed_top = displayed.filter(function(bible) {
                return bible.lang_short == lang;
            });

            var displayed_bottom = displayed.filter(function(bible) {
                return bible.lang_short != lang;
            });

            this.biblesDisplayed = [].concat(displayed_top, displayed_bottom);
        } else {
            this.biblesDisplayed = displayed;
        }
    },
    rendered: function() {
        this.inherited(arguments);
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
            hash = hash.replace(/\./g, ' ');
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
                case 'q':   // Request string
                    return this._hashRequest(parts);
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
                    return this._hashForm(parts);
                    break;
            }
        }
        else {
            this.debug && this.log('no hash');
            this._hashLocalStorage();
        }
    },    
    _hashLocalStorage: function() {
        var formDataJson = localStorage.getItem('BibleSuperSearchFormData');

        if(!formDataJson || typeof formDataJson != 'string') {
            if(typeof biblesupersearch_form_data == 'object') {
                var formData = utils.clone(biblesupersearch_form_data);
            }
            else {
                return;
            }
        }
        else {
            var formData = JSON.parse(formDataJson);
        }

        if(formData.redirected) {
            this.preventRedirect = true;  // prevent further redirection if we were redirected here
        }

        localStorage.removeItem('BibleSuperSearchFormData');
        this.waterfall('onHashRunForm', {formData: formData, newTab: 'auto', submitAsManual: true});
    },
    _hashCache: function(parts) {
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
        var strongsNum = parts[0] || null;
        var formData = { search: strongsNum };
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
    _hashRequest: function(parts) {
        this._hashSearch(parts, true);
    },
    _hashSearch: function(parts, forceUseRequestField) {
        //OLD format: '#/s/<Bible(s)>/<SearchOrRequest>/<SearchType>/<Reference>/page/'

        // These elements should be ordered left to right in the order that represents the likeliness that they will be used.
        
        // Proposed new Formats: 
        // Current A: '#/s/<Bible(s)>/<SearchOrRequest>/<page>/<SearchType>/<Reference>/'
        // B: '#/s/<Bible(s)>/<SearchOrRequest>/<page>/<Reference>/<SearchType>/'
        // C: '#/s/<Bible(s)>/<SearchOrRequest>/<page>/'

        var bible  = parts[0] || null;
        var search = parts[1] || null;
        var page = parts[2] || null;
        var searchType = parts[3] || null;
        var reference = parts[4] || null;
        var useRequestField = (forceUseRequestField || this.formHasField('request')) ? true : false;

        var formData = {
            // search: search.replace(/%20/g, ' '),
            bible: bible ? bible.split(',') : null,
            search_type: searchType,
            reference: reference,
            page: page
        };
        
        if(useRequestField) {
            formData.request = search.replace(/%20/g, ' ');
        }
        else {
            formData.search = search.replace(/%20/g, ' ');
        }

        this.waterfall('onHashRunForm', {formData: formData, newTab: true});
    },
    _hashForm: function(parts) {
        var formData = (parts[0]) ? JSON.parse(parts[0]) : {};
        this.waterfall('onHashRunForm', {formData: formData, newTab: true});
    },
    runFormData: function(formData) {
        this.waterfall('onHashRunForm', {formData: formData, newTab: true, submitAsManual: true});
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

        var useRequestField = this.formHasField('request');
        var ref = partsObj.book.replace(/%20/g, ' ');

        if(partsObj.chap) {
            ref += ' ' + partsObj.chap;

            if(partsObj.verse && partsObj.chap.indexOf('-') == -1) {
                ref += ':' + partsObj.verse;
            }
        }

        var formData = {
            bible: partsObj.bible ? partsObj.bible.split(',') : null
        };

        if(useRequestField) {
            formData.request = ref;
        }
        else {
            formData.reference = ref;
        }

        return formData;
    },
    ajaxLoadingChanged: function(was, is) {
        if(this.view && this.view.set) {
            this.view.set('ajaxLoading', is);
        }
    },    
    sosShowingChanged: function(was, is) {
        if(this.view && this.view.set) {
            this.view.set('sosShowing', is);
        }
    },    
    startShowingChanged: function(was, is) {
        if(this.view && this.view.set) {
            this.view.set('startShowing', is);
        }
    },    
    downloadShowingChanged: function(was, is) {
        if(this.view && this.view.set) {
            this.view.set('downloadShowing', is);
        }
    },    
    shareShowingChanged: function(was, is) {
        if(this.view && this.view.set) {
            this.view.set('shareShowing', is);
        }
    },    
    linkShowingChanged: function(was, is) {
        if(this.view && this.view.set) {
            this.view.set('linkShowing', is);
        }
    },    
    settingsShowingChanged: function(was, is) {
        if(this.view && this.view.set) {
            this.view.set('settingsShowing', is);
        }
    },    
    helpShowingChanged: function(was, is) {
        if(this.view && this.view.set) {
            this.view.set('helpShowing', is);
        }
    },
    setDialogShowing: function(dialog, showing) {
        if(this.view && this.view.set) {
            this.view.setDialogShowing(dialog, showing);
        }
    },
    showHelp: function(section) {
        this.waterfall('onShowHelp', {section: section});
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
    formHasField: function(fieldName) {
        if(this.view && this.view.formHasField) {
            return this.view.formHasField(fieldName);
        }

        return false;
    },
    getFormFieldValue: function(fieldName) {
        if(this.view && this.view.getFormFieldValue) {
            return this.view.getFormFieldValue(fieldName);
        }
        
        return false;
    },    
    formIsShortHashable: function() {
        if(this.view && this.view._formIsShortHashable) {
            return this.view._formIsShortHashable();
        }
        
        return false;
    },
    setScroll: function(scroll) {
        var beh = this.configs.pageScroll || null,
            pad = this.configs.pageScrollTopPadding || 0;

        if(!beh || beh == 'none' || beh == 'false') {
            return;
        }

        this.debug && this.log('requested scroll', scroll);
        this.debug && this.log('pad', pad);

        if(this.view.hasNode() && this.view.hasClass('bss_no_global_scrollbar')) {
            // In this case, if scroll == 0, we assume we want to scroll to the very top of the page
            // Therefore, we don't add to the scroll
            if(scroll != 0) {
                scroll += this.view.hasNode().getBoundingClientRect().top + window.scrollY;
                scroll += pad;
            }

            window.scrollTo({
                top: scroll, 
                left: 0, 
                behavior: beh
            });
        } else {        
            scroll += pad;

            this.view.hasNode() && this.view.hasNode().scrollTo({
                top: scroll, 
                left: 0, 
                behavior: beh
            });
        }

        this.debug && this.log('delivered scroll', scroll);
    },
    resetScrollMode: function() {
        this.set('scrollMode', this.get('scrollModeDefault'));
    }, 
    getSelectedBibles: function() {
        var bibles = this.getFormFieldValue('bible');

        if(!bibles || bibles.length == 0 || bibles.length == 1 && bibles[0] == null) {
            bibles = this.configs.defaultBible;
        }

        if(!Array.isArray(bibles)) {
            bibles = [bibles];
        }

        return bibles;
    },
    getSelectedBiblesString: function() {
        var bibles = this.getSelectedBibles();
            bibles = bibles.filter(function(b) {
                return b != 0 && b != null;
            });

        var bibleString = bibles.join(',');
        return bibleString;
    },
    selectedBiblesMultipleLanguages: function() {
        var bibles = this.getSelectedBibles(),
            lang = null,
            langCur = null;

        bibles = bibles.filter(function(b) {
            return b != 0 && b != null;
        });

        this.log('bibles', bibles);

        for(i in bibles) {
            if(!this.statics.bibles[bibles[i]]) {
                this.log('no bible', bibles[i]);
                continue;
            }

            lang = this.statics.bibles[ bibles[i] ].lang_short || null;

            if(lang != langCur) {
                if(langCur == null) {
                    langCur = lang;
                } else {
                    return true;
                }
            }
        }

        return false;
    },
    // TO DO - apply this to the following:
    //   Pager, Nav Buttons (done), Format Buttons
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
    getLocaleBookName: function(id, fallbackName, useShortname) {

        if(this.configs.bibleBooksLanguageSource == 'bible') {
            this.log('bible source, using fallbackName');
            return fallbackName;
        }

        // :todo: make this a config??
        // Option 1: Display book names in language selected in UI (Reccomended)
        // Option 2: Display book names in language of First selected Bible (Legacy - not fully implemented)

        var locale = this.get('locale');

        if(typeof this.localeDatasets[locale] == 'undefined') {
            // Quick hack to get this working on WordPress for English
            if(locale == 'en') {
                var book = this.localeBibleBooks.en[id - 1];

                if(book && useShortname) {
                    return book.shortname || book.name;
                }

                return book ? book.name : fallbackName;
            }

            this.log('falling back to English!');
            locale = 'en'; // ??
        }
        // else {
        //     this.log('NOT falling fallbackName');
        // }

        useShortname = useShortname || false;
        var nameField = useShortname ? 'shortname' : 'name';

        if(locale == 'en' || this.localeDatasets[locale] && this.localeDatasets[locale].bibleBooksSource == 'api') {
            //return fallbackName;
        }

        var book = null;

        if(!this.localeDatasets[locale].bibleBooks[id - 1]) {
            this.log('BOOK MISSING FROM LOCALE, falling back to English');
            book = this.getBook(id);
        } else {
            book = this.localeDatasets[locale].bibleBooks[id - 1];
            book = book || this.getBook(id);
        }

        if(book && useShortname) {
            return book.shortname || book.name;
        }

        return book ? book.name : fallbackName;
    },
    getTestamentByBookId: function(bookId) {
        if(bookId >= 1 && bookId <= 39) {
            return 'Old Testament';
        }

        if(bookId >= 40 && bookId <= 66) {
            return 'New Testament';
        }

        return false;
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
            if(typeof is.bibles[i].rtl == 'undefined') {
                is.bibles[i].rtl = this._isRtl(is.bibles[i].lang_short);
            }
            else {
                this.validate.bool(is.bibles[i], 'rtl');
            }
        }
    },
    _isRtl: function(language) {
        return (
            language == 'he' || language == 'ar' || language == 'dv' || language == 'fa' || 
            language == 'ps' || language == 'ur' || language == 'yi' || language == 'ug'
        ) ? true : false;
    },
    logAnon: function() {
        window.console && console.log(arguments);
    },
    localeChanged: function(was, is) {
        var defaultLocale = this.defaultLocale || 'en';
        var locale = is || defaultLocale;
        var fallbackLocale = locale.substring(0, 2);
        var found = false;

        if(typeof this.localeDatasets[locale] == 'undefined') {
            this._initLocale(locale);
        }
        else {
            this._localeChangedHelper(locale);            
        }
    },
    _initLocale: function(locale) {
        var defaultLocale = this.defaultLocale || 'en';
        var locale = locale || defaultLocale;
        var fallbackLocale = language = locale.substring(0, 2);
        var found = false,
            localData = {};

        // TODO - mixin logic for locale data
        if(Locales[locale]) {
            localeData = Locales[locale];
            found = true;
        }        

        if(!found && Locales[fallbackLocale]) {
            localeData = Locales[fallbackLocale];
            found = true;
        }

        if(!found) {
            // this.localeData = Locales[defaultLocale];
            this.set('locale', defaultLocale);
            return;
        }
        
        if(found && locale != defaultLocale) {
            if(localeData.bibleBooks && localeData.bibleBooks.length >= 66) {
                this._initLocaleBibleBooks(locale, localeData, localeData.bibleBooks, 'locale');
                return;
            }

            // Load Bible book list
            var ajax = new Ajax({
                url: this.configs.apiUrl + '/books?language=' + language + this.configs.apiKeyStr,
                method: 'GET'
            });

            var ajaxData = {};
            ajax.go(ajaxData);
            ajax.response(this, function(inSender, inResponse) {
                this._initLocaleBibleBooks(locale, localeData, inResponse.results, 'api');
                return;

                this.localeBibleBooks[locale] = inResponse.results; // ??

                for(key in inResponse.results) {
                    var book = inResponse.results[key],
                        bookEn = this.localeBibleBooks.en[key] || null;

                    if(typeof localeData[ bookEn.name ] == 'undefined') {
                        localeData[ bookEn.name ] = book.name;
                    }
                }

                this.localeDatasets[locale] = utils.clone(localeData);
                this._localeChangedHelper(locale);
            });    

            ajax.error(this, function(inSender, inResponse) {
                // this.set('ajaxLoading', false);
                this.log('Error code 3 details', inSender, inResponse);
                alert('Error: Failed to load application Bible Book data.  Error code 3');
            });    
        }

        this.localeDatasets[locale] = utils.clone(localeData);
        this._localeChangedHelper(locale);
    },
    _initLocaleBibleBooks: function(locale, localeData, bookList, source) {
        for(key in bookList) {
            var book = bookList[key],
                bookEn = null;

            book.fn = this._fmtBookNameMatch(book.name, locale);
            book.sn = this._fmtBookNameMatch(book.shortname, locale);

            if(locale != 'en') {
                bookEn = this.localeBibleBooks.en[key] || null;
            }

            if(Array.isArray(book.matching)) {
                for(mk in book.matching) {
                    book.matching[mk] = this._fmtBookNameMatch(book.matching[mk], locale);
                }
            }

            if(bookEn) {            
                if(typeof localeData[ bookEn.name ] == 'undefined') {
                    localeData[ bookEn.name ] = book.name;
                }

                if(source == 'locale') {
                    bookList[key].chapters = bookEn.chapters;
                    // bookList[key].chapter_verses = bookEn.chapter_verses;
                }
            }
        }

        localeData.bibleBooksSource = source;
        this.localeBibleBooks[locale] = bookList;

        if(locale == 'en' && source == 'statics') {
            // do something special?
        } else {   
            this.localeDatasets[locale] = utils.clone(localeData);
            this._localeChangedHelper(locale);
        }
    },
    _fmtBookNameMatch: function(name, locale) {
        if(!name) {
            return '';
        }

        locale = typeof locale == 'undefined' ? locale : this.get('locale');
        var localeFmt = this._fmtLocaleName(locale);

        switch(localeFmt) {
            // :todo make sure all locales/sublocales are using the ISO standard
            // case 'zh_TW':
            // case 'zh_CN':
            case 'en_pirate': // NOT an ISO locale 
            case 'en-PIRATE': // NOT an ISO locale 
                var fmt = name.toLowerCase();
                break;
            default:
                var fmt = name.toLocaleLowerCase(localeFmt);
        }

        switch(locale) {
            case 'lv':
                fmt = fmt.replace(/ā/g, 'a');
                fmt = fmt.replace(/č/g, 'c');
                fmt = fmt.replace(/ē/g, 'e');
                fmt = fmt.replace(/ģ/g, 'g');
                fmt = fmt.replace(/ī/g, 'i');
                fmt = fmt.replace(/ķ/g, 'k');
                fmt = fmt.replace(/ļ/g, 'l');
                fmt = fmt.replace(/ņ/g, 'n');
                fmt = fmt.replace(/š/g, 's');
                fmt = fmt.replace(/ū/g, 'u');
                fmt = fmt.replace(/ž/g, 'z');
                break;
        }

        return fmt;
    },
    _fmtLocaleName: function(locale) {
        var parts = locale.split('_'),
            fmt = parts[0].toUpperCase();

        if(parts[1]) {
            fmt += '-' + parts[1].toUpperCase();
        }

        return fmt;
    },
    _localeChangedHelper: function(locale) {
        this.debug && this.log(locale);
        this.localeData = utils.clone(this.localeDatasets[locale]);
        var localeData = this.localeData;
        this.isRtl = localeData.meta.isRtl || false;

        Signal.send('onLocaleChange');
        this.waterfall('onLocaleChange');

        if(this.get('localeManual')) {
            Signal.send('onChangeLocaleManual');
            this.set('localeManual', false);
        }
    },
    // Translate
    t: function(string) {
        if(!string || string == '' || typeof string != 'string') {
            return '';
        }

        string = string.trim();

        var Locale = this.get('localeData'),
            trans = Locale[string] || string;

        if(Locale[string] && Locale[string] != '') {
            return Locale[string]; // Preferred method - exact string match
        }

        // End punctuation check
        var found = string.match(/([\.:!?])$/);

        if(found) {
            var p = found[1];
            stringNoP = string.slice(0, -1);

            if(Locale[stringNoP]) {
                return Locale[stringNoP] + p;
            }
        }

        // NOT preferred method - string regexp and replace
        for(i in Locales._partial) {
            var match = Locales._partial[i];

            if(!Locale[match] || Locale[match] == '') {
                continue;
            }

            var regexp = new RegExp(match, 'g');
            
            // this.log('trans found', match);
            trans = trans.replace(regexp, Locale[match]);
        }

        return trans;
    },
    // Translate string having embedded Bible passages
    vt: function(string) {
        if(!string || string == '') {
            return '';
        }

        var t = this;

        var trans = string.replace(/([0-9] )?[A-Za-z][A-Za-z ]*[A-Za-z]/g, function(match) {
            return t.t(match);
        });

        trans = trans.replace(/[0-9]+B/g, function(match) {
            var bookId = parseInt(match);
            return t.getLocaleBookName(bookId, match, false);
        });

        return trans;
    },    
    // Translate string having embedded keywords
    wt: function(string) {
        if(!string || string == '') {
            return '';
        }

        var t = this;
            
        var trans = string.replace(/[A-Za-z]+/g, function(match) {
            return t.t(match);
        });
        
        return trans;
    },
    findBookByName: function(bookName) {
        this.debug && this.log(bookName);
        var locale = this.get('locale');
        bookName = this._fmtBookNameMatch(bookName, locale);
        var BookList = this.localeBibleBooks[locale] || this.statics.books;

        // Pass 1: Exact match
        var book = BookList.find(function(bookItem) {
            if(bookName == bookItem.fn || bookName == bookItem.sn) {
                return true;
            }

            if(bookItem.matching && bookItem.matching.includes && bookItem.matching.includes(bookName)) {
                return true;
            }

            var namePeriodToSpace = bookItem.fn.replace(/\./g,' ');

            if(bookName == namePeriodToSpace) {
                return true;
            }

            return false;
        });

        // Pass 2: Partial match
        if(!book) {
            book = BookList.find(function(bookItem) {
                if(bookItem.fn.indexOf(bookName) == 0) {
                    return true;
                }                

                if(bookItem.sn.indexOf(bookName) == 0) {
                    return true;
                }

                return false;
            });
        }

        // Pass 3: (Experimental) Partial match, ignoring pumctuation
        if(!book) {
            var bookNameNoPunc = bookName.replace(/[ .;:]/g, ' ');

            book = BookList.find(function(bookItem) {
                var biNameNoPunc = bookItem.fn.replace(/[ .;:]/g, ' ');
                var biShortameNoPunc = bookItem.sn.replace(/[ .;:]/g, ' ');

                if(biNameNoPunc.indexOf(bookNameNoPunc) == 0) {
                    return true;
                }                

                if(biShortameNoPunc.indexOf(bookNameNoPunc) == 0) {
                    return true;
                }

                return false;
            });
        }

        return book;
    },
    pushHistory: function() {
        var title = this.get('bssTitle'),
            url = document.location.href,
            limit = this.configs.historyLimit || 50;

        if(this.history.length == 0 || this.history[0].title != title) {
            this.history.unshift({title: title, url: url});

            if(this.history.length > limit) {
                this.history = this.history.slice(0, limit);
            }

            localStorage.setItem('BibleSuperSearchHistory', JSON.stringify(this.history));
        }
    },
    clearHistory: function() {
        this.history = [];
        localStorage.setItem('BibleSuperSearchHistory', '[]');
    },
    alert: function(string, inSender, inEvent) {
        // todo - make some sort of custom alert dialog here!
        var tstr = this.t(string);

        if(inSender && inEvent) {
            Signal.send('onPositionedAlert', {alert: tstr, inSender: inSender, inEvent: inEvent});
        }
        else {
            Signal.send('onAlert', {alert: tstr});
        }
    },
    confirm: function(string, callback) {
        var tstr = this.t(string),
            confirm = window.confirm(tstr);

        callback && callback(confirm);
    },
    displayInitError: function(message, code) {
        window.console && console.log('BibleSuperSearch error: ' + message);
        window.console && console.log('BibleSuperSearch error code: ' + code);

        for(i = 2; i < arguments.length; i++) {
            var num = i - 1;
            window.console && console.log('BibleSuperSearch error details #' + num, arguments[i]);
        }

        this.set('view', ErrorView);
        // this.view.set('message', message);
        this.render();
    },
    displayInitError: function(message, code) {
        if(this.hasAjaxSuccess) {
            alert('An unknown error ha occurred');            
            return; // not an init error
        }

        window.console && console.log('BibleSuperSearch error: ' + message);
        window.console && console.log('BibleSuperSearch error code: ' + code);

        for(i = 2; i < arguments.length; i++) {
            var num = i - 1;
            window.console && console.log('BibleSuperSearch error details #' + num, arguments[i]);
        }

        this.set('view', ErrorView);
        // this.view.set('message', message);
        this.render();
    },
    responseDataChanged: function(was, is) {
        if(this.UserConfig.get('single_verses') || this.UserConfig.get('passages')) {
            this._checkRenderStyle();
        }
    },
    watchSingleVerses: function(pre, cur, prop)  {
        //this._checkRenderStyle();
    },
    watchRenderStyle: function(pre, cur, prop) {
        var crs = false;

        switch(cur) {
            case 'verse':
                this.UserConfig.set('passages', false);
                this.UserConfig.set('single_verses', true);
                this.UserConfig.set('paragraph', false);
                crs = true;
                break;            
            case 'verse_passage':
                this.UserConfig.set('passages', false);
                //this.UserConfig.set('passages', true);
                //this.UserConfig.set('single_verses', true);
                this.UserConfig.set('single_verses', false);
                this.UserConfig.set('paragraph', false);
                crs = true;
                break;
            default:
                this.UserConfig.set('single_verses', false);
                this.UserConfig.set('passages', false);
                this.UserConfig.set('paragraph', !!(cur == 'paragraph'));
        }

        switch(pre) {
            case 'verse':
            case 'verse_passage':
                crs = true;
            break;
        }

        this.debug && this.log('checking render style', crs, pre, cur);
        crs && this._checkRenderStyle();
    },
    _checkRenderStyle: function() {
        if(!this.get('responseData')) {
            return;
        }

        var passages = this.UserConfig.get('passages') || false;

        if(this.UserConfig.get('single_verses')) {
            var responseDataNew = utils.clone(this.get('responseData'));
            responseDataNew.results = utils.clone(responseDataNew.results);
            responseDataNew.results.results 
                = this.responseCollection.toVerses( utils.clone(responseDataNew.results.results), passages );
        }
        else if(passages) {
            var responseDataNew = utils.clone(this.get('responseData'));
            responseDataNew.results = utils.clone(responseDataNew.results);
            responseDataNew.results.results 
                = this.responseCollection.toMultiversePassages( utils.clone(responseDataNew.results.results) );
        }
        else {
            var responseDataNew = utils.clone( this.get('responseData') );
        }

        this.waterfall('onFormResponseSuccess', responseDataNew);
        Signal.send('onFormResponseSuccess', responseDataNew);
    },
    _copyComponentContent: function(Component, contentField, share, shareContent) {
        if(!Component) {
            return;
        }

        var contentField = contentField || 'content',
            share = share || false,
            share = navigator.share ? share : false,
            content = Component.get(contentField),
            shareContent = shareContent || content,
            tag = Component.get('tag'),
            n = Component.hasNode();

        if(!n || !content) {
            return;
        }

        // If share requested, attempt to use system share dialog
        // This requires HTTPS  
        if(share) {
            var promise = navigator.share({
                text: shareContent,
                title: document.title,
                url: window.location.href
            });

            promise.then(utils.bind(this, function() {
                this.debug && this.log('Successful share');
            }), 
            utils.bind(this, function() {
                this.debug && this.log('Failed to share');
            }));

            promise.catch(utils.bind(this, function(error) {
                this.debug && this.log('Failed to share');
            }));
            
            return;
        }

        // This code for selection all text in a HTML element was migrated from Bible SuperSearch version 3.0
        // This works, but there is probably a better way
        if (document.selection) {   // IE
            var div = document.body.createTextRange(); // IE only?
            div.moveToElementText(n);
            div.select();
        }
        else {                      // All others
            var div = document.createRange(); // Supported ALL
            div.setStartBefore(n); // Supported ALL
            div.setEndAfter(n); // Supported ALL
            window.getSelection().removeAllRanges(); // EXPERIMENTAL! Supported ALL
            window.getSelection().addRange(div); // EXPERIMENTAL! Supported ALL
        }

        // Attempt to use modern clipboard API
        // This requires HTTPS
        if((tag == 'p' || tag == 'div') && navigator && navigator.clipboard && navigator.clipboard.writeText) {
            var selected = window.getSelection().toString();
            var promise = navigator.clipboard.writeText(selected);
            this.debug && this.log('Using clipboard API');

            promise.then(utils.bind(this, function() {
                this.alert('Copied to clipboard');
            }), 
            
            utils.bind(this, function() {
                this.alert('Failed to copy');
            }));

            promise.catch(utils.bind(this, function(error) {
                this.alert('Failed to copy');
            }));
        }
        else {        
            // Fallback: Use depricated document.execCommand(copy)
            this.debug && this.log('Using document.execCommand(copy)');

            if(!document.execCommand) {
                this.alert('Unable to copy, please use HTTPS or copy manually.');
                return;
            }

            try {
                var success = document.execCommand('copy'); // depricated 

                if(success) {
                    this.alert('Copied to clipboard');
                }
                else {
                    this.alert('Failed to copy');
                }
            }
            catch (e) {
               this.alert('Failed to copy');
            }
        }

    },
    initBookmarks: function() {
        this.bookmarks = new BookmarkCollection;
        this.bookmarks.app = this;
        this.bookmarks.fetch();

        var hist = localStorage.getItem('BibleSuperSearchHistory') || null;

        this.history = hist ? JSON.parse(hist) : [];
    },
    copyHistoryToBookmarks: function() {
        this.history.forEach(function(item) {
            item.link = item.url;

            this.bookmarks.add(item);
        }, this);
    }
});

module.exports = App;
