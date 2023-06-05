var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Input = require('enyo/Input');
var Checkbox = require('enyo/Checkbox');
var Group = require('enyo/Group');
//var LanguageSelector = require('../Locale/LocaleSelector');
var LanguageSelector = require('../Locale/LocaleSelectorOld');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');
var inc = require('../../components/Locale/i18nComponent');
var Toggle = require('../ToggleHtml');
var ContextHelp = require('../ContextHelp');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'StartDialog',
    kind: Dialog,
    maxWidth: '350px',
    height: '475px',
    classes: 'help_dialog bible_settings',
    bibleString: null,

    handlers: {
        onActiveChanged: 'handleActiveChanged'
    },
    
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
            {name: 'Language', kind: LanguageSelector, style: 'width:120px'},
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
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Highlight'}
                ]
            },        
            falseComponent: {
                components: [
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box_outline_blank'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Highlight'}
                ]
            },
            help: true,
            helpComponents: [
                {kind: i18n, tag: 'span', content: 'highlight_description'}
            ]
        },    
        {
            classes: 'settings_toggle redletter_toggle',
            name: 'redletter_toggle',
            kind: Toggle,         
            trueTitle: 'Disable Red Letter',
            falseTitle: 'Enable Red Letter', 
            trueComponent: {
                components: [
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Red Letter'}
                ]
            },        
            falseComponent: {
                components: [
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box_outline_blank'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Red Letter'}
                ]
            },
            help: true,
            helpComponents: [
                {tag: 'span', kind: i18n, content: 'red_letter_description'},
                {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;('},
                {tag: 'span', kind: i18n, content: 'Supported Bibles Only'},
                {tag: 'span', content: '.)'}
            ]
        },
        {
            classes: 'settings_toggle italics_toggle',
            name: 'italics_toggle',
            kind: Toggle,         
            trueTitle: 'Disable Italization of Added Words',
            falseTitle: 'Enable Italization of Added Words',
            trueComponent: {
                components: [
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Italics'}
                ]
            },        
            falseComponent: {
                components: [
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box_outline_blank'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Italics'}
                ]
            },
            help: true,
            helpComponents: [
                {tag: 'span', kind: i18n, content: 'italics_description'},
                {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;('},
                {tag: 'span', kind: i18n, content: 'Supported Bibles Only'},
                {tag: 'span', content: '.)'}
            ]
        },        
        {
            classes: 'settings_toggle strongs_toggle',
            name: 'strongs_toggle',
            kind: Toggle,        
            trueTitle: 'Disable Strong\'s Numbers',
            falseTitle: 'Enable Strong\'s Numbers',
            trueComponent: {
                components: [
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {tag: 'span', content: 'Strong&rsquo;s', allowHtml: true}
                ]
            },        
            falseComponent: {
                components: [
                    {tag: 'span', classes: 'material-icons icon', content: 'check_box_outline_blank'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},       
                    {tag: 'span', content: 'Strong&rsquo;s', allowHtml: true}         
                ]
            },
            help: true,
            helpComponents: [
                {tag: 'span', kind: i18n, content: 'strongs_numbers_description'},
                {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;('},
                {tag: 'span', kind: i18n, content: 'Supported Bibles Only'},
                {tag: 'span', content: '.)'}
            ]
        },       
        {tag: 'br'},
        {
            classes: 'section', 
            components: [
                {kind: inc, content: 'Text Display', classes: 'header'},
                {
                    kind: Group,
                    name: 'render_style',
                    onActiveChanged: 'handleActiveChanged',
                    classes: 'settings_container',
                    components: [
                        {classes: 'checkbox_container checkbox_first', components: [
                            {classes: 'element', components: [
                                {kind: Checkbox, name: 'paragraph', id: 'paragraph', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'paragraph'}, classes: 'label', content: 'Paragraph Display'}
                        ]},                
                        {classes: 'checkbox_container checkbox_first', components: [
                            {classes: 'element', components: [
                                {kind: Checkbox, name: 'passage', id: 'passage', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'passage'}, classes: 'label', content: 'Passage Display'}
                        ]},                
                        {classes: 'checkbox_container checkbox_first', components: [
                            {classes: 'element', components: [
                                {kind: Checkbox, name: 'verse', id: 'verse', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'verse'}, classes: 'label', content: 'Verse Display'}
                        ]},                
                    ]
                }      
            ]
        },        
        {tag: 'br'},
        {
            classes: 'section', 
            components: [
                {kind: inc, content: 'Font Style', classes: 'header'},
                {
                    kind: Group,
                    name: 'font',
                    onActiveChanged: 'handleActiveChanged',
                    classes: 'settings_container',
                    components: [
                        {classes: 'checkbox_container checkbox_first', components: [
                            {classes: 'element', components: [
                                {kind: Checkbox, name: 'serif', id: 'serif', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'serif'}, classes: 'label', content: 'Serif', style: 'font-family: Serif'}
                        ]},                
                        {classes: 'checkbox_container checkbox_first', components: [
                            {classes: 'element', components: [
                                {kind: Checkbox, name: 'sans-serif', id: 'sans-serif', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'sans-serif'}, classes: 'label', content: 'Sans-Serif', style: 'font-family: Sans-Serif'}
                        ]},                
                        {classes: 'checkbox_container checkbox_first', components: [
                            {classes: 'element', components: [
                                {kind: Checkbox, name: 'monospace', id: 'monospace', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'monospace'}, classes: 'label', content: 'Monospace', style: 'font-family: monospace'}
                        ]},                
                    ]
                }      
            ]
        },

        // TODO: future
        // {tag: 'br'},
        // {components: [
        //    {kind: i18n, content: 'Results per Page'},
        //    {tag: 'span', allowHtml: true, content: ':&nbsp;'},
        //    {kind: Input, name: 'page_limit', attributes: {size: 1}},
        //    {tag: 'span', allowHtml: true, content: '&nbsp;'},
        //    {kind: i18n, content: 'verses'}     
        // ]},
        // {components: [
        //    {kind: i18n, content: 'Context Range'},
        //    {tag: 'span', allowHtml: true, content: ':&nbsp;'},
        //    {kind: Input, name: 'context_range', attributes: {size: 1}},
        //    {tag: 'span', allowHtml: true, content: '&nbsp;'},
        //    {kind: i18n, content: 'verses'}     
        // ]},        
        // {tag: 'br'},
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
            // console.log('Settings context_range', value, dir);
            return value;
        }},
        {from: 'app.UserConfig.page_limit', to: '$.page_limit.value', oneWay: false, transform: function(value, dir) {
            // console.log('Settings page_limit', value, dir);
            return value;
        }},
        {from: 'app.UserConfig.render_style', to: 'renderStyle', oneWay: false, transform: function(value, dir) {
            // console.log('SETTINGS renderStyle', value, dir);

            if(dir == 1 && this.$[value]) {
                this.$.render_style.set('active', this.$[value]);
                this.$[value].set('checked', true);
            }

            return value;
        }},         
        {from: 'app.UserConfig.font', to: 'font', oneWay: false, transform: function(value, dir) {
            // console.log('SETTINGS font', value, dir);

            if(dir == 1 && this.$[value]) {
                this.$.font.set('active', this.$[value]);
                this.$[value].set('checked', true);
            }

            return value;
        }},  
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

        if(is) {
            this.$.Language.handleLocaleChange();
        }
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
    },
    handleActiveChanged: function(inSender, inEvent) {
        this.app.debug && this.log(inEvent);
        var value = (inEvent.active) ? inEvent.active.name : null;       

        if(inEvent.originator.name == 'render_style') {
            this.set('renderStyle', value);
        }             

        if(inEvent.originator.name == 'font') {
            this.set('font', value);
        }        
    },
});
