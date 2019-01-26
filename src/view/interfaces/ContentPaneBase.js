// ContentPane displays a form with results in a 'standard' manner
// That is, a form on top, and if applicable, results rendered below
// WARNING: This Base kind is NOT intended to be used directly, and should be extended

var kind = require('enyo/kind');
var FormController = require('./FormController');
var GridView = require('../results/GridView');
var ErrorView = require('../results/ErrorView');
var ResultsController = require('../results/ResultsController');
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
    formatButtonsView: null,
    formatButtonsShowing: false,
    formatButtonsToggle: false, // if true, format buttons will only display when there are form results
    uc: {},

    published: {
        formView: null // This is a string representing a kind reference in this.forms
    },

    handlers: {
        onFormResponseSuccess: 'handleFormResponse',
        onFormResponseError: 'handleFormError'
    },

    components: [
        { components: [
            {name: 'FormController', kind: FormController, view: null},
        ]},        
        { name: 'FormatButtonContainer', showing: false, components: [
            {name: 'FormatButtonController', kind: FormController, view: null},
        ]},        
        {name: 'ErrorsContainer', showing: false, kind: ErrorView},
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
            this.log('results controller user config', value, dir);
            return value;
        }}
    ],
    create: function() {
        this.inherited(arguments);

        if(this.displayFormOnCreate) {
            this.formViewProcess(this.formView);
        }
    },
    formViewProcess: function(formView) {
        this.log('formView', formView);

        if(this.forms && this.forms[formView]) {
            this.$.FormController.set('view', this.forms[formView]);
            
            if(this.formatButtonsView && !this.formatButtonsShowing ) {    
                this.$.FormatButtonController.set('view', this.formatButtonsView);
                
                if(!this.formatButtonsToggle) {
                    this.$.FormatButtonContainer.set('showing', true);
                    this.formatButtonsShowing = true;
                }
                else {
                    this.$.FormatButtonContainer.set('showing', false);
                }
            }
        }
    },
    formViewChanged: function(was, is) {
        this.formViewProcess(is);
        this.$.FormController && this.$.FormController.render();
    },
    handleFormResponse: function(inSender, inEvent) {
        this.$.ErrorsContainer.set('showing', false);
        this.$.FormatButtonContainer.set('showing', true);

        if(inEvent.results.error_level == 4) {
            return this.handleFormError(inSender, inEvent);
        }        

        // Non-fatal errors
        if(inEvent.results.error_level > 0) {
            this.$.ErrorsContainer.set('content', 
                inEvent.results.errors.join('<br><br>')
            );
            
            this.$.ErrorsContainer.set('showing', true);
        }

        this.$.ResultsController.set('resultsData', inEvent.results);
        this.$.ResultsController.set('formData', inEvent.formData);
        this.$.ResultsController.renderResults();
        this.$.ResultsContainer.set('showing', true);
    },
    handleFormError: function(inSender, inEvent) {
        this.log('error');
        this.log(inEvent);

        if(this.formatButtonsToggle) {
            this.$.FormatButtonContainer.set('showing', false);
        }

        this.$.ResultsContainer.set('showing', false);
        
        this.$.ErrorsContainer.set('content', 
            inEvent.response.errors.join('<br><br>')
        );
        
        this.$.ErrorsContainer.set('showing', true);
    },
    watchAdvancedToggle: function(pre, cur, prop) {
        this.log(pre, cur, prop);

        if(cur) {
            this.set('formView', 'Advanced');
        }
        else {
            this.set('formView', 'Form');
        }
    }
});
