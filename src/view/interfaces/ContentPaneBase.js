// ContentPane displays a form with results in a 'standard' manner
// That is, a form on top, and if applicable, results rendered below
// WARNING: This Base kind is NOT intended to be used directly, and should be extended

var kind = require('enyo/kind');
var FormController = require('./FormController');
var GridView = require('../results/GridView');

var forms = {
    // populate forms in child kind
};

module.exports = kind({
    name: 'ContentPaneBase',
    classes: 'biblesupersearch_content',
    forms: forms,
    displayFormOnCreate: false,

    published: {
        formView: null // This is a string representing a kind reference in this.forms
    },

    handlers: {
        onFormResponseSuccess: 'handleFormResponse',
        onFormResponseError: 'handleFormError'
    },

    components: [
        {content: 'content view'},
        { components: [
            {name: 'FormController', kind: FormController, view: null},
        ]},
        {name: 'ResultsContainer'}
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
        }
    },
    formViewChanged: function(was, is) {
        this.formViewProcess(is);
        this.$.FormController && this.$.FormController.render();
    },
    handleFormResponse: function(inSender, inEvent) {
        this.log(inEvent);
        //return;
        this.$.ResultsContainer.destroyComponents();
        //this.log(results);

        if(inEvent.results.error_level == 4) {
            alert(inEvent.results.errors.join('<br><br>'));
            return;
        }

        inEvent.results.forEach(function(passage) {
            this.$.ResultsContainer.createComponent({
                kind: GridView,
                passageData: passage,
                bibleCount: 1,
                formData: inEvent.formData,
            });
        }, this);

        //this.$.ResultsContainer.setShowing(true);
        //this.$.Errors.setShowing(false);
        this.$.ResultsContainer.render();


/*        this.$.ResultsContainer.set('formData', inEvent.formData);
        this.$.ResultsContainer.set('passageData', inEvent.results);
        this.$.ResultsContainer.renderResults();*/
    },
    handleFormError: function(inSender, inEvent) {

    }
});
