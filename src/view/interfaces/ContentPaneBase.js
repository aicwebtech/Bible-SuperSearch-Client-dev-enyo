// ContentPane displays a form with results in a 'standard' manner
// That is, a form on top, and if applicable, results rendered below
// WARNING: This Base kind is NOT intended to be used directly, and should be extended

var kind = require('enyo/kind');
var FormController = require('./FormController');
var GridView = require('../results/GridView');
var ErrorView = require('../results/ErrorView');
var StrongsView = require('../results/StrongsView');
var DisambigView = require('../results/DisambiguationView');
var ResultsController = require('../results/ResultsController');
var DefaultAdvancedForm = require('../../forms/advanced/AdvancedClassic');
var AlertDialog = require('../../components/dialogs/Alert');
var ConfirmDialog = require('../../components/dialogs/Confirm');
var utils = require('enyo/utils');
// var FormatButtons = require('./FormatButtonsBase');

var forms = {
    // populate forms in child kinds
};

module.exports = kind({
    name: 'ContentPaneBase',
    classes: 'biblesupersearch_content',
    forms: forms,
    displayFormOnCreate: false,
    // formatButtonsView: FormatButtons,
    navigationButtonsView: null,
    formatButtonsView: null,
    formatButtonsShowing: false,
    formatButtonsToggle: false, // if true, format buttons will only display when there are form results
    uc: {},

    // Used to determine scroll height (this.autoScroll)
    scrollExtraMargin: {
        'FormContainer': 0, 
        'FormatButtonContainer': 15, 
        'ErrorsContainer': 0, 
        'StrongsContainer': 10, 
        'DisambigContainer': 0
    },

    published: {
        formView: null // This is a string representing a kind reference in this.forms
    },

    handlers: {
        onFormResponseSuccess: 'handleFormResponse',
        onFormResponseError: 'handleFormError',
        onResultsRendered: 'handleResultsRendered',
    },

    components: [
        {name: 'DialogsContainer', components: [
            {name: 'AlertDialog', kind: AlertDialog},
            {name: 'ConfirmDialog', kind: ConfirmDialog}
        ]},
        {
            name: 'FormContainer',
            components: [
                {name: 'FormController', kind: FormController, view: null},
            ]
        },        
        { name: 'FormatButtonContainer', showing: false, components: [
            {name: 'FormatButtonController', kind: FormController, view: null},
        ]},        
        {name: 'ErrorsContainer', showing: false, kind: ErrorView},
        {name: 'StrongsContainer', showing: false, kind: StrongsView, classes: 'bss_strongs_inline'},
        {name: 'DisambigContainer', showing: false, kind: DisambigView, classes: 'bss_disambiguation'},
        { name: 'ResultsContainer', components: [
            {name: 'ResultsController', kind: ResultsController, view: null},
        ]} 
        
        // {name: 'ResultsContainer', ind: ResultsView}, // need a ViewController here!
    ],

    observers: [
        {method: 'watchAdvancedToggle', path: ['uc.advanced_toggle']}
    ],
    bindings: [
        {from: 'app.UserConfig', to: 'uc', transform: function(value, dir) {
            return value;
        }}
    ],
    create: function() {
        this.inherited(arguments);

        if(this.app.get('formatButtonsView')) {
            this.formatButtonsView = this.app.formatButtonsView;
        }

        if(this.displayFormOnCreate) {
            this.formViewProcess(this.formView);
        }
        // if(this.navigationButtonsView) {
        //     this.$.ResultsController.set('navigationButtonsView', this.navigationButtonsView);
        // }

        // if(this.pagerView) {
        //     this.$. ResultsController.set('pagerView', this.pagerView);
        // }
    },
    handleResultsRendered: function(inSender, inEvent) {
        var preventScroll = this.app.get('_blockAutoScroll') || inEvent && (inEvent.localeChange || inEvent.configChange);

        if(!preventScroll) {
            this.autoScroll();
        }
    },
    autoScroll: function() {
        // Attempts to scroll to top of results
        // Sort-of works, but needs tweaking before we will go live with it.
        var headerHeight = 0;

        if(this.app.get('scrollMode') == 'results_top') {
            var headerItems = [
                'FormContainer', 
                'FormatButtonContainer', 
                // May want to tweak which ones of these are shown when scrolling
                //'ErrorsContainer', 
                //'StrongsContainer', 
                //'DisambigContainer'
            ];

            headerItems.forEach(function(item) {
                var element = this.$[item].hasNode();

                if(!element) {
                    return;
                }

                var style = element.currentStyle || window.getComputedStyle(element);
                this.app.debug && this.log('ResultsController', item, element.offsetHeight, style.marginTop, style.marginBottom);
                headerHeight += element.offsetHeight;
                headerHeight += parseInt(style.marginTop, 10);
                headerHeight += parseInt(style.marginBottom, 10);
                headerHeight += this.scrollExtraMargin[item] || 0;
            }, this);
        }

        this.app.debug && this.log('ResultsContainer scroll', headerHeight);
        this.app.setScroll(headerHeight);
        this.app.resetScrollMode();
    },
    formViewProcess: function(formView) {
        this.app.debug && this.log('formView', formView);

        if(this.forms && this.forms[formView]) {
            this.$.FormController.set('view', this.forms[formView]);
            
            if(this.formatButtonsView && !this.formatButtonsShowing ) {    
                this.$.FormatButtonController.set('view', this.formatButtonsView);
                
                if(!this.app.configs.formatButtonsToggle) {
                    this.$.FormatButtonContainer.set('showing', true);
                    this.formatButtonsShowing = true;
                }
                else {
                    this.$.FormatButtonContainer.set('showing', false);
                }
            }
        }
        else {
            this.log('form view not found', formView)
        }
    },
    formViewChanged: function(was, is) {
        this.formViewProcess(is);
        this.bubble('onFormViewChanged');
        this.$.FormController && this.$.FormController.render();
    },
    handleFormResponse: function(inSender, inEvent) {
        this.hideExtra();
        this.$.ErrorsContainer.set('showing', false);
        this.$.FormatButtonContainer.set('showing', true);
        var results = utils.clone(inEvent.results);

        if(results.error_level == 4) {
            return this.handleFormError(inSender, inEvent);
        }       

        this.handleResponseExtra(results); 

        // Non-fatal errors
        if(inEvent.results.error_level > 0) {
            // this.$.ErrorsContainer.set('string', 
            //     inEvent.results.errors.join('<br><br>')
            // );
            
            this.$.ErrorsContainer.set('errors', results.errors);
            this.$.ErrorsContainer.set('showing', true);
        }

        this.$.ResultsController.set('resultsData', results);
        this.$.ResultsController.set('formData', inEvent.formData);
        this.$.ResultsController.renderResults();
        this.$.ResultsContainer.set('showing', true);
    },
    handleResponseExtra: function(results) {
        if(Array.isArray(results.strongs)) {
            var hasStrongs = false;
            this.$.StrongsContainer.destroyClientControls();

            results.strongs.forEach(function(item) {
                hasStrongs = true;
                this.$.StrongsContainer._addStrongs(item)
            }, this);

            if(hasStrongs) {
                this.$.StrongsContainer.set('showing', true);
                this.$.StrongsContainer.render();
            }
        }        

        if(Array.isArray(results.disambiguation)) {
            var hasStrongs = false;
            this.$.DisambigContainer.destroyClientControls();

            results.disambiguation.forEach(function(item) {
                hasStrongs = true;
                this.$.DisambigContainer._addItem(item)
            }, this);

            if(hasStrongs) {
                this.$.DisambigContainer.set('showing', true);
                this.$.DisambigContainer.render();
            }
        }
    },
    hideExtra: function() {
        this.$.StrongsContainer.set('showing', false);
        this.$.DisambigContainer.set('showing', false);
    },
    handleFormError: function(inSender, inEvent) {
        this.hideExtra();

        if(this.app.configs.formatButtonsToggle) {
            this.$.FormatButtonContainer.set('showing', false);
        }

        this.$.ResultsContainer.set('showing', false);
        
        // this.$.ErrorsContainer.set('string', 
        //     inEvent.response.errors.join('<br><br>')
        // );
        
        this.$.ErrorsContainer.set('errors', inEvent.response.errors);
        this.$.ErrorsContainer.set('showing', true);
    },
    watchAdvancedToggle: function(pre, cur, prop) {
        if(cur) {
            this.set('formView', 'Advanced');
        }
        else {
            this.set('formView', 'Form');
        }
    }
});
