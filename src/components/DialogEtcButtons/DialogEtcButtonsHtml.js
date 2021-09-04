var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var Base = require('../FormatButtons/FormatButtonsBase');
var Toggle = require('../ToggleHtml');
var Image = require('../Image');
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
            tag: 'span',
            ontap: 'handleHelp',
            attributes: {title: 'Help'},
            components: [
                {tag: 'b', content: '?'}
            ]
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
                {tag: 'span', classes: 'material-icons icon', content: 'download'}
            ]
        }
    ],

    bindings: [                
        {from: 'app.UserConfig.advanced_toggle', to: '$.advanced_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons advanced_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},           
    ],

    create: function() {
        this.inherited(arguments);
        this.$.Dialogs.set('showing', false);

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
