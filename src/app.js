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
    applicationVersion: '5.2.0',
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
    resetView: true,
    appLoaded: false,
    ajaxLoadingDelayTimer: null,
    baseTitle: null,
    bssTitle: null,
    baseUrl: null,
    clientBrowser: null,
    preventRedirect: false,
    shortHashUrl: '',
    biblesDisplayed: [],
    locale: 'en',
    defaultLocale: 'en', // hardcoded
    localeData: Locales.en,
    localeDatasetsRaw: Locales,
    localeDatasets: {},
    localeBibleBooks: {},
    validate: Validators,
    AlertDialog: AlertDialog,
    responseCollection: ResponseCollection,
    utils: Utils,
    hasAjaxSuccess: false,
    hasMouse: false, // use mouse events to detect

    scrollMode: 'container_top',
    scrollModeDefault: 'container_top',
    
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
        {method: 'watchSingleVerses', path: ['UserConfig.single_verses']}
    ],

    create: function() {
        this.inherited(arguments);
        this.configs = utils.clone(defaultConfig);
        this.build = buildConfig;
        this.system = systemConfig;
        this.set('baseTitle', document.title);
        // this.log('defaultConfig', defaultConfig);

        window.console && console.log('BibleSuperSearch client version', this.applicationVersion);
        
        // Older rootDir code, retaining for now
        this.rootDir = (typeof biblesupersearch_root_directory == 'string') ? biblesupersearch_root_directory : '/biblesupersearch';
        
        if(navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1) {
            this.clientBrowser = 'IE';
            window.console && console.log('Using Internet Explorer ... some minor functionality may be disabled ...');
        }

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
    talk: function() {
        alert('Hello')
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

        // Render 'Loading' view
        // Todo - set css style based on selected interface
        this.set('view', Loading);
        this.render();

        this.configs.apiUrl = this.configs.apiUrl.replace(/\/+$/, '') + '/api';
        
        if(this.configs.debug) {
            this.debug = this.configs.debug;
        }

        if(typeof biblesupersearch_statics == 'object' && biblesupersearch_statics != null) {
            this._handleStaticsLoad(biblesupersearch_statics, view);
            return;
        }

        // Load Static Data (Bibles, Books, ect)
        var ajax = new Ajax({
            url: this.configs.apiUrl + '/statics?language=en',
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
    _handleStaticsLoad: function(statics, view) {
        this.test();
        this.set('statics', statics);
        this.processBiblesDisplayed();

        if(!statics.download_enabled) {
            defaultConfig._downloadDisabledNotice();
        }

        this.localeBibleBooks.en = statics.books;
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

        this.biblesDisplayed = displayed;
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
        this.view.hasNode() && this.view.hasNode().scrollTo({
            top: scroll, 
            left: 0, 
            behavior: 'smooth'
        });
    },
    resetScrollMode: function() {
        this.set('scrollMode', this.get('scrollModeDefault'));
    }, 
    getSelectedBibles: function() {
        var bibles = this.getFormFieldValue('bible');

        if(!bibles || bibles.length == 0 || bibles.length == 1 && bibles[0] == null) {
            bibles = [this.configs.defaultBible];
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
            return fallbackName;
        }

        // :todo: make this a config??
        // Option 1: Display book names in language selected in UI (Reccomended)
        // Option 2: Display book names in language of First selected Bible (Legacy - not fully implemented)

        var locale = this.get('locale');
        useShortname = useShortname || false;
        var nameField = useShortname ? 'shortname' : 'name';

        if(locale == 'en' || this.localeDatasets[locale].bibleBooksSource == 'api') {
            //return fallbackName;
        }

        var book = this.localeBibleBooks[locale][id - 1];
        book = book || this.getBook(id);

        if(book && useShortname) {
            return book.shortname || book.name;
        }

        return book ? book.name : fallbackName;
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
                url: this.configs.apiUrl + '/books?language=' + language,
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
                bookEn = this.localeBibleBooks.en[key] || null;

            if(typeof localeData[ bookEn.name ] == 'undefined') {
                localeData[ bookEn.name ] = book.name;
            }

            if(source == 'locale') {
                bookList[key].chapters = bookEn.chapters;
                // bookList[key].chapter_verses = bookEn.chapter_verses;
            }
        }

        localeData.bibleBooksSource = source;
        this.localeBibleBooks[locale] = bookList;
        this.localeDatasets[locale] = utils.clone(localeData);
        this._localeChangedHelper(locale);
    },
    _localeChangedHelper: function(locale) {
        this.localeData = utils.clone(this.localeDatasets[locale]);
        var localeData = this.localeData;
        this.isRtl = localeData.meta.isRtl || false;

        Signal.send('onLocaleChange');
        this.waterfall('onLocaleChange');
    },
    // Translate
    t: function(string) {
        if(!string || string == '' || typeof string != 'string') {
            return '';
        }

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
    alert: function(string, inSender, inEvent) {
        // todo - make some sort of custom alert dialog here!
        if(inSender && inEvent) {
            Signal.send('onPositionedAlert', {alert: string, inSender: inSender, inEvent: inEvent});
        }
        else {
            Signal.send('onAlert', {alert: string});
        }
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
        this.UserConfig.get('single_verses') && this._checkSingleVerses();
    },
    watchSingleVerses: function(pre, cur, prop)  {
        this._checkSingleVerses();
    },
    _checkSingleVerses: function() {
        if(!this.get('responseData')) {
            return;
        }

        if(this.UserConfig.get('single_verses')) {
            var responseDataNew = utils.clone(this.get('responseData'));
            responseDataNew.results = utils.clone(responseDataNew.results);
            responseDataNew.results.results = this.responseCollection.toVerses( utils.clone(responseDataNew.results.results) );
        }
        else {
            var responseDataNew = this.get('responseData');
        }

        this.waterfall('onFormResponseSuccess', responseDataNew);
        Signal.send('onFormResponseSuccess', responseDataNew);
    },
    _copyComponentContent: function(Component, contentField) {
        if(!Component) {
            return;
        }

        var contentField = contentField || 'content',
            content = Component.get(contentField),
            n = Component.hasNode();

        if(!n || !content) {
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
        if(navigator && navigator.clipboard && navigator.clipboard.writeText) {
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

    }
});

module.exports = App;
