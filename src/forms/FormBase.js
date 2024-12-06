var kind = require('enyo/kind');
var Ajax = require('enyo/Ajax');
var utils = require('enyo/utils');
var Signal = require('../components/Signal');
var Bindings = require('./FormBindings');
var FormTests = require('./FormTests');
var Passage = require('../components/Passage');

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
    formContainer: false, // Indicates that this 'form' contains muliple form instances
    formNames: [], // The internal names of each form instance, if multiple
    referenceField: 'reference',
    searchField: 'search',
    defaultSearchType: 'and',
    
    containsSubforms: false, // Indicates the current form instance contains instances of other forms
    subForm: false,  // Indicates the current form is one of multiple forms on the interface
    defaultForm: false, // If this.subForm, indicates this form instance is the default form.
    submitFormOnReferenceChange: false,

    _referenceChangeHelperIgnore: false,
    defaultSubmitting: false,
    preventDefaultSubmit: false,

    successHandle: null,
    errorHandle: null,
    fieldLastChanged: null,
    shortcutChangeIgnore: false,
    searchChangeIgnore: false,

    Passage: Passage,

    handlers: {
        onCacheChange: 'handleCacheChange',
        onHashRunForm: 'handleHashRunForm',
        onAppLoaded: 'handleAppLoaded',
        onkeyup: 'keyPress'
    },

    signalComponent: {
        kind: Signal,
        onClickReference: 'handleReferenceClick',
        onPageChange: 'handlePageChange',
        onChangeLocaleManual: 'changeLocaleManual',
        onClearForm: 'clearFormManual'
    },

    create: function() {
        this.inherited(arguments);
        this.createComponent(this.signalComponent);
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
        this.populateDefaults();

        if(!this.app.statics.access.diff && this.$.DiffContainer) {
            this.$.DiffContainer.destroy();
        } 

        if(this.app.testInit) {
            this.testInit();
        }
    },
    handleAppLoaded: function() {
        this.submitDefault();
    },
    applyDefaultReference: function(formData) {
        this.app.debug && this.log();
        var ref = this.app.configs.landingReference || null;

        if(ref && ref != '') {
            ref = this.app.vt(ref);

            if(this.$.reference) {
                formData.reference = ref;
            } else {
                formData.request = ref;
            }

            return true;
        }

        return false;
    },
    submitDefault: function() {
        this.app.debug && this.log();
        var ref = this.app.configs.landingReference || null;

        if(!this.preventDefaultSubmit && ref && ref != '') {
            var formData = {};

            ref = this.app.vt(ref);

            if(this.$.reference) {
                formData.reference = ref;
            } else {
                formData.request = ref;
            }

            this.defaultSubmitting = true;
            this.app.set('scrollMode', 'container_top');
            this._submitFormHelper(formData, false);
            return true;
        }

        return false;
    },
    clearForm: function() {
        this.set('formData', {});
    },
    clearFormManual: function() {
        this.set('formData', {
            // bible: [this.app.configs.defaultBible]
        });

        this.waterfall('onClearFormWaterfall');
        this.clearHash();
        this.populateDefaults();
        
    },
    changeLocaleManual: function() {
        this.app.debug && this.log();
        this.clearFormManual();
        //this.submitDefault();
    },
    populateDefaults: function() {
        //this.$.Bible && this.$.Bible.set('value', ['tr', 'kjv', 'tyndale']);
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

        // Custom code - Make this a config??
        if(this.$.reference_booksel) {        
            // this.$.reference_booksel.set('value', null); // why?
            this.$.reference && this.$.reference.set('value', formData.reference || null);
        }

        this._submitFormHelper(formData, true);
        //return true;
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
        this.fieldLastChanged = null;

        if(this.manualRequest) {
            this.app.set('scrollMode', 'results_top');
            formData.page = null;
            // this.formData.page = null;
            this.page = null;
            this.app.clearVisited();
        }

        if(this.requestPending) {
            return;
        }

        var destUrl = this.app.configs.destinationUrl || null;

        if(!this.app.get('preventRedirect') && destUrl && this.app.get('baseUrl') != destUrl) {
            formData.redirected = true;
            localStorage.setItem('BibleSuperSearchFormData', JSON.stringify(formData));
            this.app.debug && this.log('LocalStorage form data', localStorage.getItem('BibleSuperSearchFormData'));
            window.location = destUrl;
            return;
        }

        var ajax = new Ajax({
            url: this.app.configs.apiUrl,
            method: 'GET'
        });

        this.app.set('resultListRequestedCacheId', formData.list_cache_id || null);

        if(this.app.get('resultListRequestedCacheId') == this.app.get('resultListCacheId')) {
            delete formData.list_cache_id; // If the list is already stored in memory, don't make API query for it again
        }

        this.app.set('ajaxLoadingDelay', 100);
        this.requestPending = true;
        
        formData = this.beforeSubmitForm(formData);
        formData = this.processDefaults(formData);

        this.app.debug && this.log('Submitted formData', formData);

        ajax.go(formData); // for GET
        ajax.response(this, 'handleResponse');
        ajax.error(this, 'handleError');
    },
    
    processDefaults: function(formData) {
        var defaultBibles = this.app.defaultBibles;
        formData.bible = (formData.bible && formData.bible != '0' && formData.bible != [] && formData.bible.length != 0) ? formData.bible : defaultBibles;
        
        if(!Array.isArray(formData.bible)) {
            formData.bible = [formData.bible];
        }

        if(!formData.search_type || formData.search_type == '') {
            formData.search_type = this.defaultSearchType;
        }

        if(this.$.bible) {
            var maxBibles = this.$.bible.get('parallelLimit');

            if(formData.bible.length > maxBibles) {
                formData.bible = formData.bible.slice(0, maxBibles);
            }
        }
        
        this._formDataAsSubmitted = utils.clone(formData);

        if(!this.defaultSubmitting && this.app.configs.landingReferenceDefault && this.app.configs.landingReferenceDefault != 'false' &&
            (!formData.reference || formData.reference == '') && 
            (!formData.request || formData.request == '') && 
            (!formData.search || formData.search == '')
        ) {
            this.applyDefaultReference(formData);
        }

        var isSearch = formData.search || formData.request && !this.Passage.isPassage(formData.request);

        if(formData.reference) {
            formData.reference = this.mapPassages(formData.reference, false);
        }           

        if(formData.shortcut) {
            formData.shortcut = this.mapPassages(formData.shortcut, false);
        }        

        if(formData.request) {
            formData.request = this.mapPassages(formData.request, true);
        }

        if(isSearch && this.app.configs.limitSearchManual) {
            switch(formData.shortcut) {
            case 0:
            case '0':
                // search whole Bible, so delete/ignore reference
                delete formData.reference;
                break;
            case 1:
            case '1':
                // do nothing, use reference as is
                break;
            default:
                // Use reference from shortcut
                formData.reference = formData.shortcut;
            }
        }

        formData.bible = JSON.stringify(formData.bible);
        formData.highlight = true;
        formData.data_format = 'passage';
        // formData.data_format = 'lite';
        formData.markup = 'raw';
        formData.language = this.app.getLocaleLanguage();
        formData.context_range = this.app.UserConfig.get('context_range');
        formData.page_limit = this.app.UserConfig.get('page_limit');
        formData.key = this.app.configs.apiKey || null;

        formData.results_list = this.app.configs.resultsList;
        
        //formData.group_passage_search_results = true; // experimental
        
        // formData.page = this.get('page');
        return formData;
    },

    mapPassages: function(reference, isRequest) {
        var locale = this.app.get('locale');

        if(locale == 'en' || this.app.localeDatasets[locale].bibleBooksSource == 'api') {
            // return reference;
        }

        if(isRequest && !this.Passage.isPassage(reference)) {
            return reference;
        }

        var ref = this.Passage.explodeReferences(reference, false);

        for(i in ref) {
            ref[i] = this.app.findShortcutByName(ref[i]);
        }

        var passages = this.Passage.explodeReferences(ref.join('; '), true);

        if(passages.length == 0) {
            return reference;
        }

        var referenceNew = '';
        var BookList = this.app.localeBibleBooks[locale] || this.app.statics.books;

        passages.forEach(function(item) {
            item = this.Passage.parseBook(item);

            if(item.isBookRange) {
                var bookSt = this.app.findBookByName(item.bookSt);
                var bookEn = this.app.findBookByName(item.bookEn);
                var bookNameSt = bookSt ? bookSt.id + 'B' : item.bookSt;
                var bookNameEn = bookEn ? bookEn.id + 'B' : item.bookEn;
                var ref = bookNameSt + ' - ' + bookNameEn + ' ' + item.chapter_verse;
            } else {
                var book = this.app.findBookByName(item.book);
                var bookName = book ? book.id + 'B' : item.book;
                var ref = bookName + ' ' + item.chapter_verse;
            }

            referenceNew += ref.trim() + '; ';
        }, this);

        return referenceNew;
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
        this.app.set('cacheId', this.get('cacheHash'));
        this.app.set('shortHashUrl', '#/c/' + this.get('cacheHash'));
        var responseData = {formData: this._formDataAsSubmitted, results: inResponse, success: true};
        this.bubble('onFormResponseSuccess', responseData);
        this.waterfall('onFormResponseSuccessWaterfall', responseData);
        Signal.send('onFormResponseSuccess', responseData);
        this.app.set('responseData', responseData)
        this.maxPage = (inResponse.paging && inResponse.paging.last_page) ? inResponse.paging.last_page : null;
        this.page = (inResponse.paging && inResponse.paging.current_page) ? inResponse.paging.current_page : null;
        // this.app.UserConfig.set('copy', false); // force EZ-Copy disabled when submitting the form - make a config for this?

        this.preventDefaultSubmit = false;

        if(this.manualRequest) {
            this.updateHash();
        }

        if(this.defaultSubmitting) {
            this.clearFormManual();
            this.defaultSubmitting = false;
        }

        this.updateTitle();
        this.app.pushHistory();
        this.manualRequest = false;
        this.app.set('hasAjaxSuccess', true);
        this.successHandle && this.successHandle(responseData);
    },
    handleError: function(inSender, inResponse) {
        // this.app.set('ajaxLoading', false);
        this.app.set('ajaxLoadingDelay', false);
        this.requestPending = false;
        this.app.set('responseData', {success: false});
        
        try {
            var response = JSON.parse(inSender.xhrResponse.body);
        }
        catch (error) {
            this.app.displayInitError();
            this.errorHandle && this.errorHandle();
            return;
        }

        if(response.error_level == 4) {
            this.set('cacheHash', response.hash);
            
            if(this.manualRequest) {
                this.updateHash();
            }
            
            this.updateTitle();
            this.app.pushHistory();
            this.bubble('onFormResponseError', {formData: this._formDataAsSubmitted, response: response});
            Signal.send('onFormResponseError', {formData: this._formDataAsSubmitted, response: response});
            this.manualRequest = false;
            this.errorHandle && this.errorHandle({formData: this._formDataAsSubmitted, response: response});
        }
        else {
            this.handleResponse(inSender, response);
        }
    },
    submitRandom: function(inSender, inEvent) {
        var randomType = inSender.random_type || null;
        var formData = utils.clone(this.get('formData'));

        this.$.reference && this.$.reference.set('value', '');
        this.$.request && this.$.request.set('value', '');
        this.$.search && this.$.search.set('value', '');
        
        var submitData = {
            bible: formData.bible,
            reference: randomType
        };

        return this._submitFormHelper(submitData, true);
    },
    setFormDataWithMapping: function(formData) {
        var combined = formData.search && formData.reference;

        if(formData.search && this.searchField != 'search') {
            formData[this.searchField] = formData.search;
            delete formData.search;
        }        
        else if(formData.reference && this.referenceField != 'reference') {
            formData[this.referenceField] = formData.reference;
            delete formData.reference;
        }

        var requestField = this._requestChangeRoute(formData.request);

        if(requestField) {
            formData[requestField] = formData.request;
            delete formData.request;
        }

        formData.shortcut = combined ? '1' : '0';

        this.set('formData', {});
        this.set('formData', utils.clone(formData));
    },
    loadCache: function(hash, extraFormData) {
        this._extraFormData = extraFormData || {};
        var url = this.app.configs.apiUrl + '/readcache?hash=' + hash + this.app.configs.apiKeyStr;

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
        this.app.set('hasAjaxSuccess', true);
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
        if(!this._subformSafe()) {
            this.app.debug && this.log('non-default subform, returning');
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
    },
    handleHashRunForm: function(inSender, inEvent) {
        if(!this._subformSafe()) {
            return;
        }

        // this.clearForm();
        this.preventDefaultSubmit = true;
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
    },
    _subformSafe: function() {
        return (!this.containsSubforms && (!this.subForm || this.defaultForm));
    },
    updateHash: function() {
        var hash = this._generateHashFromData(),
            shortHash = '#/c/' + this.get('cacheHash');

        if(this.page) {
            shortHash += '/' + this.page.toString();
        }

        this.app.set('shortHashUrl', shortHash);

        hash = (hash) ? hash : shortHash;

        history.pushState(null, null, document.location.pathname + hash);
    },
    clearHash: function() {
        history.pushState(null, null, document.location.pathname);
    },
    updateTitle: function() {
        var mainSep = ' - ',
            baseTitle = this.app.get('baseTitle'),
            baseFirst = false,
            formData = this.get('_formDataAsSubmitted'),
            fields = Array('request','reference','search','search_all','search_any','search_one','search_none','search_phrase', 'page'),
            values = Array();

        fields.forEach(function(field) {
            if(formData[field] && formData[field] != '') {
                if(formData[field] == 'Random Chapter' || formData[field] == 'Random Verse') {
                    values.push(this.getActualRandomPassage());

                    // :todo actual_random make this a config?
                    // values.push(this.app.t(formData[field]));
                } else {
                    if(field == 'page') {
                        values.push(this.app.t('Page') + ' ' + formData[field]);
                    } else {
                        values.push(formData[field]);
                    }
                }
            }
        }, this);

        if(formData.context == true) {
            values.push( this.app.t('In Context') );
        }

        var bssTitle = values.join(' | ');

        if(baseFirst) {
            var newTitle = baseTitle + mainSep + bssTitle;
        }
        else {
            var newTitle = bssTitle + mainSep + baseTitle;
        }

        this.app.set('bssTitle', bssTitle);
        document.title = newTitle;
    },
    getActualRandomPassage: function() {
        var resp = this.app.get('responseData'),
            results = resp.results.results;

        var passage = this.app.getLocaleBookName(results[0].book_id, results[0].book_name) + ' ' + results[0].chapter_verse;
            passage = passage.trim();

        return passage;
    },
    formDataChanged: function(was, is) {
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
            this.app.debug && this.log('adding special binding: requestToReference');
            this.referenceField = 'request';
            // this.bindings.push(this.standardBindings.requestToReference);
        }        

        if(!this.$.search && this.$.request) {
            this.app.debug && this.log('adding special binding: requestToSearch');
            this.searchField = 'request';
            // this.bindings.push(this.standardBindings.requestToSearch);
        }
    },
    referenceTyped: function(inSender, inEvent) {
        var value = inSender.get('value') || null;
        this._referenceChangeHelper(value, 'reference', 2);
    },
    _referenceChangeHelper: function(value, field, dir) {
        if(!this.$.shortcut && !this.$.reference_booksel || this._referenceChangeHelperIgnore) {
            return;
        }

        this.app.debug && this.log(value, field, dir);
        this.log('procede');
        this._referenceChangeHelperIgnore = true;
        var hasValue = (value && value != '0' && value != '');

        if(this.$.reference && this.$.reference_booksel) {
            if(field == 'reference') {
                if(dir == 2) {
                    // this.$.reference_booksel.set('value', '');
                    this.$.reference_booksel.set('value', value);
                } else {
                    this.$.reference_booksel.set('value', value);
                }
            } else if(field == 'reference_booksel') {
                // this.app.debug && this.log('booksel');
                this.$.reference.set('value', value || null);
            }
        }

        // IE is no longer officially supported (by Microsoft or us), keeping this here for legacy purposes
        if(this.app.get('clientBrowser') == 'IE') {
            this.submitFormOnReferenceChange && this.submitForm();
            this.log('Using IE, no good!  Skipping some minor code that breaks IE ... ');
            this._referenceChangeHelperIgnore = false;
            return; // bail if IE ... yuck!
        }

        if(this.$.shortcut) {
            shortcut = this.$.shortcut.get('value');
            // this.log('shortcut', shortcut);

            if(this.app.configs.limitSearchManual) {
                // if(hasValue && shortcut == '0') {
                //     this.$.search && this.$.search.set('value', null);
                // } else if(hasValue && shortcut != '1') {
                //     this.$.shortcut.set('selected', 0);
                //     this.$.search && this.$.search.set('value', null);
                // }
            } else {
                if(hasValue) {
                    if(!this.$.shortcut.setSelectedByValue(value, 1)) {
                        // this.$.shortcut.set('selected', 1);
                    }
                }
                else {
                    this.$.shortcut.set('selected', 0);
                }
            }
        }

        this._referenceChangeHelperIgnore = false;
        this.submitFormOnReferenceChange && this.submitForm();
    },
    _requestChangeRoute: function(value) {
        if(this.$.request && this.$.request.get('type') != 'hidden' || !value || value == null) {
            return false;
        }

        return this.Passage.routeRequest(value);

        var field = null;
        var nonPassageChars = this._containsNonPassageCharacters(value);


        // todo - migrate full logic here!

        // Treats as passage if 
        // * It's not empty AND 
        // * doesn't contain Strong's Numbers AND
        // * doesn't contain invalid characters for a reference (such as those used for boolean or REGEXP queries) AND 
        // * either
        //      1) It contains numbers but no (parentheses) or
        //      2) It resolves to multiple (possible) passages
        // Note: This passage-checking logic is specific to this method


        if(
            !nonPassageChars && 
            !value.match(/[GHgh][0-9]+/) && 
            value.match(/[0-9]/) && !value.match(/\(\)/)
        ) {
            field = 'reference';
            // this.$.reference.set('value', value);
        }
        else {
            // this.$.search.set('value', value);
            field = 'search';
        }


        // matches = value.match(/([123] )?[]/gi);
        return field;

    },

    _containsNonPassageCharacters: function(str) {
        // migrated from PHP API.
        if(!str || !str.match) {
            return false;
        }

        nonPassageChars = str.match(/[`\\~!@#$%\^&*{}_[\]()]/);

        return nonPassageChars ? true : false;
    },
    keyPress: function(inSender, inEvent) {
        if(inEvent.key == 'Enter' || inEvent.keyCode && inEvent.keyCode == 13) {
            var textarea = inSender._openTag.match(/<textarea/);
            var input = inSender._openTag.match(/<input/);
            var enterSubmit = (!textarea || (inSender.enterSubmit && inSender.enterSubmit == true)) ? true : false;

            if(inSender.enterSubmitPrevent && inSender.enterSubmitPrevent == true) {
                enterSubmit = false;
            }

            if(enterSubmit && (!textarea || !inEvent.shiftKey)) {
                if(textarea) {
                    val = inSender.get('value');
                    val = val.substr(0, val.length - 1);
                    inSender.set('value', val);
                }

                this.waterfall('onGlobalEscape');
                this.submitForm(); // Submit form if user presses 'enter'
            }
        }
    },
    handleReferenceClick: function(inSender, inEvent) {
        var formData = {};

        if(this.$.request) {
            formData.request = inEvent.reference;
        }
        else {
            formData.reference = inEvent.reference;
        }

        this.set('formData', {});
        this.set('formData', utils.clone(formData));
        this.submitFormManual();
    },
    _generateHashFromData: function() {
        if(!this.isShortHashable()) {
            this.app.debug && this.log('NOT short hashable');
            return null;
        }

        var hash = null;
        var bibles = this.app.getSelectedBiblesString();

        var reference = this.$.reference ? this.$.reference.get('value') : null;
        var search = this.$.search ? this.$.search.get('value') : null;
        var request = this.$.request ? this.$.request.get('value') : null;
        var searchType = this.$.search_type ? this.$.search_type.get('value') : this.defaultSearchType;
        var formDataSubmitted = this.get('_formDataAsSubmitted');
        var pasSubmit = formDataSubmitted.reference || formDataSubmitted.request;
            pasSubmit = pasSubmit ? pasSubmit.trim() : null;

        var pas = reference ? reference : request;
        var refId = 'r';
        var page = this.page || 1;
        var searchExtras = '';
        var se = [];
        var hasSe = false;

        if(pasSubmit == 'Random Chapter' || pasSubmit == 'Random Verse') {
            // :todo actual_random make this a config?
            pas = this.getActualRandomPassage();
        }

        var passages = this.Passage.explodeReferences(pas, true);

        var searchValues = [
            {field: 'reference',    value: reference,  default: ''},
            {field: 'search_type',  value: searchType, default: 'and'},
            {field: 'page',         value: page,       default: 1}
        ];

        this.app.debug && this.log('searchValues', searchValues);

        for(i in searchValues) {
            var sv = searchValues[i];

            if(hasSe || (sv.value && sv.value != '' && sv.value != sv.default)) {
                hasSe = true;
                var val = (sv.value && sv.value != '') ? sv.value : sv.default;
                se.push(val);
            }
        }

        if(hasSe) {
            se.reverse();
            searchExtras = '/' + se.join('/');
        }

        this.app.debug && this.log('se', se, searchExtras);

        if(passages && passages.length == 1 && this.Passage.isPassage(pas)) {
            if(!reference) {
                request = null;
            }

            var cv = passages[0].chapter_verse.trim(),
                cv = cv.replace(/\s/g, ''), // remove all whitespace
                book = this.app.findBookByName(passages[0].book),

                // Regexp to detect single verses and single verse ranges
                matches = cv.match(/^([0-9]+):([0-9]+)(-([0-9]+))?$/);

            if(!book) {
                return null;
            }

            if(matches && matches.length > 0) {
                reference = book.name + '/' + matches[1].trim() + '/' + matches[2].trim();

                if(matches[4]) {
                    reference += '-' + matches[4].trim();
                }
            } else {
                reference = book.name + '/' + cv;
            }

            refId = 'p';
        }

        // UNSAFE IN URL: /,;-

        if(reference && !search && !request) {
            // Todo - single reference hashes need to be in this format: /#/p/kjv,rvg/Romans/2
            reference = reference.trim();
            hash = '#/' + refId + '/' + bibles + '/' + reference;
        }        

        if(!reference && search && !request || reference && search && !request) {
            hash = '#/s/' + bibles + '/' + search + searchExtras;
        }

        if(!reference && !search && request || reference && !search && request) {
            hash = '#/q/' + bibles + '/' + request + searchExtras;
            // hash = '#/s/' + bibles + '/' + request; // Also works
        }

        // if(!reference && !search && request) {
            // hash = '#/q/' + bibles + '/' + request;
            // hash = '#/s/' + bibles + '/' + request; // Also works
        // }

        if(!hash) {
            return null;
        }

        hash = hash.replace(/\s+/g, '.');
        return hash;
    },
    getFormFieldValue: function(fieldName) {
        var val = null;

        if(this.$[fieldName]) {
            val = this.$[fieldName].get('value') || null;
        }

        if(val == null || val == '') {
            switch(fieldName) {
                case 'search_type':
                    val = this.defaultSearchType;
                    break;
            }
        }

        return val;
    },
    formFieldChanged: function(field, value, dir) {
        value = (!value || value == '') ? null : value;

        this.app.debug && this.log(field, value, dir);

        if(this.app.configs.limitSearchManual && this.$.shortcut) {
            var l = this.fieldLastChanged,
                sc = this.$.shortcut.get('value') || '0';

            if(dir == 2 && value) {
                if(sc != '1' && (field == 'reference' || field == 'reference_booksel')) {
                    if(!this.searchChangeIgnore) {
                        this.searchChangeIgnore = true;
                        this.$.search && this.$.search.set('value', null);
                        this.$.request && this.$.request.set('value', null);
                        this.searchChangeIgnore = false;
                    }

                    if(sc != '0' && !this.shortcutChangeIgnore) {
                        this.shortcutChangeIgnore = true;
                        this.$.shortcut.setSelectedByValue('0');
                        this.shortcutChangeIgnore = false;
                    }
                } else if(sc == '0' && !this._referenceChangeHelperIgnore && (field == 'search' || field == 'request')) {
                    this._referenceChangeHelperIgnore = true;
                    this.$.reference_booksel && this.$.reference_booksel.set('value', null);
                    this.$.reference && this.$.reference.set('value', null);
                    this._referenceChangeHelperIgnore = false;
                }
            }
        }

        this.fieldLastChanged = {field: field, value: value, dir: dir};
    },
    isShortHashable: function() {
        var pass = ['request', 'reference', 'search', 'search_type'];
        var sh = true;

        // Todo - Handle separately: search_type, shortcut (verse selected)
        // Todo - work in progress!

        this.bindings.forEach(function(item, idx) {
            this.app.debug && console.log('formItem to', item.to);

            if(item.shortLink) {
                return;
            }

            // console.log('formItem', item);

            var p = item.to.split('.'),
                field = p[1],
                property = p[2];


            if(!this.$[field]) {
                return;
            }

            var value = this.$[field].get(property);

            this.app.debug && console.log('formItem field', field);
            this.app.debug && console.log('formItem property', property);
            this.app.debug && console.log('formItem value', value);
            // if(item.from = 'formData.' +)

            if(value && value != '' && value != 0) {
                sh = false;
            }

        }, this );

        return sh;
    },
    signalBibleChange: function(value, dir) {
        if(value && value.filter) {        
            value = value.filter(function(item) {
                return item && item != 0;
            });
        }

        var e = {bibles: value, dir: dir};

        Signal.send('onBibleChange', e);
        this.waterfall('onBibleChange', e);
    },
    clearHandlers: function() {
        this.successHandle = null;
        this.errorHandle = null;
    }, 
    testInit: function() {
        if(this.formContainer) {            
            for(i in this.formNames) {
                this.$[ this.formNames[i] ] && this.$[ this.formNames[i] ]._testInitHelper('Form Submission: ' + this.formNames[i]);
            }
        } else {
            this._testInitHelper('Form Submission');
        }
    },
    _testInitHelper: function(label) {
        if(this.app.testing) {
            return; //tests already ran, bail
        }

        var t = this;

        QUnit.module(label, function() {
            QUnit.test.each('Success', FormTests.success, function(assert, item) {
                var skip = false, 
                    fd = utils.clone(item.formData),
                    r = fd._reference || null,
                    s = fd._search || null,
                    hasSearchType = false;
                
                if(t.referenceField == t.referenceField && s && r) {
                    skip = true;
                }

                if(s) {
                    fd[t.searchField] = s;
                    if(!t.$[t.searchField]) {
                        skip = true;
                    }
                } else if (r) {
                    if(!t.$[t.referenceField]) {
                        skip = true;
                    }
                    fd[t.referenceField] = r;
                }

                delete fd._search;
                delete fd._reference;

                if(!skip) {                    
                    for(i in fd) {
                        if(i == 'search_type') {
                            hasSearchType = true;
                        }

                        if(i == 'bible' || i == 'search_type' || i == 'page' || i == 'page_limit') {
                            continue; // these fields default, and will work if not present on form
                        }

                        switch(i) {
                            case 'search':
                                ia = t.searchField; 
                                break;
                            case 'reference':
                                is = t.referenceField
                        }

                        if(t.standardBindings[i] && !t.$[i]) {
                            // field does not exist on this form, skip
                            skip = true;
                            break;
                        }
                    }
                }

                if(skip || item.willFailOnInterface && item.willFailOnInterface.indexOf(t.app.configs.interface) != -1) {
                    assert.true(true, 'Skipped, this interface lacks needed fields or other items ...');
                    return;
                }

                var done = assert.async();

                t.successHandle = function(responseData) {
                    assert.true(true, 'success');

                    if(item.resultsContain) {
                        assert.propContains(responseData.results, item.resultsContain);
                    }

                    t.clearHash();
                    t.clearHandlers();
                    done();
                };

                t.errorHandle = function() {
                    assert.false(true, 'error');
                    t.clearHash();
                    t.clearHandlers();
                    done();
                }

                t.clearForm();
                t.clearHash();

                // t.setFormDataWithMapping(fd);
                t.set('formData', utils.clone(fd));

                // Verify formData matches what we set
                var fdLive = t.get('formData');

                if(hasSearchType) {
                    assert.ok(fd.search_type, 'test search_type truthy');
                    assert.ok(fdLive.search_type, 'live search_type truthy');
                    assert.equal(fdLive.search_type, fd.search_type, 'search_type equal');
                }

                assert.propContains(fdLive, fd);

                t.submitForm();
            });

            QUnit.test.each('Error', FormTests.error, function(assert, item) {
                var done = assert.async();

                t.successHandle = function(responseData) {
                    assert.false(true, 'success');
                    t.clearHash();
                    t.clearHandlers();
                    done();
                };

                t.errorHandle = function() {
                    assert.true(true, 'successful error');
                    t.clearHash();
                    t.clearHandlers();
                    done();
                }

                t.clearForm();
                t.clearHash();

                var fd = utils.clone(item.formData);
                fd[t.referenceField] = fd._reference || null;
                fd[t.searchField] = fd._search || null;
                delete fd._search;
                delete fd._reference;

                t.set('formData', fd);
                t.submitForm();
            });
        });
    }, 
    _testInitMultiForm: function() {
        for(i in this.formNames) {
            this.$[ this.formNames[i] ] && this.$[ this.formNames[i] ].testInit();
        }
    }
 });
