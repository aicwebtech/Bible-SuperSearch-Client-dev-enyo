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
var Passage = require('./components/Passage');

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
    applicationVersion: '6.2.0',
    defaultView: DefaultInterface,
    // renderTarget: 'biblesupersearch_container',
    configs: {},
    build: {},
    system: {},
    // view: Loading, // Loading will be replaced with actual UI
    renderOnStart: false,       // We need to load configs first
    rootDir: null,
    testInit: false, // whether to init the QUnit tests
    testOnLoad: false,
    testVerbose: false,
    testing: false,             // Indicates unit tests are running
    debug: false,
    statics: {},
    maximumBiblesDisplayed: 8,  // The absolute maximum number of parallel bibles that can be possibly displayed
    bibleDisplayLimit: 8,       // Maximum number of paralell Bibles that can be displayed, calculated based on screen size
    defaultBibles: [],
    defaultBiblesByLanguage: {}, // default Bibles by language
    history: [],
    visited: [],
    sessionVerseList: [],
    sessionVerseListStorageKey: 'BibleSuperSearchSessionVerseList',
    bookmarks: null,
    resetView: true,
    appLoaded: false,
    ajaxLoadingDelayTimer: null,
    configSaveDelayTimer: null,
    baseTitle: null,
    bssTitle: null,
    baseUrl: null,
    clientBrowser: 'unknown', // legacy
    client: {
        os: 'unknown',
        browser: 'unknown',
        isMobile: false,
        isWebkit: false,
    },
    preventRedirect: false,
    shortHashUrl: '',
    cacheId: null, // most recent cache id
    resultListRequestedCacheId: null,
    resultsListCacheId: null, // most recent search results cache id
    resultsListPage: 1, 
    resultsList: [], // most recent search results list
    resultsListWidth: null,
    resultsListHeight: null,
    altResultsData: null,
    resultsShowing: null,
    altResultsShowing: null,
    biblesDisplayed: [],
    biblesChanged: false, // whether the user has changed the displayed Bibles since last reset
    locale: 'en',
    defaultLocale: 'en', // hardcoded
    localeManual: false, // whether locale has been manually changed
    localeData: Locales.en,
    localeDatasetsRaw: Locales,
    localeDatasets: {},
    localeBibleBooks: {},
    _availableBookIds: null, // BSS-266: cached map {bookId: true} of books available in the selected Bible(s); null = all books
    _bibleBookIdsCache: null, // BSS-266: per-module parsed book_list cache
    _selectedBibles: null, // BSS-266: last Bible selection seen, so availability can be recomputed when statics reload
    isRtl: false,
    validate: Validators,
    AlertDialog: AlertDialog,
    responseCollection: ResponseCollection,
    storage: StorageManager,
    utils: Utils,
    loadingPagePrevent: false,
    hasAjaxSuccess: false,
    _blockAutoScroll: false,
    _crossReferenceView: false,
    hasMouse: false, // use mouse events to detect

    useNewSelectors: false,

    // 'container_top' or 'results_top'
    scrollMode: 'container_top',   // Ensures default loading page does NOT scroll down
    scrollModeDefault: 'results_top',
    
    // Selectable sub-views:
    formatButtonsView: null,
    navigationButtonsView: null,
    pagerView: null,

    accessible: [
        'diff', 'statistics', 'cross_references'
    ],

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
        },
        {
            name: 'Signal',
            kind: Signal,
            onBibleChange: 'handleBibleChange',
            onSessionVerseListAdd: 'handleSessionVerseListAdd',
        }
    ],

    observers: [
        //{method: 'watchSingleVerses', path: ['UserConfig.single_verses', 'UserConfig.passages']}
        // {method: 'userConfigChanged', path: ['UserConfig.status']},
        {method: 'watchRenderStyle', path: ['UserConfig.render_style']}
    ],

    create: function() {
        this.inherited(arguments);
        this.configs = utils.clone(defaultConfig);
        this.build = buildConfig;
        this.system = systemConfig;
        this.set('baseTitle', document.title);
        var t = this;

        Passage.setApp(t);

        if(typeof QUnit != 'undefined') {
            QUnit.config.autostart = false;
            QUnit.config.hidepassed = true;
        }
        // this.log('defaultConfig', defaultConfig);

        window.console && console.log('BibleSuperSearch client version', this.applicationVersion);
        
        // Older rootDir code, retaining for now
        this.rootDir = (typeof biblesupersearch_root_directory == 'string') ? biblesupersearch_root_directory : '/biblesupersearch';
        
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
        }
        else {        
            var dir = null;
            var script = document.querySelector('script[src*="biblesupersearch.js"]');

            if(script) {
                var path = script.getAttribute('src');
                var dirParts = path.split('/'); 
                var name = dirParts.pop();
                dir = dirParts.join('/') || null;
            }

            if(!dir) {
                var hashParts = window.location.href.split('#');
                dirParts = hashParts[0].split('/'); 
                name = dirParts.pop();
                dir = dirParts.join('/') || hashParts[0];
            }
            
            this.rootDir = dir;
        }
        

        var urlParts = window.location.href.split('#');
        this.baseUrl = urlParts[0];

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
        } else if(navigator.userAgent.indexOf('Linux') !== -1) {
            this.client.os = 'Linux';
            this.client.isMobile = false;
        }

        // todo: Mac OS / iOS detection, the below are just guesses
        else if (navigator.userAgent.indexOf('iPad') !== -1 || navigator.userAgent.indexOf('iPhone') !== -1) {
            this.client.os = 'iOS';
            this.client.isMobile = true;
        }
        else if (navigator.userAgent.indexOf('Macintosh') !== -1 || navigator.userAgent.indexOf('Mac OS') !== -1) {
            this.client.os = 'MacOS';
        } 

        if(navigator.userAgent.indexOf('WebKit') !== -1) {
            this.client.isWebkit = true; // Chrome, Safari, Edge, ect
        }

        if(navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1) {
            this.client.browser = 'IE'; // MS IE no longer officially supported ... 
            window.console && console.log('Using Internet Explorer ... some minor functionality may be disabled ...');
        } else if(navigator.userAgent.indexOf('Firefox') !== -1) {
            this.client.browser = 'Firefox';           
        } else if(navigator.userAgent.indexOf('Samsung') !== -1) {
            this.client.browser = 'Samsung'; // Webkit      
        }         
        else if(navigator.userAgent.indexOf('Edg/') !== -1) {
            this.client.browser = 'Edge'; // Webkit       
        }              
        else if(navigator.userAgent.indexOf('OPR/') !== -1) {
            this.client.browser = 'Opera';  // Webkit       
        }               
        else if(navigator.userAgent.indexOf('Chrome') !== -1) {
            this.client.browser = 'Chrome'; // Webkit - 2nd to last
        }         
        else if(navigator.userAgent.indexOf('Safari') !== -1) {
            this.client.browser = 'Safari'; // Webkit - LAST     
        } 
        else if(navigator.userAgent.indexOf('WebKit') !== -1) {
            this.client.browser = 'WebKit'; // Webkit - other (generic)
        } else {
            this.client.browser = 'unknown';
        }

        this.clientBrowser = this.client.browser;
        this.debug && this.log('client', this.client);

        if(this.debug) {
            // var msg = [];

            // msg.push(this.client.isMobile ? 'IS MOBILE' : 'Not mobile');
            // msg.push('Browser: ' + this.client.browser);
            // msg.push('OS: ' + this.client.os);
            // msg.push('User Agent: ' + navigator.userAgent);

            // alert(msg.join('\n'));
        }
    },
    createInstance: function(container, configs) {
        var inst = new App;

        configs = configs || this.configs;
        configs.target = container;
        inst.configs = configs;
        inst.renderInto(container);
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
        // Must be set before anything else here, the debug logging below depends on it
        // _isTrue, because some hosts (ie the WordPress plugin) serialize booleans as strings, ie 'false'
        this.configs.debug = this._isTrue(this.configs.debug);
        this.debug = this.configs.debug;

        if(this.configs.target) {
            this.renderTarget = this.configs.target;
        }

        this.configs.crossReferenceEnable = this._isTrue(this.configs.crossReferenceEnable);
        this.configs.crossReferenceShowDefault = this.normalizeCrossReferencesShow(this.configs.crossReferenceShowDefault);
        this.configs.crossReferenceFormatDefault = this.normalizeCrossReferenceFormat(this.configs.crossReferenceFormatDefault);
        this.configs.crossReferenceLinkIncludeParent = this._isTrue(this.configs.crossReferenceLinkIncludeParent);
        this.configs.crossReferenceLinkNewTab = this._isTrue(this.configs.crossReferenceLinkNewTab);
        this.configs.contextLinksAsButtons = this._isTrue(this.configs.contextLinksAsButtons);

        var view = null;
        this.initUserConfig();
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

        this.defaultBiblesByLanguage = {}; 

        if(this.configs.defaultBiblesByLanguage && typeof this.configs.defaultBiblesByLanguage == 'object') {
            for(var lang in this.configs.defaultBiblesByLanguage) {
                var def = this.configs.defaultBiblesByLanguage[lang];

                if(typeof def == 'string') {
                    this.defaultBiblesByLanguage[lang] = def.split(',');
                } else {
                    this.defaultBiblesByLanguage[lang] = def;
                }
            }
        }

        this.defaultBiblesRaw = utils.clone(this.defaultBibles);

        this.configs.parallelBibleLimitByWidthEnable = this._isTrue(this.configs.parallelBibleLimitByWidthEnable);
        this.configs.parallelBibleStartSuperceedsDefaultBibles = this._isTrue(this.configs.parallelBibleStartSuperceedsDefaultBibles);
        this.configs.parallelBibleCleanUpForce = this._isTrue(this.configs.parallelBibleCleanUpForce);

        if(
            this.configs.parallelBibleLimitByWidthEnable &&
            this.configs.parallelBibleLimitByWidth &&
            Array.isArray(this.configs.parallelBibleLimitByWidth) &&
            this.configs.parallelBibleLimitByWidth.length > 0
        ) {

            var pMax = 0,
                bMax = 1,
                bLast = 0,
                gMaxReached = false,
                hasError = false,
                hasZeroPixel = false,
                pLimit, pLim, bLim, bMin, bStart;

            for(var i = 0; i < this.configs.parallelBibleLimitByWidth.length; i++) {
                if(gMaxReached) {
                    this.log('Error: parallelBibleLimitByWidth has values past the global maximum');
                    hasError = true;
                    continue;
                }

                pLimit = this.configs.parallelBibleLimitByWidth[i];

                // Omitted values parse to NaN by design, MultiSelect inherits them from the previous breakpoint
                pLim = parseInt(pLimit.minWidth, 10);
                bLim = (pLimit.maxBibles == 'max') ? 9999 : parseInt(pLimit.maxBibles, 10);
                bMin = parseInt(pLimit.minBibles, 10);
                bStart = parseInt(pLimit.startBibles, 10);

                if(pLimit.maxBibles == 'max') {
                    gMaxReached = true;
                }

                if(bStart < bMin) {
                    this.log('Error: parallelBibleLimitByWidth: startBibles must be equal or greater than minBibles!');
                    hasError = true;
                }                

                if(bStart > bLim) {
                    this.log('Error: parallelBibleLimitByWidth: startBibles must be equal or less than maxBibles!');
                    hasError = true;
                }

                this.debug && this.log('parallel', pLimit, pLim, bLim);

                if(i == 0 && pLim == 0) {
                    hasZeroPixel = true;
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
            if(
                !this.configs.parallelBibleLimitByWidthEnable &&
                Array.isArray(this.configs.parallelBibleLimitByWidth) &&
                this.configs.parallelBibleLimitByWidth.length > 0
            ) {
                this.log('Warning: parallelBibleLimitByWidth is configured but ignored, parallelBibleLimitByWidthEnable is not set to true');
            }

            this.configs.parallelBibleLimitByWidth = false;
        }

        this.debug && this.log('parallelBibleLimitByWidth', this.configs.parallelBibleLimitByWidth);

        // Render 'Loading' view
        // Todo - set css style based on selected interface
        this.set('view', Loading);
        this.render();

        this.configs.apiUrl = this.configs.apiUrl.replace(/\/+$/, '') + '/api';
        this.configs.apiKeyStr = (this.configs.apiKey && this.configs.apiKey != '') ? '&key=' + this.configs.apiKey : '';

        if(typeof QUnit == 'object') {
            this.testInit = true;

            if(this.configs.testOnLoad) {
                this.testOnLoad = this.configs.testOnLoad;
            }        

            if(this.configs.testVerbose) {
                this.testVerbose = this.configs.testVerbose;
            }
        }

        this.detectClient();

        if(this.client.isMobile && this.configs.pageScrollTopPaddingMobile) {
            if(typeof this.configs.pageScrollTopPaddingMobile == 'string') {
                this.configs.pageScrollTopPadding = parseInt(this.configs.pageScrollTopPaddingMobile, 10);
            } else {             
                this.configs.pageScrollTopPadding = this.configs.pageScrollTopPaddingMobile;
            }
        } else {
            if(this.configs.pageScrollTopPadding) {
                if(typeof this.configs.pageScrollTopPadding == 'string') {
                    this.configs.pageScrollTopPadding = parseInt(this.configs.pageScrollTopPadding, 10);
                }
            }
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
            cacheBust: this.configs.disableCache,
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

        this.initUserConfigEvents();
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
    _isTrue: function(value) {
        // An empty string is falsey here, some hosts (ie the WordPress plugin) serialize an unchecked option as ''
        return !(value === false || value === 'false' || value === 0 || value === '0' || value === '' || value === null || typeof value == 'undefined');
    },
    normalizeCrossReferencesShow: function(value) {
        if(value != 'hidden' && value != 'show' && value != 'toggle') {
            return 'toggle';
        }

        return value;
    },
    normalizeCrossReferenceFormat: function(value) {
        if(value != 'compact' && value != 'auto' && value != 'expand') {
            return 'auto';
        }

        return value;
    },
    crossReferencesEnabled: function() {
        if(!this._isTrue(this.configs.crossReferenceEnable)) {
            return false;
        }

        var staticsEnabled = this.statics && this.statics.access && this._isTrue(this.statics.access.cross_references);
        return !!staticsEnabled;
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
        this.set('statics', statics);
        this.processBiblesDisplayed();

        if(!this.statics.access || typeof this.statics.access != 'object') {
            this.statics.access = {};
        }

        if(this.statics.features_enabled && typeof this.statics.features_enabled.cross_references != 'undefined') {
            this.statics.access.cross_references = this._isTrue(this.statics.features_enabled.cross_references);
        }

        if(!statics.download_enabled) {
            defaultConfig._downloadDisabledNotice();
        }

        if(!statics.audio_enabled && this.configs.audioBible && this.configs.audioBibleApi == 'biblesupersearch') {
            var msg  = 'CONFIG ERROR: Audio Bible is enabled with\n';
                msg += '"biblesupersearch" as the "audioBibleApi",\n'; 
                msg += 'however, the current Bible SuperSearch API\ndoes NOT support audio Bible ...\n\n';
                msg += 'Audio Bible has been disabled ...';
            
            alert(msg);
            this.configs.audioBible = false;
        }

        //this.localeBibleBooks.en = statics.books; // prepopulate the English book list

        var localeData = {}; // empty like my mind

        // Init some statics / English language items
        this._initLocaleShortcuts('en', localeData);
        this._initLocaleBibleBooks('en', localeData, statics.books, 'statics');
        statics.books = this.localeBibleBooks.en;
        statics.shortcuts = localeData.shortcuts;

        var uLocale = this.UserConfig.get('locale');
        uLocale && this.set('locale', uLocale);

        this.waterfall('onStaticsLoaded');

        window.console && console.log('BibleSuperSearch API version', this.statics.version);

        this.configs.apiUrl == defaultConfig.apiUrl + '/api' ? defaultConfig._urlDefaultNotice() : defaultConfig._urlLocalNotice();

        if(view && view != null) {
            this.set('view', view);
            this.set('viewCache', view);
        }

        for(i in this.accessible) {
            var a = this.accessible[i];

            if(typeof this.statics.access[a] == 'undefined') {
                this.statics.access[a] = false;
            }
        }
        
        this.render();
    },
    _handleAppLoaded: function() {
        if(this.appLoaded) {
            return;
        }
        
        this.appLoaded = true;
        this.$.Router.trigger();

        this.debug && this.log('Sending onAppLoaded');
        this.waterfall('onAppLoaded');

        if(this.configs.query_string) {
            this.handleHashGeneric(this.configs.query_string);
        }

        if(this.testInit) {
            this.initTests();
        }

        if(this.testOnLoad) {
            this.test();
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
                bible.lang = bible.lang ? t.utils.ucfirst(bible.lang) : null;
                bible.lang_native = bible.lang_native ? t.utils.ucfirst(bible.lang_native) : null;
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
        if(this.testing) {
            this.log('Tests aready ran, aborting.');
            return;
        }

        this.testing = true;
        QUnit.start();
    },

    initTests: function() {

        if(typeof QUnit == 'undefined') {
            this.log('QUnit not defined, aborting.');
            return;
        }

        var t = this;

        QUnit.module("Basic Tests", function() {
            QUnit.test( "Post Rendering", function( assert ) {
                assert.ok( t.viewReady, "The view should be rendered by the time we get here" );
            });
        });

        QUnit.module('Localization Test', function() {
            QUnit.test.each('Translation Test', t.localeDatasetsRaw, function(assert, item) {

                if(typeof item.meta == 'undefined' || item.meta.code == '') {
                    assert.expect(0)
                    return;
                }

                assert.ok(item.meta.code, 'meta.code should be truthy');
                assert.ok(item.meta.name, 'meta.name should be truthy');
                assert.ok(item.meta.nameEn, 'meta.nameEn should be truthy');

                if(item.meta.code == 'en') {
                    return; // most strings for EN not defined ... 
                }

                if(item.meta.incomplete) {
                    return; // skip incomplete locales
                }

                var ll = item.meta.code.toUpperCase() + ' ' + item.meta.nameEn;

                var bookNameNoMatchEn = 0;

                Passage.setApp(t);

                // Build a lightweight book list for this locale so isPassage can resolve books
                // by name via findBookByName.  We do this manually rather than calling
                // _initLocaleBibleBooks because that method fires signals and updates userConfig
                // (not appropriate during tests).
                // NOTE: _fmtBookNameMatch ignores its locale parameter and reads this.get('locale')
                // instead, so t.locale must be set to the target locale BEFORE building the list.
                var localeCode = item.meta.code;
                var savedLocale = t.locale;
                var hadBookList = !!t.localeBibleBooks[localeCode];

                // Swap in the target locale + a temporary book list, and ALWAYS restore them
                // in the finally below - otherwise a throw mid-loop would leave t.locale
                // pinned and leak the temp list, corrupting every subsequent locale iteration.
                try {
                t.locale = localeCode;

                if(!hadBookList) {
                    var tempBooks = [];
                    for(var bi = 0; bi < item.bibleBooks.length; bi++) {
                        var bdata = item.bibleBooks[bi];
                        var tempBook = {
                            id:        bdata.id,
                            name:      bdata.name,
                            shortname: bdata.shortname,
                            chapters:  bdata.chapters || null,
                            fn: t._fmtBookNameMatch(bdata.name, localeCode),
                            sn: t._fmtBookNameMatch(bdata.shortname, localeCode)
                        };
                        if(Array.isArray(bdata.matching)) {
                            tempBook.matching = [];
                            for(var tmi = 0; tmi < bdata.matching.length; tmi++) {
                                tempBook.matching.push(t._fmtBookNameMatch(bdata.matching[tmi], localeCode));
                            }
                        }
                        tempBooks.push(tempBook);
                    }
                    t.localeBibleBooks[localeCode] = tempBooks;
                }

                // Check Bible Books
                for(b in t.localeDatasetsRaw._template.bibleBooks) {
                    var bookNameEn = t.localeDatasetsRaw._template.bibleBooks[b].name;

                    if(item.bibleBooks[b] && item.bibleBooks[b].name != bookNameEn) {
                        bookNameNoMatchEn ++;
                    }

                    if(item.bibleBooks[b] && item.bibleBooks[b].name) {
                        var bookName = item.bibleBooks[b].name;
                        var testRef = bookName + ' 1';
                        assert.true(Passage.isPassage(testRef), ll + ' Passage.isPassage should be true for "' + testRef + '"');

                        // isPassage above passes trivially for any "<name> 1" (it contains a
                        // digit), so also assert the localized name actually RESOLVES to a book.
                        // This is what genuinely exercises the locale book list built above.
                        assert.ok(t.findBookByName(bookName), ll + ' findBookByName should resolve "' + bookName + '"');

                        // Also test matching (alternative user-typed) names.
                        if(item.bibleBooks[b].matching && item.bibleBooks[b].matching.length) {
                            for(var mi = 0; mi < item.bibleBooks[b].matching.length; mi++) {
                                var matchName = item.bibleBooks[b].matching[mi];
                                var matchRef = matchName + ' 1';
                                assert.true(Passage.isPassage(matchRef), ll + ' Passage.isPassage should be true for matching "' + matchRef + '"');
                                assert.ok(t.findBookByName(matchName), ll + ' findBookByName should resolve matching "' + matchName + '"');
                            }
                        }
                    }

                    if(!t.testVerbose && item.bibleBooks[b] && item.bibleBooks[b].name) {
                        continue; // non verbose skip
                    }

                    assert.ok(item.bibleBooks[b], 'Must have Bible book: ' + bookNameEn);
                    assert.ok(item.bibleBooks[b].name, 'Book name must not be empty');
                }

                }
                finally {
                    t.locale = savedLocale;
                    if(!hadBookList) {
                        delete t.localeBibleBooks[localeCode];
                    }
                }

                // We check book names against English ones, at least ONE must not match
                // Probably not the best way
                assert.notEqual(bookNameNoMatchEn, 0, 'Book names must not be in English - at least some should NOT match.');

                for(f in t.localeDatasetsRaw._template) {
                    if(f == 'meta' || f == 'bibleBooks') {
                        continue;
                    }

                    var en = t.localeDatasetsRaw._template[f];
                    var ff = ' ' + ll + ' "' + f + '"';

                    if(!t.testVerbose && typeof item[f] != 'undefined' && item[f] && item[f] != '' && item[f] != en) {
                        continue; // non verbose skip
                    }

                    assert.notEqual(typeof item[f], 'undefined', 'Must NOT be undefined' + ff);
                    assert.ok(item[f], 'Must be truthy' + ff);
                    assert.notEqual(item[f], '', 'Must NOT be an empty string' + ff);
                    assert.notEqual(item[f], en, 'Should NOT match English string');
                }
            });

            QUnit.test.each('Inverse Translation Test', t.localeDatasetsRaw, function(assert, item) {
                if(typeof item.meta == 'undefined' || item.meta.code == '') {
                    assert.expect(0)
                    return;
                }

                var code = item.meta.code;
                var ll = code.toUpperCase() + ' ' + item.meta.nameEn;
                assert.true(true);

                for(f in item) {

                    if(f == 'shortcuts' || f == 'bibleBooksSource') {
                        continue; // Array, skipping
                    }

                    if(t.findBookByName(f, 'en')) {
                        continue; // Book name, skipping
                    }

                    if(!t.testVerbose && typeof t.localeDatasetsRaw._template[f] != 'undefined') {
                        continue; // Until I figure out how to assert quietly for passing assertions, skipping items that will pass
                    }

                    var ff = ' ' + ll + ' "' + f + '"';
                    assert.notEqual(typeof t.localeDatasetsRaw._template[f], 'undefined', 'Item defined in locale should NOT be undefined in template' + ff);
                }
            });
        });



        // Test form stuff

        // Test AJAX calls

    },
    handleHashGeneric: function(hash) {
        if(!this.appLoaded) {
            return;
        }

        this.loadingPagePrevent = false;

        if(hash && hash != '') {
            this.debug && this.log('hash', hash);

            hash = decodeURI(hash);
            hash = hash.replace(/\./g, ' ');
            var parts = hash.split('/');
            var mode  = parts.shift();

            if(mode == '') {
                var mode = parts.shift();
            }

            switch(mode) {
                case 'c':   // Cache uuid (hash) 
                    this.loadingPagePrevent = true;
                    return this._hashCache(parts);
                    break;
                case 'cr':   // Cross reference
                    this.loadingPagePrevent = true;
                    // BSS-158: A cross reference link is a brand new lookup, so it must scroll the
                    // same way the navigation buttons do - to the top of the Bible text, not to the
                    // top of the site.  Without this, the initial 'container_top' mode (which exists
                    // only for the no-hash landing page) sticks, sending the cross reference - in a
                    // new tab, or in this window after a hash-loaded page - to the very top.
                    this.resetScrollMode();
                    return this._hashReference(parts, true);
                    break;
                case 'p':   // Passage
                    this.loadingPagePrevent = true;
                    return this._hashPassage(parts);
                    break;                   
                case 'r':   // Reference string
                    this.loadingPagePrevent = true;
                    return this._hashReference(parts);
                    break;                
                case 'q':   // Request string
                    this.loadingPagePrevent = true;
                    return this._hashRequest(parts);
                    break;
                case 's':   // Search string
                    this.loadingPagePrevent = true;
                    return this._hashSearch(parts);
                    break;                      
                case 'sl':   // Link to passage within search results list
                    this.loadingPagePrevent = true;
                    return this._hashSearchLink(parts);
                    break;                
                case 'context': // Contextual lookup
                    this.loadingPagePrevent = true;
                    return this._hashContext(parts);
                    break;
                case 'strongs': // Strongs lookup
                    this.loadingPagePrevent = true;
                    return this._hashSearch(parts);
                    break;
                case 'f': // JSON-endoded form data
                    this.loadingPagePrevent = true;    
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
        this.debug && this.log();
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
            // Stored form data may be corrupt or tampered with - fall back to defaults on
            // a parse failure rather than throwing out of init (per the localStorage rule).
            try {
                var formData = JSON.parse(formDataJson);
            }
            catch(e) {
                this.debug && this.log('ignoring invalid stored form data');
                localStorage.removeItem('BibleSuperSearchFormData');
                return;
            }
        }

        if(formData.redirected) {
            this.preventRedirect = true;  // prevent further redirection if we were redirected here
        }

        localStorage.removeItem('BibleSuperSearchFormData');
        this.debug && this.log('sending onHashRunForm');
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
        this.debug && this.log('sending onHashRunForm');
        this.waterfall('onHashRunForm', {formData: formData, newTab: 'auto'});
    },    
    _hashSearchLink: function(parts) {
        var uuid = parts.shift();
        // var page = parts.shift();
        var partsObj = this._explodeHashPassage(parts);
        var formData = this._assembleHashPassage(partsObj);
        formData.results_list_cache_id = uuid;
        // formData.results_list_page = page;
        // this.set('resultsListPage', page);
        this.debug && this.log('sending onHashRunForm');
        this.waterfall('onHashRunForm', {formData: formData, newTab: 'auto'});
    },    
    _hashStrongs: function(parts) {
        var strongsNum = parts[0] || null;
        var formData = { search: strongsNum };
        this.debug && this.log('sending onHashRunForm');
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
        this.debug && this.log('sending onHashRunForm');
        this.waterfall('onHashRunForm', {formData: formData, newTab: true});
    },    
    _hashReference: function(parts, isCrossReference) {
        var partsObj = this._explodeHashPassage(parts);

        partsObj.chap  = null;
        partsObj.verse = null;

        var formData = this._assembleHashPassage(partsObj);
        this.debug && this.log('sending onHashRunForm');
        this.waterfall('onHashRunForm', {formData: formData, newTab: true, crossReference: !!isCrossReference});
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

        this.debug && this.log('sending onHashRunForm');
        this.waterfall('onHashRunForm', {formData: formData, newTab: true});
    },
    _hashForm: function(parts) {
        var formData = {};

        // parts[0] comes straight from the URL hash (attacker-controllable). Don't let
        // malformed JSON throw out of the route handler - just ignore an invalid payload.
        if(parts[0]) {
            try {
                formData = JSON.parse(parts[0]);
            }
            catch(e) {
                this.debug && this.log('ignoring invalid hash form data');
                return;
            }
        }

        this.debug && this.log('sending onHashRunForm');
        this.waterfall('onHashRunForm', {formData: formData, newTab: true});
    },
    runFormData: function(formData) {
        this.debug && this.log('sending onHashRunForm');
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

        // A form may opt to prefer its reference field (and book/chapter/verse selector)
        // over the combined request field when populating a passage from the URL hash.
        var useRequestField = this.formHasField('request') && !(this.formPrefersReferenceField() && this.formHasField('reference'));

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
    formPrefersReferenceField: function() {
        if(this.view && this.view.formPrefersReferenceField) {
            return this.view.formPrefersReferenceField();
        }

        return false;
    },
    getFormFieldValue: function(fieldName) {
        if(this.view && this.view.getFormFieldValue) {
            return this.view.getFormFieldValue(fieldName);
        }

        return false;
    },
    getActiveForm: function() {
        return (this.view && this.view.getActiveForm) ? this.view.getActiveForm() : null;
    },

    getFormSearch: function() {
        if(this.formHasField('search')) {
            return this.getFormFieldValue('search');
        } else if(this.formHasField('request')) {
            return this.getFormFieldValue('request');
        }

        return false;
    },
    getFormReference: function() {
        if(this.formHasField('reference')) {
            return this.getFormFieldValue('reference') || null;
        } else if(this.formHasField('request')) {
            var req = this.getFormFieldValue('request') || null;
            return Passage.isPassage(req) ? req : null;
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
    getSelectedBibles: function(filter) {
        var bibles = this.getFormFieldValue('bible');
        filter = (typeof filter == 'undefined') ? false : filter;

        if(!bibles || bibles.length == 0 || bibles.length == 1 && bibles[0] == null) {
            bibles = this.configs.defaultBible;
        }

        if(!Array.isArray(bibles)) {
            bibles = bibles.split(',');
        }

        if(filter) {
            bibles = bibles.filter(function(b) {
                return b != 0 && b != null;
            });
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
    getLocaleBookName: function(id, fallbackName, useShortname, locale) {

        if(this.configs.bibleBooksLanguageSource == 'bible') {
            this.log('bible source, using fallbackName');
            return fallbackName;
        }

        // :todo: make this a config??
        // Option 1: Display book names in language selected in UI (Reccomended)
        // Option 2: Display book names in language of First selected Bible (Legacy - not fully implemented)

        locale = locale || this.get('locale');

        if(typeof this.localeDatasets[locale] == 'undefined') {
            // Quick hack to get this working on WordPress for English
            if(locale == 'en') {
                var book = this.localeBibleBooks.en[id - 1];

                if(book && useShortname) {
                    if(useShortname == 'strict') {
                        return book.shortname || fallbackName;
                    }

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
            if(useShortname == 'strict') {
                return book.shortname || fallbackName;
            }

            return book.shortname || book.name;
        }

        return book ? book.name : fallbackName;
    },
    getShortcut: function(reference) {
        var shortcut = null;
        var locale = this.get('locale');

        reference = this.standardizeReferences(reference, true);

        if(this.localeDatasets[locale] && this.localeDatasets[locale].shortcuts) {
            shortcut = this.localeDatasets[locale].shortcuts.find(function(item) {
                return item.reference == reference;
            });
        } 
        
        if(!shortcut) {
            shortcut = this.statics.shortcuts.find(function(item) {
                return item.reference == reference;
            });
        }
            
        return shortcut;
    },
    standardizeReferences: function(ref, localeName) {
        var passages = Passage.explodeReferences(ref, true);

        if(passages.length == 0 || !ref) {
            return ref;
        }

        var referenceNew = [];

        passages.forEach(function(raw) {
            item = Passage.parseBook(raw);

            if(item.isBookRange) {
                var bookSt = this.findBookByName(item.bookSt);
                var bookEn = this.findBookByName(item.bookEn);

                if(localeName && bookSt && bookEn) {
                    var bookNameSt = this.getLocaleBookName(bookSt.id, bookSt.name, false, 'en');
                    var bookNameEn = this.getLocaleBookName(bookEn.id, bookEn.name, false, 'en');
                } else {
                    var bookNameSt = bookSt ? bookSt.id + 'B' : item.bookSt;
                    var bookNameEn = bookEn ? bookEn.id + 'B' : item.bookEn;
                }
                
                var ref = bookNameSt + ' - ' + bookNameEn + ' ' + item.chapter_verse;
            } else {
                var book = this.findBookByName(item.book);

                if(localeName && book) {
                    var bookName = this.getLocaleBookName(book.id, book.name, false, 'en');
                } else {
                    var bookName = book ? book.id + 'B' : item.book;
                }
                
                var ref = bookName + ' ' + item.chapter_verse;
            }

            referenceNew.push(ref.trim());
        }, this);

        return referenceNew.join('; ');
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
    // BSS-266: Parse a Bible's `book_list` string into a map {bookId: true}.
    // Tokens: 'entire' => 1..66, 'ot' => 1..39, 'nt' => 40..66, numeric => that book id.
    // A null/blank list is treated as 'entire' (backward compatible with older APIs).
    parseBookList: function(bookList) {
        var books = {};
        var i;

        if(bookList == null || bookList === '' || typeof bookList == 'undefined') {
            return this._allBookIds();
        }

        var tokens = ('' + bookList).split(',');
        var any = false;

        for(var t = 0; t < tokens.length; t++) {
            var token = tokens[t].replace(/^\s+|\s+$/g, '');

            if(token === '') {
                continue;
            }

            if(token == 'entire') {
                for(i = 1; i <= 66; i++) { books[i] = true; }
                any = true;
            } else if(token == 'ot') {
                for(i = 1; i <= 39; i++) { books[i] = true; }
                any = true;
            } else if(token == 'nt') {
                for(i = 40; i <= 66; i++) { books[i] = true; }
                any = true;
            } else {
                var id = parseInt(token, 10);

                if(!isNaN(id) && id >= 1 && id <= 66) {
                    books[id] = true;
                    any = true;
                }
            }
        }

        // BSS-266: a non-blank but unparseable book_list must not hide every book;
        // fail open to all 66, matching the null/blank case.
        return any ? books : this._allBookIds();
    },
    // BSS-266: map {1..66: true} of every book id.
    _allBookIds: function() {
        var books = {};

        for(var i = 1; i <= 66; i++) {
            books[i] = true;
        }

        return books;
    },
    // BSS-266: Book-id map for a single Bible module, memoized per module.
    // Returns null when the module is not present in statics (availability unknown),
    // as opposed to a loaded module with a null/blank book_list (all 66, backward compatible).
    getBibleBookIds: function(module) {
        var bibles = this.statics.bibles;

        if(!bibles || !bibles[module]) {
            return null;
        }

        if(!this._bibleBookIdsCache) {
            this._bibleBookIdsCache = {};
        }

        if(this._bibleBookIdsCache[module]) {
            return this._bibleBookIdsCache[module];
        }

        var books = this.parseBookList(bibles[module].book_list);

        this._bibleBookIdsCache[module] = books;

        return books;
    },
    // BSS-266: Normalize a Bible selection into an array of module strings. The bible-change
    // event may deliver a bare string (single selection) or a comma-joined list rather than an array.
    _normalizeBibleList: function(bibles) {
        if(bibles == null) {
            return [];
        }

        if(Array.isArray(bibles)) {
            return bibles;
        }

        var modules = ('' + bibles).split(',');

        for(var i = 0; i < modules.length; i++) {
            modules[i] = modules[i].replace(/^\s+|\s+$/g, '');
        }

        return modules;
    },
    // BSS-266: Union of available books across the given Bible modules.
    // Returns null when no Bibles are given, or when any selected module's availability is
    // unknown (meaning: no safe filtering, show all books).
    getAvailableBookIds: function(bibles) {
        bibles = this._normalizeBibleList(bibles);

        if(!bibles.length) {
            return null;
        }

        var available = {};
        var any = false;

        for(var i = 0; i < bibles.length; i++) {
            var module = bibles[i];

            if(!module || module == '0') {
                continue;
            }

            var books = this.getBibleBookIds(module);

            // A selected module whose books we can't determine -> can't safely hide anything.
            if(!books) {
                return null;
            }

            for(var id in books) {
                available[id] = true;
            }

            any = true;
        }

        return any ? available : null;
    },
    // BSS-266: Whether a book id is available in the currently selected Bible(s).
    // Returns true when there is no active availability set (feature off / no selection).
    isBookAvailable: function(bookId) {
        if(!this._availableBookIds) {
            return true;
        }

        return !!this._availableBookIds[bookId];
    },
    // BSS-266: Whether the hide-unavailable-books feature is enabled via config.
    hideUnavailableBooksEnabled: function() {
        var c = this.configs.hideUnavailableBooks;

        // BSS-266: disable on any of the falsy/false-ish conventions used elsewhere for config flags
        // (false, 'false', 0, '0', '', null, undefined).
        return !!(c && c !== 'false' && c !== '0');
    },
    // BSS-266: Whether a book should be shown in the book selectors / autocomplete.
    bookShowingInSelectors: function(bookId) {
        if(!this.hideUnavailableBooksEnabled()) {
            return true;
        }

        return this.isBookAvailable(bookId);
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
        // BSS-266: statics (Bibles) reloaded, drop parsed book_list cache and recompute the
        // available-book set for the current selection so filtering never runs against stale data.
        this._bibleBookIdsCache = null;
        this._availableBookIds = this.getAvailableBookIds(this._selectedBibles);

        // BSS-266: statics can reload without a following bible/locale change, so proactively tell
        // the book selectors to rebuild their (filtered) option lists. Otherwise the always-live
        // reference autocomplete and the pre-rendered dropdowns would show different book sets.
        Signal.send('onAvailableBooksChange');
        this.waterfall('onAvailableBooksChange');

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
    getDefaultBibles: function() {
        if(
            this.configs.saveUserSettings && this.configs.saveUserSettings != 'false' &&
            this.configs.saveUserBibleSelections && this.configs.saveUserBibleSelections != 'false'
        ) {
            var userBibles = this.UserConfig.get('bibles_selected') || null;
            this.debug && this.log('User config bibles', userBibles);

            if(userBibles && Array.isArray(userBibles) && userBibles.length > 0) {
                this.debug && this.log('Using user config selected bibles', userBibles);
                return utils.clone(userBibles);
            }
        }

        return this.getSystemDefaultBibles();
    },
    getSystemDefaultBibles: function() {
        this.debug && this.log('Using system default bibles');
        var locale = this.get('locale');

        if(this.defaultBiblesByLanguage && this.defaultBiblesByLanguage[locale]) {
            return utils.clone(this.defaultBiblesByLanguage[locale]);
        } else {
            return utils.clone(this.defaultBibles);
        }
    },
    getLocaleLanguage: function() {
        return this.get('locale').split('_')[0];
    },
    localeChanged: function(was, is) {
        var defaultLocale = this.defaultLocale || 'en';
        var locale = is || defaultLocale;

        var fallbackLocale = this.getLocaleLanguage(locale);
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
        var fallbackLocale = language = this.getLocaleLanguage(locale);
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

        this.debug && this.log('locale', locale);

        this._initLocaleShortcuts(locale, localeData);
        
        if(found && locale != defaultLocale) {
            if(localeData.bibleBooks && localeData.bibleBooks.length >= 66) {
                this._initLocaleBibleBooks(locale, localeData, localeData.bibleBooks, 'locale');
                return;
            }

            // Load Bible book list
            var ajax = new Ajax({
                url: this.configs.apiUrl + '/books?language=' + language + this.configs.apiKeyStr,
                cacheBust: this.configs.disableCache,
                method: 'GET'
            });

            var ajaxData = {};
            ajax.go(ajaxData);
            ajax.response(this, function(inSender, inResponse) {
                this._initLocaleBibleBooks(locale, localeData, inResponse.results, 'api');
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

            if(locale == 'en') {
                // For English, merge data from API with static local book data
                book.name = Locales.en.bibleBooks[key].name || book.name;
                book.shortname = Locales.en.bibleBooks[key].shortname || book.shortname;
                book.matching = Locales.en.bibleBooks[key].matching || null;
            }

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
    _initLocaleShortcuts: function(locale, localeData) {
        if(localeData.shortcuts || locale == 'en') {
            // return;
        }

        var shortcuts = Locales.en.shortcuts;
        localeData.shortcuts = [];

        for(i in shortcuts) {
            var sc = utils.clone(shortcuts[i]),
                name = localeData[sc.name] || sc.name,
                short1 = localeData[sc.short1] || sc.short1;

            localeData.shortcuts.push({
                id: sc.id,
                name: name,
                short1: short1,
                // short2: this.t(sc.short2 || null),
                // short3: this.t(sc.short3 || null),
                reference: sc.reference, // will translate elsewhere
                fn: this._fmtBookNameMatch( name, locale ),
                sn1: this._fmtBookNameMatch( short1, locale ),
                display: sc.display
            });
        }

        this.debug && this.log('locale shortcuts', locale, localeData.shortcuts);
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

        // Normalize dashes to hyphens
        fmt = Passage.normalizeDashes(fmt);

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

        return fmt.trim();
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

        this.userConfigChanged();
    },
    // Sends signal into app
    s: function(onSignal, onEvent) {
        Signal.send(onSignal, onEvent);
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
            // var b = t.findBookByName(match, 'en');
            // return b ? b.name : match;
            
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
    // Material Icons ligature for a context link label, or null if the label
    // has no icon or contextLinksAsButtons is disabled
    contextLinkIcon: function(string) {
        if(!this.configs.contextLinksAsButtons) {
            return null;
        }

        var map = {
            'Context': 'menu_open',
            'Chapter': 'expand', // = 'arrow_expand_vertical',
            'Copy': 'content_copy',
            'Share': 'share',
            'Cross References': 'article',
            "Listen": 'volume_up',
            'Statistics': 'bar_chart',
            'Add to List': 'playlist_add',
        };

        return map[string] || null;
    },
    findBookByName: function(bookName, locale) {
        this.debug && this.log(bookName, locale);
        
        locale = locale || this.get('locale');
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
    findShortcutByName: function(reference) {
        var locale = this.get('locale'),
            Shortcuts = this.localeDatasets[locale] ? this.localeDatasets[locale].shortcuts : this.statics.shortcuts,
            sc = null,
            refFmt = this._fmtBookNameMatch(reference, locale);

        sc = Shortcuts.find(function(s) {
            return s.fn == refFmt || s.sn1 == refFmt;
        });

        // this.log(sc, locale, refFmt, reference, Shortcuts, this.localeDatasets[locale]);
        return sc ? this.vt(sc.reference) : reference;
    },
    pushHistory: function() {
        var title = this.get('bssTitle'),
            url = document.location.href,
            limit = this.configs.historyLimit || 50,
            isBaseUrl = (url == this.baseUrl || url == this.baseUrl + '/' || url == ''),
            check = this.history.length > 0 ? false : true;

        url = this.getRelativeUrl(url);
        isBaseUrl = (url == '') ? true : isBaseUrl;

        // If the URL is the base URL, we ignore the title and check against the URL
        if(!check) {            
            check = isBaseUrl ? this.history[0].url != url : this.history[0].title != title;
        }

        this.cleanHistory(); // clean history before adding new item
        // todo - v 6.2, remove this check
 
        if(title && (check)) {
            this.history = this.history.filter(function(item) {
                return item.title != title && item.url != url;
            });

            this.history.unshift({title: title, url: url});

            if(this.history.length > limit) {
                this.history = this.history.slice(0, limit);
            }

            localStorage.setItem('BibleSuperSearchHistory', JSON.stringify(this.history));
        }
    },
    cleanHistory: function() {
        if(this.history.length == 0) {
            return; // nothing to clean
        }
        
        var tracked = {},
            self = this;
        
        this.history = this.history.filter(function(item) {
            var url = self.getRelativeUrl(item.url);
            var isBaseUrl = (item.url == self.baseUrl || item.url == self.baseUrl + '/' || url == '');
            var track = isBaseUrl ? url : item.title;

            if(tracked[track]) {
                return false; // already tracked, remove this item
            }
            
            tracked[track] = true; // track this item
            return true;
        });

        localStorage.setItem('BibleSuperSearchHistory', JSON.stringify(this.history));
    },
    clearHistory: function() {
        this.history = [];
        localStorage.setItem('BibleSuperSearchHistory', '[]');
    },    
    handleSessionVerseListAdd: function(inSender, inEvent) {
        this.addSessionVerseListItem(inEvent);
    },
    addSessionVerseListItem: function(item) {
        if(!item || !item.b || !item.cv) {
            return false;
        }

        var bookId = parseInt(item.b, 10);

        if(!bookId) {
            return false;
        }

        // Confirm add if passage already exists in list
        var exists = this.sessionVerseList.find(function(v) {
            return v.b == bookId && v.cv == item.cv && v.cva == (item.cva || null);
        });

        if(exists) {    
            // this.confirm('Add duplicate verse?', function(confirmed) {
            //     if(confirmed) {
            //         t.sessionVerseList.push({    
            //             b: bookId,
            //             cv: item.cv,
            //             cva: item.cva || null
            //         });
            //     }

            //     t.saveSessionVerseList();
            //     Signal.send('onSessionVerseListChanged');
            // });
            
            if(!confirm(this.t('Add duplicate verse?'))) {
                return false;
            }   
        }

        this.sessionVerseList.push({
            b: bookId,
            cv: item.cv,
            cva: item.cva || null
        });

        this.saveSessionVerseList();
        Signal.send('onSessionVerseListChanged');
        return true;
    },
    deleteSessionVerseListItem: function(index) {
        index = parseInt(index, 10);

        if(index < 0 || index >= this.sessionVerseList.length) {
            return false;
        }

        this.sessionVerseList.splice(index, 1);
        this.saveSessionVerseList();
        Signal.send('onSessionVerseListChanged');
        return true;
    },
    moveSessionVerseListItem: function(fromIndex, toIndex) {
        fromIndex = parseInt(fromIndex, 10);
        toIndex = parseInt(toIndex, 10);

        if(
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= this.sessionVerseList.length ||
            toIndex >= this.sessionVerseList.length ||
            fromIndex == toIndex
        ) {
            return false;
        }

        var item = this.sessionVerseList.splice(fromIndex, 1);
        this.sessionVerseList.splice(toIndex, 0, item[0]);
        this.saveSessionVerseList();
        Signal.send('onSessionVerseListChanged');
        return true;
    },
    clearSessionVerseList: function() {
        this.sessionVerseList = [];
        localStorage.setItem(this.sessionVerseListStorageKey, '[]');
        Signal.send('onSessionVerseListChanged');
    },
    saveSessionVerseList: function() {
        localStorage.setItem(this.sessionVerseListStorageKey, JSON.stringify(this.sessionVerseList));
    },
    getSessionVerseListReference: function() {
        var references = [];

        this.sessionVerseList.forEach(function(item) {
            var cv = item.cva || item.cv;
            var bookId = parseInt(item.b, 10);

            if(!bookId || !cv) {
                return;
            }

            var bookName = this.getLocaleBookName(bookId, bookId + 'B');
            references.push(bookName + ' ' + cv);
        }, this);

        return references.join('; ');
    },
    showSessionVerseList: function() {
        var reference = this.getSessionVerseListReference();

        if(!reference) {
            this.alert(this.t('Verse list empty.'));
            return false;
        }

        var useRequestField = this.formHasField('request');
        var formData = {
            bible: this.getSelectedBibles(true)
        };

        if(useRequestField) {
            formData.request = reference;
        }
        else {
            formData.reference = reference;
        }

        this.runFormData(formData);
        return true;
    },
    pushVisited: function(url) {
        var url = url || document.location.href,
            self = this;
            url = this.getRelativeUrl(url);

        var found = this.visited.find(function(item) {
            return self.getRelativeUrl(item) == url;
        });

        if(!found) {
            this.visited.push(url);
            localStorage.setItem('BibleSuperSearchVisited', JSON.stringify(this.visited));
        }
    },
    remVisited: function(url) {
        var url = url || document.location.href;
            // found = this.visited.find(item => item == url);

        var found = this.visited.find(function(item) {
            return item == url;
        });

        if(found) {
            this.visited = this.visited.filter(function(item) {
                return item != url;
            });

            localStorage.setItem('BibleSuperSearchVisited', JSON.stringify(this.visited));
        }
    },
    clearVisited: function() {
        this.visited = [];
        localStorage.setItem('BibleSuperSearchVisited', '[]');
        Signal.send('onVisitedClear');
    },
    getRelativeUrl: function(url) {
        if(!url || url == '' || url == this.baseUrl || url == this.baseUrl + '/') {
            return '';
        }

        if(url.indexOf('#') === -1 && url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
            return url; // already relative
        }

        var parts = url.split('#');

        url = parts[1] || '';
        return url.trim();
    },   
    getAbsoluteUrl: function(url) {        
        if(!url || url == '' || url == this.baseUrl || url == this.baseUrl + '/') {
            return this.baseUrl;
        }   

        // Only treat a value as already-absolute when it points back at our own base URL.
        // History entries come from localStorage and could be tampered with; any other
        // absolute (external) or unexpected-scheme URL is rebuilt below as a same-origin
        // fragment link so a poisoned entry can't become an external/javascript: href.
        if(url.indexOf(this.baseUrl) === 0) {
            return url; // already absolute, same origin
        }

        return this.baseUrl + '#' + this.getRelativeUrl(url);
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
        var tstr = this.t(string);

        Signal.send('onConfirm', {message: tstr, callback: callback});

        // var confirm = window.confirm(tstr);
        // callback && callback(confirm);
    },
    alertPrompt: function(string, callback) {
        var tstr = this.t(string);

        Signal.send('onPromptAlert', {message: tstr, callback: callback});
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
        var renderStyle = this.UserConfig.get('render_style');

        this._checkRenderStyle(); // always check render style when responseData changes
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

        var renderStyle = this.UserConfig.get('render_style');
        var passages = this.UserConfig.get('passages') || false;

        if(renderStyle == 'verse') {
            passages = false;

            var responseDataNew = utils.clone(this.get('responseData'));

            if(responseDataNew.results) {                
                responseDataNew.results = utils.clone(responseDataNew.results);

                responseDataNew.results.results 
                    = this.responseCollection.toVerses( utils.clone(responseDataNew.results.results, passages) );
            } else {
                return false;
            }
        }
        else if(renderStyle == 'verse_passage') {
            var responseDataNew = utils.clone(this.get('responseData'));
            
            if(responseDataNew.results) {   
                responseDataNew.results = utils.clone(responseDataNew.results);

                responseDataNew.results.results 
                    = this.responseCollection.toMultiversePassages( utils.clone(responseDataNew.results.results) );
            } else {
                return false;
            }
        }
        else {
            var responseDataNew = utils.clone( this.get('responseData') );
        }

        this.waterfall('onFormResponseSuccess', responseDataNew);
        Signal.send('onFormResponseSuccess', responseDataNew);
        this.set('responseDataNew', responseDataNew);
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
        // if(share) {
        //     var promise = navigator.share({
        //         text: shareContent,
        //         title: document.title,
        //         url: window.location.href
        //     });

        //     promise.then(utils.bind(this, function() {
        //         this.debug && this.log('Successful share');
        //     }), 
        //     utils.bind(this, function() {
        //         this.debug && this.log('Failed to share');
        //     }));

        //     promise.catch(utils.bind(this, function(error) {
        //         this.debug && this.log('Failed to share');
        //     }));
            
        //     return;
        // }

        // This code for selection all text in a HTML element was migrated from Bible SuperSearch version 3.0
        // This works, but there is probably a better way
        if (document.selection) {   // IE
            var div = document.body.createTextRange(); // IE only?
            div.moveToElementText(n);
            div.select();
        } else {                    // All others
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
            this.debug && this.log('Copy using clipboard API');

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
            
            if(!document.execCommand) {
                this.alert('Unable to copy, please use HTTPS or copy manually.');
                return;
            }
            
            this.debug && this.log('Copy using document.execCommand(copy)');

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
    clearSelection: function() {
        var sel = window.getSelection ? window.getSelection() : document.selection;

        if (sel) {
            if (sel.removeAllRanges) {
                sel.removeAllRanges();
            } else if (sel.empty) {
                sel.empty();
            }
        }
    },
    initBookmarks: function() {
        this.bookmarks = new BookmarkCollection;
        this.bookmarks.app = this;
        this.bookmarks.fetch();

        var hist = localStorage.getItem('BibleSuperSearchHistory') || null;
        var visited = localStorage.getItem('BibleSuperSearchVisited') || null;
        var sessionVerseList = localStorage.getItem(this.sessionVerseListStorageKey) || null;

        try {            
            this.history = hist ? JSON.parse(hist) : [];

            if(!Array.isArray(this.history)) {
                this.clearHistory();
            }
        } 
        catch(e) {
            this.log('error initing history');
            this.clearHistory();
        }        

        try {            
            this.visited = visited ? JSON.parse(visited) : [];

            if(!Array.isArray(this.history)) {
                this.clearVisited();
            }
        } 
        catch(e) {
            this.log('error initing visited');
            this.clearVisited();
        }

        try {
            this.sessionVerseList = sessionVerseList ? JSON.parse(sessionVerseList) : [];

            if(!Array.isArray(this.sessionVerseList)) {
                this.clearSessionVerseList();
            }
        }
        catch(e) {
            this.log('error initing list');
            this.clearSessionVerseList();
        }
    },
    copyHistoryToBookmarks: function() {
        this.history.forEach(function(item) {
            item.link = item.url;

            this.bookmarks.add(item);
        }, this);
    },
    initUserConfig: function() {
        this.debug && this.log();
        this.UserConfig.newModel(0);
        this.UserConfig.load();
    },
    initUserConfigEvents: function() {
        this.UserConfig.on('change', utils.bindSafely(this, 'userConfigChanged'));
    },
    userConfigChanged: function() {
        var t = this;

        if(
            !this.configs.saveUserSettings || this.configs.saveUserSettings == 'false'
            || this.configs.saveUserSettingsManual && this.configs.saveUserSettingsManual != 'false'
        ) {
            return; // do not save user config
        }

        this.ajaxLoadingDelay = false;
        window.clearTimeout(this.configSaveDelayTimer);

        this.configSaveDelayTimer = window.setTimeout(function() {
            t.UserConfig.save();
        }, 1000);
    },
    handleBibleChange: function(inSender, inEvent) {
        var c = this.configs.saveUserBibleSelections;
        this.debug && this.log('handleBibleChange', inEvent, c);

        // BSS-266: refresh the available-book set for the newly selected Bible(s).
        this._selectedBibles = inEvent.bibles;
        this._availableBookIds = this.getAvailableBookIds(inEvent.bibles);

        if(c && c != 'false' && c != false && this.biblesChanged && inEvent.dir == 2 && inEvent.automatic != true && inEvent.ignore != true) {
            var bibles = inEvent.bibles || [];
            var sysDef = this.getSystemDefaultBibles();

            // IF the language is saved to the user config, checking the Bibles against the default IS safe.
            // IF the language is NOT being saved, checking against the default is potentially unsafe??
            // If langauge is not saving, and user hasn't set/saved Bibles, Bibles will default based on the default language.

            if(!Array.isArray(bibles) || JSON.stringify(bibles) == JSON.stringify(sysDef)) {
                this.debug && this.log('No bibles selected / bibles match defaults, clearing user config bibles');
                bibles = [];
            } 
            
            this.UserConfig.set('bibles_selected', bibles);
            this.debug && this.log('Saving bibles to user config');
        } else {
            this.debug && this.log('NOT saving bibles to user config');
        }
    }
});

module.exports = App;
