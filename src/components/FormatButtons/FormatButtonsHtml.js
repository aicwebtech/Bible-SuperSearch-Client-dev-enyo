var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var Base = require('./FormatButtonsBase');
var Toggle = require('../ToggleHtml');
var Image = require('../Image');
var Help = require('../dialogs/Help');
var i18n = require('../Locale/i18nContent');
var LocaleSelector = require('../Locale/LocaleSelector');

module.exports = kind({
    name: 'FormatButtonsHtml',
    kind: Base,
    classes: 'format_buttons_html',
    
    components: [
        {
            kind: i18n,
            classes: 'item size size_plus',
            name: 'size_plus',
            tag: 'span',
            val: 'plus',
            ontap: 'handleSizeChange',
            components: [
                {kind: i18n, content: 'A'},
                {tag: 'span', content: '+'},
            ],
            attributes: {
                title: 'Enlarge Text'
            }
        },      
        {
            kind: i18n,
            classes: 'item size size_reg',
            name: 'size_reg',
            val: 'reg',
            ontap: 'handleSizeChange',
            tag: 'span',
            attributes: {
                title: 'Default Text Size',
            },
            components: [
                {tag: 'span', content: '&nbsp;', allowHtml: true},
                {kind: i18n, content: 'A'},
                {tag: 'span', content: '&nbsp;', allowHtml: true},
            ]
        },  
        {
            kind: i18n,
            classes: 'item size size_minus',
            name: 'size_minus',
            val: 'minus',
            ontap: 'handleSizeChange',
            tag: 'span',
            components: [
                {kind: i18n, content: 'A'},
                {tag: 'span', content: '-'},
            ],
            attributes: {
                title: 'Shrink Text'
            }
        },
        {
            kind: i18n,
            classes: 'item font font_serif',
            name: 'font_serif',
            ontap: 'handleFontChange',
            val: 'serif',
            tag: 'span',
            attributes: {
                title: 'Serif'
            },
            components: [
                {kind: i18n,  content: 'Abc'}
            ]
        },        
        {
            kind: i18n,
            classes: 'item font font_sans_serif',
            name: 'font_sans_serif',
            ontap: 'handleFontChange',
            val: 'sans_serif',
            tag: 'span',
            attributes: {
                title: 'Sans-Serif',
            },
            components: [
                {kind: i18n, content: 'Abc'}
            ]
        },
        {
            kind: i18n,
            classes: 'item font font_monospace',
            name: 'font_monospace',
            ontap: 'handleFontChange',
            val: 'monospace',
            tag: 'span',
            attributes: {
                title: 'Monospace',
            },
            components: [
                {kind: i18n, content: 'Abc'}
            ],
        },
        {
            classes: 'item paragraph_toggle',
            name: 'paragraph_toggle',
            kind: Toggle,
            trueContent: 'Verse Display',
            falseContent: '&para;',
            trueTitle: 'Verse Display',
            falseTitle: 'Paragraph Display',
            trueComponent: {
                components: [
                    {tag: 'span', content: '- ------', allowHtml: true},
                    {tag: 'span', content: '- ------', allowHtml: true},
                    {tag: 'span', content: '- ------', allowHtml: true},
                    {tag: 'span', content: '- ------', allowHtml: true}
                    // {tag: 'span', content: '- &mdash;-&ndash;', allowHtml: true},
                    // {tag: 'span', content: '- &mdash;&ndash;-', allowHtml: true},
                    // {tag: 'span', content: '- -&ndash;&mdash;', allowHtml: true},
                    // {tag: 'span', content: '- &ndash;&mdash;-', allowHtml: true}
                ]
            },
            falseComponent: {
                allowHtml: true
            }
        },
        {
            classes: 'item copy_toggle',
            name: 'copy_toggle',
            kind: Toggle,            
            trueTitle: 'Read Display',
            falseTitle: 'EZ Copy',
            trueComponent: {
                components: [
                    {tag: 'span', classes: 'buttons', content: '<< < = > >>', allowHtml: true},
                    {tag: 'span', content: '', allowHtml: true},
                    {tag: 'span', content: '- &ndash;&mdash;&ndash;', allowHtml: true},
                    {tag: 'span', content: '- &ndash;&mdash;&ndash;', allowHtml: true}
                ]
            },
            falseComponent: {
                components: [
                    {tag: 'span', content: '- ------', allowHtml: true},
                    {tag: 'span', content: '- ------', allowHtml: true},
                    {tag: 'span', content: '- ------', allowHtml: true},
                    {tag: 'span', content: '- ------', allowHtml: true},
                    // {tag: 'span', content: '- &mdash;&ndash;-&ndash;', allowHtml: true},
                    // {tag: 'span', content: '- &mdash;&ndash;-&ndash;', allowHtml: true},
                    // {tag: 'span', content: '- -&ndash;&mdash;&ndash;', allowHtml: true},
                    // {tag: 'span', content: '- &ndash;&ndash;&mdash;-', allowHtml: true},
                    {tag: 'span', content: ''},
                    {tag: 'span', content: ''},
                    {tag: 'span', content: ''}
                ]
            },
        },        
        {
            classes: 'item italics_toggle',
            name: 'italics_toggle',
            kind: Toggle,         
            trueTitle: 'Disable Italization of Added Words',
            falseTitle: 'Enable Italization of Added Words',
            trueComponent: {
                components: [
                    {tag: 'span', classes: 'block_enabled', content: '&#10003;', allowHtml: true},
                    {kind: i18n, tag: 'span', content: 'Italics'}
                ]
            },        
            falseComponent: {
                components: [
                    {tag: 'span', classes: 'block_disabled', allowHtml: true},
                    {kind: i18n, tag: 'span', content: 'Italics'}
                ]
            }
        },        
        {
            classes: 'item strongs_toggle',
            name: 'strongs_toggle',
            kind: Toggle,        
            trueTitle: 'Disable Strong\'s Numbers',
            falseTitle: 'Enable Strong\'s Numbers',
            trueComponent: {
                components: [
                    {tag: 'span', classes: 'block_enabled', content: '&#10003;', allowHtml: true},
                    {tag: 'span', content: 'Strong&rsquo;s', allowHtml: true}
                ]
            },        
            falseComponent: {
                components: [
                    {tag: 'span', classes: 'block_disabled', allowHtml: true},
                    {tag: 'span', content: 'Strong&rsquo;s', allowHtml: true}
                ]
            }
        },        
        {
            classes: 'item redletter_toggle',
            name: 'redletter_toggle',
            kind: Toggle,         
            trueTitle: 'Disable Red Letter',
            falseTitle: 'Enable Red Letter', 
            trueComponent: {
                components: [
                    {tag: 'span', classes: 'block_enabled', content: '&#10003;', allowHtml: true},
                    {kind: i18n, tag: 'span', content: 'Red Letter'}
                ]
            },        
            falseComponent: {
                components: [
                    {tag: 'span', classes: 'block_disabled', allowHtml: true},
                    {kind: i18n, tag: 'span', content: 'Red Letter'}
                ]
            }
        },
        // 'Extra' (non-formatting) buttons
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
        // End Extra buttons
        {
            kind: i18n,
            classes: 'item print',
            name: 'print_button',
            ontap: 'handlePrint',
            attributes: {title: 'Printer Friendly'},
            components: [
                {tag: 'span', allowHtml: true, content: '&#128438;&nbsp;'},
                {kind: i18n, content: 'Print'}
            ],
        },

        {classes: 'input_row_wide', components: [
            {name: 'Locale', kind: LocaleSelector}
        ]},  
        
        {name: 'Dialogs', components: [
            {name: 'HelpDialog', kind: Help, showing: false}
        ]}
    ],

    bindings: [    
        {from: 'app.UserConfig.paragraph', to: '$.paragraph_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons paragraph_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},         
        {from: 'app.UserConfig.copy', to: '$.copy_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons copy_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},             
        {from: 'app.UserConfig.advanced_toggle', to: '$.advanced_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons advanced_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},           
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
        }}
    ],

    create: function() {
        this.inherited(arguments);

        if(!this.app.statics.download_enabled) {
            this.$.download_button.set('showing', false);
        }
    }, 
    rendered: function() {
        this.inherited(arguments);

        if(this._hideExtras()) {
            this.$.sos_button.set('showing', false);
            this.$.start_button.set('showing', false);
            this.$.download_button.set('showing', false);
            this.$.help.set('showing', false);
        }
    }
});
