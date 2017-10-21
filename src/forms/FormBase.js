var kind = require('enyo/kind');
var Ajax = require('enyo/Ajax');
var utils = require('enyo/utils');
var Signal = require('../components/Signal');

module.exports = kind({
    name: 'FormBase',
    formData: {},
    _formDataAsSubmitted: {},
    _extraFormData: {},
    page: 1,
    maxPage: null,
    cacheHash: null,
    requestPending: false,

    handlers: {
        onPageChange: 'handlePageChange',
        onCacheChange: 'handleCacheChange'
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
    submitFormWith: function(extraFormData) {
        var formData = utils.clone(this.get('formData'));
        var formData = utils.mixin(formData, extraFormData);
        this._submitFormHelper(formData);
    },
    _submitFormHelper: function(formData) {
        if(this.requestPending) {
            this.log('pendign request');
            return;
        }

        var ajax = new Ajax({
            url: this.app.configs.apiUrl,
            method: 'GET'
        });

        this.requestPending = true;
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
        // formData.page = this.get('page');
        return formData;
    },

    // Override to add defaults to formData, ect
    beforeSubmitForm: function(formData) {
        return formData;
    },
    handleResponse: function(inSender, inResponse) {
        //this.showResults(inResponse.results);
        this.set('cacheHash', inResponse.hash);
        this.requestPending = false;

        this.bubble('onFormResponseSuccess', {formData: this._formDataAsSubmitted, results: inResponse});
        this.maxPage = (inResponse.paging && inResponse.paging.last_page) ? inResponse.paging.last_page : null;
    },
    handleError: function(inSender, inResponse) {
        this.requestPending = false;
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
    loadCache: function(hash, extraFormData) {
        this._extraFormData = extraFormData || {bacon: 'mmm'};
        var url = this.app.configs.apiUrl + '/readcache?hash=' + hash;
        this.log('url', url);
        this.log('extra', extraFormData);

        if(this.requestPending) {
            this.log('pendign request');
            return;
        }

        var ajax = new Ajax({
            url: url,
            method: 'GET'
        });

        this.requestPending = true;
        // ajax.response(this, 'handleCacheResponse');
        ajax.response(utils.bind(this, this.handleCacheResponse));
        ajax.error(this, 'handleCacheError');
        ajax.go(); // for GET
    },
    handleCacheResponse: function(inSender, inResponse) {
        //this.showResults(inResponse.results);
        this.set('cacheHash', inResponse.results.hash);
        this.requestPending = false;
        var formData = inResponse.results.form_data;
        formData.bible = JSON.parse(formData.bible);
        this.set('formData', utils.clone(formData));
        this.submitFormWith(this._extraFormData);
    },
    handleCacheError: function(inSender, inResponse) {
        this.requestPending = false;
        var response = JSON.parse(inSender.xhrResponse.body);
        this.log('An error has occurred');
    },
    handlePageChange: function(inSender, inEvent) {
        this.log();
        this.set('page', inEvent.page);

        this.submitFormWith({page: inEvent.page});
        // var formData = utils.clone(this.get('formData'));
        // formData.page = inEvent.page;
        // this._submitFormHelper(formData);
        return true;
    },
    // Lots of problems will need to be solved with page / cache change handling so subforms (advanced search) will work correct
    handleCacheChange: function(inSender, inEvent) {
        this.log(inEvent);

        var extra = {
            page: inEvent.page || 1
        };

        if(this.get('cacheHash') != inEvent.cacheHash) {
            this.loadCache(inEvent.cacheHash, extra);
        }
        else if(inEvent.page) {
            this.submitFormWith(extra);
        }

        return true; // Don't propagage, will cause issues with subforms, if any
    }
});
