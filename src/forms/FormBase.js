var kind = require('enyo/kind');
var Ajax = require('enyo/Ajax');
var utils = require('enyo/utils');
var Signal = require('../components/Signal');
var Bindings = require('./FormBindings');

module.exports = kind({
    name: 'FormBase',
    formData: {},
    _formDataAsSubmitted: {},
    _extraFormData: {},
    page: 1,
    maxPage: null,
    cacheHash: null,
    requestPending: false,
    manualRequest: false, // Indicates if current query was caused by the user clicking a button on the form
    bindings: [],
    autoApplyStandardBindings: true,
    standardBindings: Bindings,
    subForm: false,

    handlers: {
        onCacheChange: 'handleCacheChange',
        onHashRunForm: 'handleHashRunForm'
    },

    create: function() {
        this.inherited(arguments);
        this.createComponent({kind: Signal, onPageChange: 'handlePageChange'});
        this.log();
        // this.formData.bible = [this.app.configs.defaultBible];

        if(this.autoApplyStandardBindings) {
            this.applyStandardBindings();
        }
    },
    clearForm: function() {
        this.set('formData', {});
    },
    submitForm: function() {
        this._submitFormHelper(utils.clone(this.get('formData')), true);
        return true;
    },    
    submitFormAuto: function() {
        return this._submitFormHelper(utils.clone(this.get('formData')), false);
    },
    submitFormWith: function(extraFormData) {
        var formData = utils.clone(this.get('formData'));
        var formData = utils.mixin(formData, extraFormData);
        this._submitFormHelper(formData, false);
    },
    _submitFormHelper: function(formData, manual) {
        this.manualRequest = manual || false;

        if(this.requestPending) {
            this.log('pendign request');
            return;
        }

        this.log('submitting form: ' + this.name);

        var ajax = new Ajax({
            url: this.app.configs.apiUrl,
            method: 'GET'
        });

        this.app.set('ajaxLoading', true);
        this.requestPending = true;
        var formData = this.beforeSubmitForm(formData);
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
        formData.data_format = 'lite';
        // formData.page = this.get('page');
        return formData;
    },

    // Override to add defaults to formData, ect
    beforeSubmitForm: function(formData) {
        return formData;
    },
    handleResponse: function(inSender, inResponse) {
        this.app.set('ajaxLoading', false);
        this.requestPending = false;
        this.set('cacheHash', inResponse.hash);
        this.bubble('onFormResponseSuccess', {formData: this._formDataAsSubmitted, results: inResponse});
        this.maxPage = (inResponse.paging && inResponse.paging.last_page) ? inResponse.paging.last_page : null;
        this.page = (inResponse.paging && inResponse.paging.current_page) ? inResponse.paging.current_page : null;

        if(this.manualRequest) {
            this.updateHash();
        }

        this.manualRequest = false;
    },
    handleError: function(inSender, inResponse) {
        this.app.set('ajaxLoading', false);
        this.requestPending = false;
        var response = JSON.parse(inSender.xhrResponse.body);

        if(response.error_level == 4) {
            this.bubble('onFormResponseError', {formData: this._formDataAsSubmitted, response: response});
            this.manualRequest = false;
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

        return this._submitFormHelper(submitData, true);
    },
    loadCache: function(hash, extraFormData) {
        this._extraFormData = extraFormData || {bacon: 'mmm'};
        var url = this.app.configs.apiUrl + '/readcache?hash=' + hash;

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
    // Handles cache change and page change
    // Lots of problems will need to be solved with page / cache change handling so subforms (advanced search) will work correct
    handleCacheChange: function(inSender, inEvent) {
        this.log('hashcache', inEvent);

        var extra = {
            page: inEvent.page || 1
        };

        if(this.get('cacheHash') != inEvent.cacheHash) {
            this.loadCache(inEvent.cacheHash, extra);
        }
        else if(inEvent.page && inEvent.page != this.get('page')) {
            this.submitFormWith(extra);
        }

        return true; // Don't propagage, will cause issues with subforms, if any
    },
    handleHashRunForm: function(inSender, inEvent) {
        // this._submitFormHelper(inEvent.formData);
        this.set('formData', utils.clone(inEvent.formData));
        this.submitFormAuto();
        // this.clearForm();
        
        return true; // Don't propagage, will cause issues with subforms, if any
    },
    updateHash: function() {
        var hash = '#/c/' + this.get('cacheHash');

        if(this.page) {
            hash += '/' + this.page.toString();
        }

        window.location.hash = hash;
    },
    applyStandardBindings: function() {
        this.log('form name: ' + this.name);

        for(i in this.standardBindings) {
            if(this.$[i]) {
                this.$[i] && this.bindings.push(this.standardBindings[i]);
            }
            else {
                this.log('bind target not found:' + i);
            }
        }
    },
    referenceTyped: function(inSender, inEvent) {
        var value = inSender.get('value') || null;
        this._referenceChangeHelper(value);
    },
    _referenceChangeHelper: function(value) {
        if(!this.$.shortcut) {
            return;
        }

        if(value && value != '0' && value != '') {
            if(!this.$.shortcut.setSelectedByValue(value)) {
                this.$.shortcut.set('selected', 1);
            }
        }
        else {
            this.$.shortcut.set('selected', 0);
        }
    }
});
