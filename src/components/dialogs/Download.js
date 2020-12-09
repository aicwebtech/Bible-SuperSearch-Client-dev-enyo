var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var utils = require('enyo/utils');
var Image = require('../Image');

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
    width: '500px',
    height: '410px',
    classes: 'help_dialog bible_download',
    bibleString: null,
    formData: null,
    requestPending: false,
    hasErrors: false,
    
    titleComponents: [
        {classes: 'header', components: [
            {tag: 'h3', content: 'Bible Downloads'}
        ]}
    ],
    bodyComponents: [
        {classes: 'list start_list', name: 'ListContainer'},
        {tag: 'h5', content: 'Select Bible(s)'},
        {components: [
            {
                name: 'BibleSelect', 
                kind: BibleSelector, 
                downloadableOnly: true, 
                defaultNull: true,
                selectorWidth: 350
            },
        ]},        
        {tag: 'h5', content: 'Select a Format'},
        // {tag: 'br'},
        {components: [
            {name: 'FormatSelect', kind: FormatSelector, style: 'width: 350px'},
        ]},
        {tag: 'br'},
        {name: 'Status', showing: false, components: [
            {name: 'Spinner', kind: Image, relSrc: '/Spinner.gif'},
            {tag: 'h4', content: 'Rendering Bibles, this may take some time'},
            {name: 'RenderStatusContainer', classes: 'render_list'}
        ]},
        {name: 'RenderingComplete', tag: 'h4', content: 'Rendering is Complete', showing: false},
        {name: 'DownloadPending', showing: false, components: [
            {tag: 'h4', content: 'Your download should begin shortly'},
            {content: 'If not, please click on the below link:'},
            {tag: 'br'},
            {components: [
                {kind: Anchor, name: 'DownloadLink', content: 'Manual Download', _attributes: {target: '_NEW'}}
            ]}
        ]}
    ],
    buttonComponents: [
        {name: 'PseudoDownload', kind: Button, content: 'Pseudo - Download', ontap: 'pseudoDownload'},
        {tag: 'span', classes: 'spacer'},
        {name: 'DownloadButton', kind: Button, ontap: 'download', content: 'Download'},
        {tag: 'span', classes: 'spacer'},
        {name: 'Close', kind: Button, content: 'Close', ontap: 'close'}        
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
        // this.$.BibleSelect.setValue([]);
        this.$.BibleSelect.resetValue();
        this.$.FormatSelect.setSelected(0);
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
        this.$.Status.set('showing', false);
        this.hasErrors = false;

        this.formData = {
            bible: bibles,
            format: format
        };

        if(bibles.length == 0) {
            errors.push('Please select at least one Bible');
        }

        if(!format || format == '0') {
            errors.push('Please select a format');
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

        ajax.go(this.formData); // for GET
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
    },
    handleError: function(inSender, inResponse) {
        // this.app.set('ajaxLoading', false);
        this.app.set('ajaxLoadingDelay', false);
        this.set('requestPending', false);
        var response = JSON.parse(inSender.xhrResponse.body);

        if(response.error_level == 4) {
            // this.bubble('onFormResponseError', {formData: this._formDataAsSubmitted, response: response});
        }
        else {
            this.initRenderProcess();
        }
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
        var url = this.app.configs.apiUrl + '/download?format=' + this.formData.format + '&bible=' + bibles;
        this.$.DownloadLink.set('href', url);
        // this.$.DownloadLink.set('content', url); // We need a cleaner URL format - maybe a hash or something
        this.log(url);
        window.location = url;
    },
    initRenderProcess: function() {
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
        var bibleInfo = this.app.statics.bibles[bible];

        var formData = {
            bible: bible,
            format: this.formData.format
        };

        var comp = this.$.RenderStatusContainer.createComponent({
            classes: 'render_item',
            components: [
                {tag: 'span', _name: 'Label', classes: 'name', content: bibleInfo.name},
                {tag: 'span', _name: 'Status', classes: 'status', content: 'Rendering ...'},
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
                var text = 'Success';
                StatusControl.set('content', 'Success');
                StatusControl.addClass('success');
            }
            else {
                var text = 'Error';
                StatusControl.set('content', 'Error');
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

            }

            StatusControl.set('content', 'Error');
            StatusControl.addClass('error');
            this.renderNextBible();
        });
    },
    abortRequest: function() {
        this.bibleQueue = [];
        this.set('requestPending', false);
    },
    _safeToClose: function() {
        this.log('_safeToClose');

        if(this.get('requestPending')) {
            this.log('requestPending');
            var cont = confirm('Are you sure you want to exit?  This will end the current download.');

            if(!cont) {
                return false;
            }
        }

        this.abortRequest();
        return true;
    }

});
