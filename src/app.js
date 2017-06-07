var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Application = require('enyo/Application');
var options = require('enyo/options');
var Image = require('enyo/Image');
var Ajax = require('enyo/Ajax');
var defaultConfig = require('./config/default');
var buildConfig = require('./config/build');
var systemConfig = require('./config/system');
var utils = require('enyo/utils');
//console.log('default', defaultConfig);



// Include application kinds!

var HelloWidget = kind({
    name: "HelloWidget",
    style: 'margin: 20px',
    components: [
        {name: "hello", content: "Hello From Enyo"},
        {kind: Button, content: "Click Me!", ontap: "helloTap"}
    ],
    helloTap: function() {
        this.$.hello.applyStyle("color", "red");
        this.bubble('onHelloTap');
        this.app.trigger('bob');
    }
});

var ImageWidget = kind({
    name: "Imageidget",
    style: 'margin: 20px',
    components: [
        {kind: Image, src: systemConfig.rootDir + '/assets/images/nb.gif'},
        {kind: Button, content: "Poke my image", ontap: "helloTap"}
    ],
    helloTap: function() {
        var bacon = {test: 'five'};
        this.log('utils', utils);

        this.bubble('onHelloTap');
        this.app.trigger('cranky');
    }
});

var RandomVerse = kind({
    name: 'RandomVerse',
    classes: 'random_verse_widget',
    bible: 'kjv',
    label: 'Random Verse',
    components: [
        {name: 'Label', tag:'h2'},
        {kind: Button, content: "Fetch", ontap: "fetch"},
        {name: 'Container'}
    ],
    create: function() {
        this.inherited(arguments);
        this.$.Label.setContent(this.label);
    },
    fetch: function(inSender, inEvent) {
        var formData = {
            'reference': 'Random Verse',
            'bible': this.bible
        };

        var ajax = new Ajax({
            url: this.app.configs.apiUrl,
            method: 'GET'
        });

        ajax.go(formData); // for GET
        ajax.response(this, 'handleResponse');
        ajax.error(this, 'handleError');
    },
    handleResponse: function(inSender, inResponse) {
        this.showResults(inResponse.results);
    },
    handleError: function(inSender, inResponse) {
        var response = JSON.parse(inSender.xhrResponse.body);

        if(response.error_level == 5) {
            this.$.Container.setContent('An error has occurred');
        }
        else {
            this.showResults(response.results);
        }
    },
    showResults: function(results) {
        this.log(results);
        var text = results[0].book_name + ' ' + results[0].chapter_verse;
        
        for(chapter in results[0].verse_index) {
            this.log(chapter);
            
            results[0].verse_index[chapter].forEach(function(verse) {
                this.log('verse', verse);
                var module = this.bible;

                if(results[0].verses[module] && results[0].verses[module][chapter] && results[0].verses[module][chapter][verse]) {
                    this.log(results[0].verses[module][chapter][verse]);
                    text += ' ' + results[0].verses[module][chapter][verse].text;
                }
            }, this);
        }

        this.$.Container.setContent(text);
    }
 });

var MyView = kind({
    name: "MyView",

    handlers: {
        'onHelloTap' : 'helloTap'
    },

    components: [
        {kind: RandomVerse},
        {kind: RandomVerse, bible: 'rvg', label: 'Random Verse - Spanish'},
        {kind: HelloWidget, name: 'top'},
        {kind: HelloWidget, name: 'middle'},
        {kind: HelloWidget, name: 'bottom'},
        {kind: ImageWidget, name: 'thinky'}
    ],

    helloTap: function(inSender, inEvent, wkh) {
        //this.log(inSender);
        //this.log(inEvent);
        //this.log(wkh);
    }
});

var MyApp = Application.kind({
    name: 'BibleSuperSearch',

    view: MyView,
    //renderTarget: 'biblesupersearch_container',
    configs: {},
    build: {},
    system: {},
    renderOnStart: false, // We need to load configs first
    rootDir: null,
    testing: false, // Indicates unit tests are running

    create: function() {
        this.inherited(arguments);
        this.configs = defaultConfig;
        this.build = buildConfig;
        this.system = systemConfig;
        this.rootDir = (typeof biblesupersearch_root_directory == 'string') ? biblesupersearch_root_directory : '/biblesupersearch';

        // If user provided a config path, use it.
        var config_path = (typeof biblesupersearch_config_path == 'string') ? biblesupersearch_config_path + '/config.json' : this.rootDir + '/config.json';

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
        alert('Error: Failed to load application data.  Error code 1');
        this.handleConfigFinal();
    },
    handleConfigLoad: function(inSender, inResponse) {
        this.log();
        utils.mixin(this.configs, inResponse);
        this.handleConfigFinal();
    },
    handleConfigFinal: function() {
        if(this.configs.target) {
            this.renderTarget = this.configs.target;
        }

        this.render();
        this.log(this.configs);

        // Load Static Data (Bibles, Books, ect)
        var ajax = new Ajax({
            url: this.configs.apiUrl + '/statics',
            method: 'GET'
        });

        //this.$.LoadingDialog.setShowing(true);
        ajax.go();
        ajax.response(this, function(inSender, inResponse) {
            //this.$.LoadingDialog.setShowing(false);
            this.log(inResponse);
            this.test();
            
            this.waterfall('onBiblesLoaded');
        });    

        ajax.error(this, function(inSender, inResponse) {
            //this.$.LoadingDialog.setShowing(false);
            alert('Error: Failed to load application data.  Error code 2');
        });    
    },

    trigger: function(name) {
        this.log(name + ' is triggered');
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
    }
});

module.exports = MyApp;
