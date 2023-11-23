var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var utils = require('enyo/utils');
var Image = require('../Image');
var i18n = require('../Locale/i18nContent');

var Ajax = require('enyo/Ajax');
var BibleSelector = require('../BibleSelect/MultiSelect.js');
var FormatSelector = require('../DownloadSelect.js')

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'DownloadDialog',
    kind: Dialog,
    maxWidth: '500px',
    height: '410px',
    classes: 'help_dialog bible_download',
    bibleString: null,
    formData: null,
    requestPending: false,
    hasErrors: false,
    
    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, tag: 'h3', content: 'Bible Downloads'}
        ]}
    ],
    bodyComponents: [
        {classes: 'list start_list', name: 'ListContainer'},
        {kind: i18n, tag: 'h5', content: 'Select Bible(s)'},
        {components: [
            {
                name: 'BibleSelect', 
                kind: BibleSelector, 
                downloadableOnly: true, 
                defaultNull: true,
                selectorWidth: 350,
                onAddSelectorTapped: '_formChanged',
                onValueChanged: '_formChanged'
            },
        ]},        
        {kind: i18n, tag: 'h5', content: 'Select a Format'},
        // {tag: 'br'},
        {components: [
            {name: 'FormatSelect', kind: FormatSelector, style: 'width: 100%; max-width: 350px', onchange: '_formChanged'},
        ]},
        {tag: 'br'},
        {name: 'Status', showing: false, components: [
            {name: 'Spinner', kind: Image, relSrc: '/Spinner.gif'},
            {kind: i18n, tag: 'h4', content: 'Rendering Bibles, this may take some time'},
            {name: 'RenderStatusContainer', classes: 'render_list'}
        ]},
        {kind: i18n, name: 'RenderingComplete', tag: 'h4', content: 'Rendering is Complete', showing: false},
        {name: 'DownloadPending', showing: false, components: [
            {kind: i18n, tag: 'h4', content: 'Your download should begin shortly'},
            {components: [            
                {kind: i18n, content: 'If not, please click on the below link'},
                {tag: 'span', content: ':'}
            ]},
            {tag: 'br'},
            {components: [
                {kind: Anchor, name: 'DownloadLink', _attributes: {target: '_NEW'}, components: [
                    {kind: i18n, content: 'Manual Download'}
                ]}
            ]}
        ]},
        {name: 'ErrorContainer', showing: false}
    ],
    buttonComponents: [
        // {name: 'PseudoDownload', kind: Button, content: 'Pseudo - Download', ontap: 'pseudoDownload'},
        // {tag: 'span', classes: 'spacer'},
        {name: 'DownloadButton', kind: Button, ontap: 'download', components: [
            {kind: i18n, content: 'Download'},
        ]},
        {tag: 'span', classes: 'spacer'},
        {name: 'Close', kind: Button, ontap: 'close', components: [
            {kind: i18n, content: 'Close'},
        ]}     
    ],

    create: function() {
        this.inherited(arguments);

        if(this.app.statics.download_limit) {
            this.$.BibleSelect.set('parallelLimit', this.app.statics.download_limit);
        }
    },
    close: function() {
        if(!this._safeToClose()) {
            return;
        }

        this.app.set('downloadShowing', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);
        this.resetForm();

        if(is && this.app.getSelectedBiblesString() != this.bibleString) {
            // redraww the list because the URLs have changed
            this.app.debug && this.log('Need to redraw list!');
        }
    }, 
    resetForm: function() {
        this.$.Status.setShowing(false);
        this.$.RenderingComplete.setShowing(false);
        this.$.DownloadPending.setShowing(false);
        this.$.ErrorContainer.setShowing(false);
        // this.$.BibleSelect.setValue([]);
        this.$.BibleSelect.resetValue();
        this.$.FormatSelect.setSelected(0);
    },
    _formChanged: function(inSender, inEvent) {
        // this.log(inSender);
        // this.log(inEvent);
        this.$.RenderingComplete.setShowing(false);
        this.$.DownloadPending.setShowing(false);
    },
    download: function() {
        if(this.get('requestPending')) {
            return;
        }

        var bibles = this.$.BibleSelect.getValue();
        var format = this.$.FormatSelect.getValue();
        var errors = [];

        this.$.DownloadPending.set('showing', false);
        this.$.RenderingComplete.set('showing', false);
        this.$.ErrorContainer.set('showing', false);
        this.$.Status.set('showing', false);
        this.hasErrors = false;

        this.formData = {
            bible: bibles,
            format: format
        };

        var formData = {
            bible: JSON.stringify(bibles),
            format: format,
            key: this.app.configs.apiKey || null
        }

        if(bibles.length == 0) {
            errors.push( this.app.t('Please select at least one Bible') );
        }

        if(!format || format == '0') {
            errors.push( this.app.t('Please select a format') );
        }

        if(errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        var ajax = new Ajax({
            url: this.app.configs.apiUrl + '/render_needed',
            method: 'GET'
        });

        this.app.set('ajaxLoadingDelay', 100);
        this.set('requestPending', true);

        ajax.go(formData); // for GET
        ajax.response(this, 'handleRenderNeeded');
        ajax.error(this, 'handleError');
    },
    pseudoDownload: function() {
        if(this.get('requestPending')) {
            return;
        }

        this.set('requestPending', true);
    },
    requestPendingChanged: function(was, is) {
        this.$.DownloadButton.set('disabled', !!is);
        this.$.FormatSelect.set('disabled', !!is);
        this.$.BibleSelect.set('disabled', !!is);
    },
    handleError: function(inSender, inResponse) {
        // this.app.set('ajaxLoading', false);
        this.app.set('ajaxLoadingDelay', false);
        this.set('requestPending', false);
        
        try {
            var response = JSON.parse(inSender.xhrResponse.body);
        }
        catch (error) {
            response = null;
        }

        var errorMsg = this.app.t('An unknown error has occurred.');

        if(response && response.results && response.results.render_needed) {
            this.initRenderProcess();
            return;
        }

        if(response && response.errors) {
            errorMsg = response.errors.join('\n');
        }

        alert(errorMsg);
    },
    handleRenderNeeded: function(inSender, inResponse) {
        this.app.set('ajaxLoadingDelay', false);

        if(inResponse.results.success) {
            return this.sendFiles(); // send to download 
        }
        else {
            return this.initRenderProcess();
        }
    },
    sendFiles: function() {
        // TODO - only download if at least one Bible rendered successfully
        this.$.DownloadPending.set('showing', true);
        this.set('requestPending', false);
        var bibles = JSON.stringify(this.formData.bible);
        var url = this.app.configs.apiUrl + '/download?format=' + this.formData.format + '&bible=' + bibles  + this.app.configs.apiKeyStr;
        this.$.DownloadLink.set('href', url);
        // this.$.DownloadLink.set('content', url); // We need a cleaner URL format - maybe a hash or something
        this.app.debug && this.log('download url', url);
        window.location = url;
    },
    initRenderProcess: function() {
        this.set('requestPending', true);
        this.bibleQueue = utils.clone(this.formData.bible);
        this.$.RenderStatusContainer.destroyClientControls();
        this.$.Status.set('showing', true);
        this.$.Spinner.set('showing', true);
        this.renderNextBible();
    },
    renderNextBible: function() {
        if(!this.get('requestPending')) {
            return;
        }

        if(this.bibleQueue.length == 0) {
            //this.$.Spinner.set('showing', false);
            this.$.RenderingComplete.set('showing', true);
            this.$.Status.set('showing', false);
            return this.sendFiles();
        }

        var bible = this.bibleQueue.shift();
        var bibleInfo = this.app.statics.bibles[bible] || null;

        if(!bibleInfo) {
            return this.renderNextBible();
        }

        var formData = {
            bible: bible,
            format: this.formData.format,
            key: this.app.configs.apiKey || null
        };

        var comp = this.$.RenderStatusContainer.createComponent({
            classes: 'render_item',
            components: [
                {tag: 'span', _name: 'Label', classes: 'name', content: bibleInfo.name},
                {tag: 'span', _name: 'Status', classes: 'status', content: this.app.t('Rendering') + ' ...'},
                {classes: 'clear_both'}
            ],
        }).render();

        var BodyContainer = this.$.Body.hasNode();
        BodyContainer.scrollTop = BodyContainer.scrollHeight; // Force scroll to bottom

        var ajax = new Ajax({
            url: this.app.configs.apiUrl + '/render',
            method: 'GET'
        });

        // this.log('comp-controls', comp.controls);
        var StatusControl = comp.controls[1];

        this.set('requestPending', true);

        ajax.go(formData); // for GET
        ajax.response(this, function(inSender, inResponse) {
            if(inResponse.results.success) {
                var text = this.app.t('Success');
                StatusControl.set('content', text);
                StatusControl.addClass('success');
            }
            else {
                var text = this.app.t('Error');
                StatusControl.set('content', text);
                StatusControl.addClass('error');
                this.hasErrors = true;
            }

            this.renderNextBible();
        });
        ajax.error(this, function(inSender, inResponse) {
            this.hasErrors = true;

            try {
                var response = JSON.parse(inSender.xhrResponse.body);
            }
            catch(error) {
                var response = false;
            }

            if(response && response.results && response.results.success) {
                this.renderNextBible();
                return;
            }

            if(!response) {
                this._showError('An error has occurred, please try again later.');
            }
            else {
                // this._showError(null, respons.results.errors);
                this._showError('An error has occurred, please try again later.');
            }

            this.set('requestPending', false);
            this.$.Spinner.set('showing', false);
            StatusControl.set('content', this.app.t('Error'));
            StatusControl.addClass('error');
        });
    },
    abortRequest: function() {
        this.bibleQueue = [];
        this.set('requestPending', false);
    },
    _showError: function(msg, errors) {
        msg = msg ? this.app.t(msg) : null;

        this.$.ErrorContainer.destroyClientControls();

        msg && this.$.ErrorContainer.createComponent({tag: 'h3', content: msg});

        if(Array.isArray(errors) && errors.length > 0) {
            for(i in errors) {
                this.$.ErrorContainer.createComponent({tag: 'p', content: this.app.t(errors[i]) });
            }
        }

        this.$.ErrorContainer.render().setShowing(true);
    },
    _safeToClose: function() {
        if(this.get('requestPending')) {
            // Todo - restore ability to download in background.
            // Requires 3-way confirm dialog: 1) Cancel 2) Download in Background 3) Cancel Download
            // Also, need to prevent users from opening dialog when download running in background.
            // Probably could use confirm dialog for this:  1) Cancel Download 2) Continue Download, ect

            this.log('requestPending');
            var cont = confirm( this.app.t('Are you sure you want to exit?  This will end the current download.') );

            if(!cont) {
                return false;
            }
        }

        this.abortRequest();
        return true;
    }

});
