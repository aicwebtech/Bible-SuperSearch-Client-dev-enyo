var kind = require('enyo/kind');
var FormController = require('./FormController');
var Simple = require('../forms/Simple');
var Advanced = require('../forms/Advanced');
var Search = require('../forms/Search');
var Passage = require('../forms/Passage');
var ResultsView = require('./ResultsView');

var forms = {
    Simple: Simple,
    Search: Search,
    Advanced: Advanced,
    Passage: Passage
};

module.exports = kind({
    name: 'Content',
    classes: 'biblesupersearch_content',
    forms: forms,

    published: {
        formView: null
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
        // this.formViewProcess(this.formView);
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
                kind: ResultsView,
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
