var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var Base = require('../FormatButtons/FormatButtonsBase');
var Toggle = require('../ToggleHtml');
var Image = require('../Image');
var Help = require('../dialogs/Help');
var i18n = require('../Locale/i18nContent');

module.exports = kind({
    name: 'DialogEtcButtonsHtml',
    kind: Base,
    classes: 'format_buttons_html',
    
    components: [
        {
            kind: i18n,
            classes: 'item help',
            name: 'help',
            content: '?',
            tag: 'span',
            ontap: 'handleHelp',
            attributes: {title: 'Help'}
        },
        {
            classes: 'item advanced_toggle',
            name: 'advanced_toggle',
            kind: Toggle,
            trueTitle: 'Basic',
            falseTitle: 'Advanced',
            trueContent: 'Basic',
            falseContent: 'Advanced'
        },
        {
            kind: i18n,
            classes: 'item sos',
            name: 'sos_button',
            content: 'Bible SOS',
            ontap: 'handleSos',
            attributes: {title: 'Emergency Help from the Bible'}
        },        
        {
            kind: i18n,
            classes: 'item start',
            name: 'start_button',
            content: 'Start',
            ontap: 'handleStart',
            attributes: {title: 'Bible Start Guide'}
        },        
        {
            kind: i18n,
            classes: 'item download',
            name: 'download_button',
            ontap: 'handleDownload',
            attributes: {title: 'Bible Downloads'},
            components: [
                {tag: 'span', allowHtml: true, content: '<b>&#10515;</b>&nbsp;'},
                {kind: i18n, content: 'Download'}
            ]
        },          

        {name: 'Dialogs', components: [
            {name: 'HelpDialog', kind: Help, showing: false}
        ]}
    ],

    create: function() {
        this.inherited(arguments);

        if(!this.app.statics.download_enabled) {
            this.$.download_button.set('showing', false);
        }
    },
    rendered: function() {
        this.inherited(arguments);

        if(!this._hideExtras()) {
            this.set('showing', false);
        }
    }
});
