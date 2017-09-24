var kind = require('enyo/kind');
var Ajax = require('enyo/Ajax');
var utils = require('enyo/utils');
var Signal = require('../components/Signal');

module.exports = kind({
    name: 'FormBase',
    formData: {},
    _formDataAsSubmitted: {},

    components: [
        {content: 'form base'}
    ],

    create: function() {
        this.inherited(arguments);
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
        this._formDataAsSubmitted = utils.clone(formData);
        this.log('formData', formData);
        ajax.go(formData); // for GET
        ajax.response(this, 'handleResponse');
        ajax.error(this, 'handleError');
    },
    // Override to add defaults to formData, ect
    beforeSubmitForm: function(formData) {
        this.log(this.app.configs);
        var defaultBible = this.app.configs.defaultBible;
        formData.bible = (formData.bible && formData.bible != '0' && formData.bible != [] && formData.bible.length != 0) ? formData.bible : [defaultBible];
        
        if(!Array.isArray(formData.bible)) {
            formData.bible = [formData.bible];
        }

        formData.bible = JSON.stringify(formData.bible);
        return formData;
    },
    handleResponse: function(inSender, inResponse) {
        //this.showResults(inResponse.results);
        // Signal.send('onFormResponseSuccess', {formData: this._formDataAsSubmitted, results: inResponse.results});
        this.bubble('onFormResponseSuccess', {formData: this._formDataAsSubmitted, results: inResponse.results});
    },
    handleError: function(inSender, inResponse) {
        var response = JSON.parse(inSender.xhrResponse.body);

        if(response.error_level == 5) {
            this.$.Container.setContent('An error has occurred');
            // Signal.send('onFormResponseError', {formData: this._formDataAsSubmitted});
            this.bubble('onFormResponseError', {formData: this._formDataAsSubmitted});
        }
        else {
            this.log(response.results);
            // Signal.send('onFormResponseSuccess', {formData: this._formDataAsSubmitted, results: response.results});
            this.bubble('onFormResponseSuccess', {formData: this._formDataAsSubmitted, results: response.results});
        }
    },
    submitRandom: function(inSender, inEvent) {
        var randomType = inSender.random_type || null
        var formData = utils.clone(this.get('formData'));
        formData.reference = randomType;
        return this._submitFormHelper(formData);
    }
});
