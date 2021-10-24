var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Input = require('enyo/Input');
var Checkbox = require('enyo/Checkbox');
var LanguageSelector = require('../Locale/LocaleSelector');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');
var Toggle = require('../ToggleHtml');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'StartDialog',
    kind: Dialog,
    maxWidth: '400px',
    height: '475px',
    classes: 'help_dialog bible_settings',
    bibleString: null,
    
    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, tag: 'h3', content: 'Settings'}, 
            // {tag: 'h4', content: 'Here\'s a reading list to get you started'}, 
        ]}
    ],

    bodyComponents: [
        {tag: 'br'},
        {components: [
            {kind: i18n, tag: 'span', content: 'Language'},
            {tag: 'span', allowHtml: true, content: ':&nbsp;'},
            {kind: LanguageSelector},
        ]},
        {tag: 'br'},
        {
            classes: 'settings_toggle highlight_toggle',
            name: 'highlight_toggle',
            kind: Toggle,         
            trueTitle: 'Disable Highlighting of Keywords',
            falseTitle: 'Enable Highlighting of Keywords',
            trueComponent: {
                components: [
                    // {kind: Checkbox, checked: true, ntap: 'ignoreTap', disabled: true},
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Highlight'}
                ]
            },        
            falseComponent: {
                components: [
                    // {kind: Checkbox, checked: false, ntap: 'ignoreTap', disabled: true},
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box_outline_blank'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Highlight'}
                ]
            }
        },    
        {
            classes: 'settings_toggle redletter_toggle',
            name: 'redletter_toggle',
            kind: Toggle,         
            trueTitle: 'Disable Red Letter',
            falseTitle: 'Enable Red Letter', 
            trueComponent: {
                components: [
                    // {kind: Checkbox, checked: true, ontap: 'ignoreTap'},
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Red Letter'}
                ]
            },        
            falseComponent: {
                components: [
                    // {kind: Checkbox, checked: false, ontap: 'ignoreTap'},
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box_outline_blank'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Red Letter'}
                ]
            }
        },
        {
            classes: 'settings_toggle italics_toggle',
            name: 'italics_toggle',
            kind: Toggle,         
            trueTitle: 'Disable Italization of Added Words',
            falseTitle: 'Enable Italization of Added Words',
            trueComponent: {
                components: [
                    // {kind: Checkbox, checked: true, ontap: 'ignoreTap'},
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Italics'}
                ]
            },        
            falseComponent: {
                components: [
                    // {kind: Checkbox, checked: false, ontap: 'ignoreTap'},
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box_outline_blank'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Italics'}
                ]
            }
        },        
        {
            classes: 'settings_toggle strongs_toggle',
            name: 'strongs_toggle',
            kind: Toggle,        
            trueTitle: 'Disable Strong\'s Numbers',
            falseTitle: 'Enable Strong\'s Numbers',
            trueComponent: {
                components: [
                    // {kind: Checkbox, checked: true, ontap: 'ignoreTap'},
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {tag: 'span', content: 'Strong&rsquo;s', allowHtml: true}
                ]
            },        
            falseComponent: {
                components: [
                    // {kind: Checkbox, checked: false, ontap: 'ignoreTap'},
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box_outline_blank'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {tag: 'span', content: 'Strong&rsquo;s', allowHtml: true}
                ]
            }
        },       
        {tag: 'br'},
        {components: [
           {kind: i18n, content: 'Results per Page'},
           {tag: 'span', allowHtml: true, content: ':&nbsp;'},
           {kind: Input, name: 'page_limit', attributes: {size: 1}},
           {tag: 'span', allowHtml: true, content: '&nbsp;'},
           {kind: i18n, content: 'verses'}     
        ]},
        {components: [
           {kind: i18n, content: 'Context Range'},
           {tag: 'span', allowHtml: true, content: ':&nbsp;'},
           {kind: Input, name: 'context_range', attributes: {size: 1}},
           {tag: 'span', allowHtml: true, content: '&nbsp;'},
           {kind: i18n, content: 'verses'}     
        ]},        
        {tag: 'br'},
        {tag: 'br'}
    ],

    buttonComponents: [
        {name: 'Close', kind: Button, ontap: 'close', components: [
            {kind: i18n, content: 'Close'},
        ]}
    ],

    bindings: [    
        {from: 'app.UserConfig.italics', to: '$.italics_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons italics', value, dir);
            return value;
        }},         
        {from: 'app.UserConfig.strongs', to: '$.strongs_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons strongs', value, dir);
            return value;
        }},             
        {from: 'app.UserConfig.red_letter', to: '$.redletter_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons red_letter', value, dir);
            return value;
        }},
        {from: 'app.UserConfig.highlight', to: '$.highlight_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons red_letter', value, dir);
            return value;
        }},        
        {from: 'app.UserConfig.context_range', to: '$.context_range.value', oneWay: false, transform: function(value, dir) {
            console.log('Settings context_range', value, dir);
            return value;
        }},
        {from: 'app.UserConfig.page_limit', to: '$.page_limit.value', oneWay: false, transform: function(value, dir) {
            console.log('Settings page_limit', value, dir);
            return value;
        }}
    ],

    handlers: {
        onLocaleChange: 'localeChanged',
    },

    create: function() {
        if(this.multiColumn) {
            this.width = '1200px';
        }

        this.inherited(arguments);
    },
    close: function() {
        this.app.set('settingsShowing', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);


    },
    listChanged: function(was, is) {
        this.populateList();
        this.$.ListContainer.render();
    },

    ignoreTap: function(inSender, inEvent) {
        this.log();
        inEvent.preventDefault();
        return true;
    },
    localeChanged: function(inSender, inEvent) {
        // this.render();
    }
});
