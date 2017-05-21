var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Application = require('enyo/Application');
var options = require('enyo/options');
var Ajax = require('enyo/Ajax');
var defaultConfig = require('./config/default');
var buildConfig = require('./config/build');
var systemConfig = require('./config/system');
var utils = require('enyo/utils');
//console.log('default', defaultConfig);

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

var MyView = kind({
    name: "MyView",

    handlers: {
        'onHelloTap' : 'helloTap'
    },

    components: [
        {kind: HelloWidget, name: 'top'},
        {kind: HelloWidget, name: 'middle'},
        {kind: HelloWidget, name: 'bottom'}
    ],

    helloTap: function(inSender, inEvent, wkh) {
        //this.log(inSender);
        //this.log(inEvent);
        //this.log(wkh);
    }
});

var MyApp = Application.kind({
    view: MyView,
    //renderTarget: 'biblesupersearch_container',
    configs: {},
    build: {},
    system: {},
    renderOnStart: false, // We need to load configs first

    create: function() {
        this.inherited(arguments);
        this.configs = defaultConfig;
        this.build = buildConfig;
        this.system = systemConfig;

        // If user provided a config path, use it.
        var config_path = (typeof biblesupersearch_config_path == 'string') ? biblesupersearch_config_path + '/config.json' : 'config.json';

        if(this.build.dynamicConfig == true) {
            config_path = this.build.dynamicConfigUrl;
        }

        this.log('config_path', config_path);

        var loader = new Ajax({
            url: config_path,
            method: 'GET'
        });

        loader.go(); // for GET
        loader.response(this, 'handleConfigLoad');
        loader.error(this, 'handleConfigError');
    },
    handleConfigError: function() {
        this.log('a load error has occurred');
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
            
            this.waterfall('onBiblesLoaded');
        });    

        ajax.error(this, function(inSender, inResponse) {
            //this.$.LoadingDialog.setShowing(false);
            alert('Error: Failed to load application data');
        });    
    },

    trigger: function(name) {
        this.log(name + ' is triggered');
    }
});

module.exports = MyApp;
