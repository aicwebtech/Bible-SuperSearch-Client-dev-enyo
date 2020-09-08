var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');

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
    classes: 'help_dialog bible_start',
    bibleString: null,
    
    titleComponents: [
        {classes: 'header', components: [
            {tag: 'h3', content: 'Bible Downloads'}
        ]}
    ],

    bodyComponents: [
        {classes: 'list start_list', name: 'ListContainer'},
        {components: [
            {name: 'BibleSelect', kind: BibleSelector, downloadableOnly: true},
        ]},        
        {components: [
            {name: 'FormatSelect', kind: FormatSelector},
        ]},

    ],

    buttonComponents: [
        {name: 'Close', kind: Button, content: 'Close', ontap: 'close'}
    ],

    create: function() {

        this.inherited(arguments);
    },
    close: function() {
        this.app.set('downloadShowing', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);

        if(is && this.app.getSelectedBiblesString() != this.bibleString) {
            // redraww the list because the URLs have changed

        }
    }
});
