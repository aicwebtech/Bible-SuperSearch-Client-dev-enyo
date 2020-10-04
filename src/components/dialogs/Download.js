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
    width: '400px',
    height: '475px',
    classes: 'help_dialog bible_download',
    bibleString: null,
    formData: null,
    
    titleComponents: [
        {classes: 'header', components: [
            {tag: 'h3', content: 'Bible Downloads'}
        ]}
    ],
    bodyComponents: [
        {classes: 'list start_list', name: 'ListContainer'},
        {components: [
            {name: 'BibleSelect', kind: BibleSelector, downloadableOnly: true, defaultNull: true},
        ]},        
        {tag: 'br'},
        {components: [
            {name: 'FormatSelect', kind: FormatSelector},
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
                {kind: Anchor, name: 'DownloadLink', content: 'placeholder', _attributes: {target: '_NEW'}}
            ]}
        ]}
    ],
    buttonComponents: [
        {kind: Button, ontap: 'download', content: 'Download'},
        {name: 'Close', kind: Button, content: 'Close', ontap: 'close'}
    ],

    create: function() {
        this.inherited(arguments);

        if(this.app.statics.download_limit) {
            this.$.BibleSelect.set('parallelLimit', this.app.statics.download_limit);
        }
    },
    close: function() {
        this.app.set('downloadShowing', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);
        this.$.Status.setShowing(false);
        this.$.RenderingComplete.setShowing(false);
        this.$.DownloadPending.setShowing(false);
        this.$.BibleSelect.setValue([]);

        if(is && this.app.getSelectedBiblesString() != this.bibleString) {
            // redraww the list because the URLs have changed

        }
    }, 
    download: function() {
        var bibles = this.$.BibleSelect.getValue();
        var format = this.$.FormatSelect.getValue();

        this.log(bibles);
        this.log(format);

        this.formData = {
            bible: bibles,
            format: format
        };

        if(bibles.length == 0) {
            alert('Please select at least one Bible');
            return;
        }

        if(!format || format == '0') {
            alert('Please select a format');
            return;
        }

        var ajax = new Ajax({
            url: this.app.configs.apiUrl + '/render_needed',
            method: 'GET'
        });

        this.app.set('ajaxLoadingDelay', 100);
        this.requestPending = true;

        ajax.go(this.formData); // for GET
        ajax.response(this, 'handleRenderNeeded');
        ajax.error(this, 'handleError');
    },
    handleError: function(inSender, inResponse) {
        // this.app.set('ajaxLoading', false);
        this.app.set('ajaxLoadingDelay', false);
        this.requestPending = false;
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
        this.requestPending = false;

        if(inResponse.results.success) {
            return this.sendFiles(); // send to download 
        }
        else {
            return this.initRenderProcess();
        }
    },
    sendFiles: function() {
        this.$.DownloadPending.set('showing', true);
        var bibles = JSON.stringify(this.formData.bible);
        var url = this.app.configs.apiUrl + '/download?format=' + this.formData.format + '&bible=' + bibles;
        this.$.DownloadLink.set('href', url);
        this.$.DownloadLink.set('content', url);
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

        var ajax = new Ajax({
            url: this.app.configs.apiUrl + '/render',
            method: 'GET'
        });

        this.log('comp-controls', comp.controls);

        // comp.controls[1].set('content', 'Chewie');

        var StatusControl = comp.controls[1];

        this.requestPending = true;

        ajax.go(formData); // for GET
        ajax.response(this, function(inSender, inResponse) {
            if(inResponse.results.success) {

                StatusControl.set('content', 'Success');
                StatusControl.addClass('success');

                var text = 'Success';
            }
            else {
                var text = 'Error';
                StatusControl.set('content', 'Error');
                StatusControl.addClass('error');
            }

            // comp.createComponent({tag: 'span', content: '--- ' + text}).render();
            this.renderNextBible();
        });
        ajax.error(this, 'handleError');
    }

});
