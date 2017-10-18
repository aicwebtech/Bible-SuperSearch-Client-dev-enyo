var kind = require('enyo/kind');
var Ajax = require('enyo/Ajax');
var utils = require('enyo/utils');
var Signal = require('../components/Signal');

module.exports = kind({
    name: 'FormBase',
    formData: {},
    _formDataAsSubmitted: {},
    page: 1,
    maxPage: null,

    handlers: {
        onPageChange: 'handlePageChange'
    },

    create: function() {
        this.inherited(arguments);
        this.createComponent({kind: Signal, onPageChange: 'handlePageChange'});
        this.log();
        // this.formData.bible = [this.app.configs.defaultBible];
    },
    submitForm: function() {
        return this._submitFormHelper(utils.clone(this.get('formData')));
    },
    _submitFormHelper: function(formData) {
        var ajax = new Ajax({
            url: this.app.configs.apiUrl,
            method: 'GET'
        });

        this.beforeSubmitForm(formData);
        this.processDefaults(formData);
        this.log('formData', formData);
        ajax.go(formData); // for GET
        ajax.response(this, 'handleResponse');
        ajax.error(this, 'handleError');
    },
    
    processDefaults: function(formData) {
        this.log(this.app.configs);
        var defaultBible = this.app.configs.defaultBible;
        formData.bible = (formData.bible && formData.bible != '0' && formData.bible != [] && formData.bible.length != 0) ? formData.bible : [defaultBible];
        
        if(!Array.isArray(formData.bible)) {
            formData.bible = [formData.bible];
        }

        this._formDataAsSubmitted = utils.clone(formData);
        formData.bible = JSON.stringify(formData.bible);
        formData.highlight = true;
        formData.page = this.get('page');
        return formData;
    },

    // Override to add defaults to formData, ect
    beforeSubmitForm: function(formData) {
        return formData;
    },
    handleResponse: function(inSender, inResponse) {
        //this.showResults(inResponse.results);

        this.bubble('onFormResponseSuccess', {formData: this._formDataAsSubmitted, results: inResponse});
        this.maxPage = (inResponse.paging && inResponse.paging.last_page) ? inResponse.paging.last_page : null;
    },
    handleError: function(inSender, inResponse) {
        var response = JSON.parse(inSender.xhrResponse.body);

        if(response.error_level == 4) {
            this.bubble('onFormResponseError', {formData: this._formDataAsSubmitted, response: response});
        }
        else {
            this.handleResponse(inSender, response);
            // this.bubble('onFormResponseSuccess', {formData: this._formDataAsSubmitted, results: response});
        }
    },
    submitRandom: function(inSender, inEvent) {
        var randomType = inSender.random_type || null
        var formData = utils.clone(this.get('formData'));
        
        var submitData = {
            bible: formData.bible,
            reference: randomType
        };

        return this._submitFormHelper(submitData);
    },
    handlePageChange: function(inSender, inEvent) {
        this.log();
        this.set('page', inEvent.page);
        this.submitForm();
    }
});
