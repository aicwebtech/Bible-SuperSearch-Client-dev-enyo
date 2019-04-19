var kind = require('enyo/kind');
var Ajax = require('enyo/Ajax');
var utils = require('enyo/utils');
var Signal = require('../components/Signal');
var Bindings = require('./FormBindings');

module.exports = kind({
    name: 'FormBase',
    classes: 'form',
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
    formContainer: false,
    referenceField: 'reference',
    searchField: 'search',
    defaultSearchType: 'and',

    handlers: {
        onCacheChange: 'handleCacheChange',
        onHashRunForm: 'handleHashRunForm',
        onkeyup: 'keyPress'
    },

    create: function() {
        this.inherited(arguments);
        this.createComponent({kind: Signal, onPageChange: 'handlePageChange'});
        // this.formData.bible = [this.app.configs.defaultBible];

        if(this.autoApplyStandardBindings) {
            this.applyStandardBindings();
        }

        if(this.subForm) {
            var styles = this.app.configs.formStyles || {};

            if(Object.entries) {            
                Object.entries(styles).forEach(function(item) {
                    this.applyStyle(item[0], item[1]);
                }, this);
            }
            // IE fix, yuck
            else {
                Object.keys(styles).forEach(function(key) {
                    var item = styles[key];
                    this.applyStyle(item[0], item[1]);
                }, this);
            }
        }

        // Break references to formData on other forms?
        this.clearForm(); 
    },
    clearForm: function() {
        this.set('formData', {});
    },
    // Submit form - via form submit button
    submitForm: function() {
        if(this.formContainer) {
            return;
        }

        var formData = utils.clone(this.get('formData'));

        if(!this.$.context) {
            formData.context = false; 
        }

        this._submitFormHelper(formData, true);
        return true;
    },    
    submitFormAuto: function() {
        return this._submitFormHelper(utils.clone(this.get('formData')), false);
    },    
    submitFormManual: function() {
        return this._submitFormHelper(utils.clone(this.get('formData')), true);
    },
    submitFormWith: function(extraFormData) {
        var formData = utils.clone(this.get('formData'));
        var formData = utils.mixin(formData, extraFormData);
        this._submitFormHelper(formData, false);
    },
    _submitFormHelper: function(formData, manual) {
        this.manualRequest = manual || false;

        if(this.requestPending) {
            return;
        }

        if(!this.app.get('preventRedirect') && typeof this.app.configs.destinationUrl != 'undefined' && this.app.get('baseUrl') != this.app.configs.destinationUrl) {
            formData.redirected = true;
            localStorage.setItem('BibleSuperSearchFormData', JSON.stringify(formData));
            // this.log('LocalStorage form data', localStorage.getItem('BibleSuperSearchFormData'));
            window.location = this.app.configs.destinationUrl;
            return;
        }

        // this.log('submitting form: ' + this.name);

        var ajax = new Ajax({
            url: this.app.configs.apiUrl,
            method: 'GET'
        });

        this.app.set('ajaxLoadingDelay', 100);
        this.requestPending = true;
        var formData = this.beforeSubmitForm(formData);
        formData = this.processDefaults(formData);
        // this.log('formData', formData);
        ajax.go(formData); // for GET
        ajax.response(this, 'handleResponse');
        ajax.error(this, 'handleError');
    },
    
    processDefaults: function(formData) {
        var defaultBible = this.app.configs.defaultBible;
        formData.bible = (formData.bible && formData.bible != '0' && formData.bible != [] && formData.bible.length != 0) ? formData.bible : [defaultBible];
        
        if(!Array.isArray(formData.bible)) {
            formData.bible = [formData.bible];
        }

        this._formDataAsSubmitted = utils.clone(formData);
        formData.bible = JSON.stringify(formData.bible);
        formData.highlight = true;
        formData.data_format = 'lite';
        formData.markup = 'raw';
        
        if(!formData.search_type || formData.search_type == '') {
            formData.search_type = this.defaultSearchType;
        }

        // formData.page = this.get('page');
        return formData;
    },

    // Override to add defaults to formData, ect
    beforeSubmitForm: function(formData) {
        return formData;
    },
    handleResponse: function(inSender, inResponse) {
        // this.app.set('ajaxLoading', false);
        this.app.set('ajaxLoadingDelay', false);
        this.requestPending = false;
        this.set('cacheHash', inResponse.hash);
        this.bubble('onFormResponseSuccess', {formData: this._formDataAsSubmitted, results: inResponse});
        this.maxPage = (inResponse.paging && inResponse.paging.last_page) ? inResponse.paging.last_page : null;
        this.page = (inResponse.paging && inResponse.paging.current_page) ? inResponse.paging.current_page : null;

        if(this.manualRequest) {
            this.updateHash();
        }

        this.updateTitle();
        this.manualRequest = false;
    },
    handleError: function(inSender, inResponse) {
        // this.app.set('ajaxLoading', false);
        this.app.set('ajaxLoadingDelay', false);
        this.requestPending = false;
        var response = JSON.parse(inSender.xhrResponse.body);

        if(response.error_level == 4) {
            this.set('cacheHash', response.hash);
            
            if(this.manualRequest) {
                this.updateHash();
            }
            
            this.updateTitle();
            this.bubble('onFormResponseError', {formData: this._formDataAsSubmitted, response: response});
            this.manualRequest = false;
        }
        else {
            this.handleResponse(inSender, response);
            // this.bubble('onFormResponseSuccess', {formData: this._formDataAsSubmitted, results: response});
        }
    },
    submitRandom: function(inSender, inEvent) {
        var randomType = inSender.random_type || null;
        var formData = utils.clone(this.get('formData'));
        
        var submitData = {
            bible: formData.bible,
            reference: randomType
        };

        return this._submitFormHelper(submitData, true);
    },
    setFormDataWithMapping: function(formData) {
        if(formData.search && this.searchField != 'search') {
            formData[this.searchField] = formData.search;
            delete formData.search;
        }        
        else if(formData.reference && this.referenceField != 'reference') {
            formData[this.referenceField] = formData.reference;
            delete formData.reference;
        }

        this.set('formData', {});
        this.set('formData', utils.clone(formData));
    },
    loadCache: function(hash, extraFormData) {
        this._extraFormData = extraFormData || {};
        var url = this.app.configs.apiUrl + '/readcache?hash=' + hash;

        if(this.requestPending) {
            // this.log('pending cache request, skipping');
            return;
        }

        var ajax = new Ajax({
            url: url,
            method: 'GET'
        });

        // this.log('Loading cache...');
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
        var formData = utils.clone(inResponse.results.form_data);
        formData.bible = JSON.parse(formData.bible);
        formData.shortcut = formData.shortcut || 0;
        this.setFormDataWithMapping(formData);
        // this.set('formData', {});
        // this.set('formData', utils.clone(formData));
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
        // this.log('hashcache', inEvent);
        // this.log('cur hash', this.get('cacheHash'));
        // this.log('cur page', this.get('page'));

        if(this.subForm) {
            this.log('subform, returning');
            return;
        }

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
        if(this.subForm) {
            return;
        }

        // this.clearForm();
        var fd = utils.clone(inEvent.formData);
        fd.shortcut = fd.shortcut || 0;
        this.setFormDataWithMapping(fd);

        this.app.debug && this.log('just set form data, about to submit form', fd);

        if(inEvent.submitAsManual) {
            this.submitFormManual();
        }
        else {
            this.submitFormAuto();
        }
        
        return true; // Don't propagage, will cause issues with subforms, if any
    },
    updateHash: function() {
        var hash = '#/c/' + this.get('cacheHash');

        if(this.page) {
            hash += '/' + this.page.toString();
        }

        history.pushState(null, null, document.location.pathname + hash);
    },
    updateTitle: function() {
        var mainSep = ' - ',
            baseTitle = this.app.get('baseTitle'),
            baseFirst = false,
            formData = this.get('_formDataAsSubmitted'),
            fields = Array('request','reference','search','search_all','search_any','search_one','search_none','search_phrase'),
            values = Array();

        fields.forEach(function(field) {
            if(formData[field] && formData[field] != '') {
                values.push(formData[field]);
            }
        }, this);

        if(baseFirst) {
            var newTitle = baseTitle + mainSep + values.join(' | ');
        }
        else {
            var newTitle = values.join(' | ') + mainSep + baseTitle;
        }

        document.title = newTitle;
    },
    formDataChanged: function(was, is) {
        // this.log('was', was);
        // this.log('is', is);

        if(!this.$.reference) {
            this.formData.reference = null; // Fix issues with random on forms with no 'reference' input
        }
    },
    applyStandardBindings: function() {
        for(i in this.standardBindings) {
            if(this.$[i]) {
                this.$[i] && this.bindings.push(this.standardBindings[i]);
            }
            else {
                // this.log('bind target not found:' + i);
            }
        }

        if(!this.$.reference && this.$.request) {
            this.log('adding special binding: requestToReference');
            this.referenceField = 'request';
            // this.bindings.push(this.standardBindings.requestToReference);
        }        

        if(!this.$.search && this.$.request) {
            this.log('adding special binding: requestToSearch');
            this.searchField = 'request';
            // this.bindings.push(this.standardBindings.requestToSearch);
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

        if(this.app.get('clientBrowser') == 'IE') {
            this.log('Using IE, no good!  Skipping some minor code that breaks IE ... ');
            return; // bail if IE ... yuck!
        }

        if(value && value != '0' && value != '') {
            if(!this.$.shortcut.setSelectedByValue(value, 1)) {
                // this.$.shortcut.set('selected', 1);
            }
        }
        else {
            this.$.shortcut.set('selected', 0);
        }
    },
    keyPress: function(inSender, inEvent) {
        if(inEvent.key == 'Enter' || inEvent.keyCode && inEvent.keyCode == 13) {
            var textarea = inSender._openTag.match(/<textarea/);
            var enterSubmit = (!textarea || (inSender.enterSubmit && inSender.enterSubmit == true)) ? true : false;

            if(enterSubmit && (!textarea || !inEvent.shiftKey)) {
                if(textarea) {
                    val = inSender.get('value');
                    val = val.substr(0, val.length - 1);
                    inSender.set('value', val);
                }

                this.submitForm(); // Submit form if user presses 'enter'
            }
        }
    }
});
