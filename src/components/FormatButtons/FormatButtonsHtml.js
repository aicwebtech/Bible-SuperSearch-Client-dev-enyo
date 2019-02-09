var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var Base = require('./FormatButtonsBase');
var Toggle = require('../ToggleHtml');
var Image = require('../Image');
var Help = require('../dialogs/Help');

module.exports = kind({
    name: 'FormatButtonsBase',
    kind: Base,
    classes: 'format_buttons_html',
    
    components: [
        {
            classes: 'item size_plus',
            name: 'size_plus',
            tag: 'span',
            val: 'plus',
            ontap: 'handleSizeChange',
            content: 'A+',
            attributes: {
                title: 'Enlarge Text'
            }
        },      
        {
            classes: 'item size_reg',
            name: 'size_reg',
            val: 'reg',
            ontap: 'handleSizeChange',
            content: 'A =',
            components: [
                {tag:'span', content: 'A'},
                {tag: 'sub', content: '0'}
            ],
            tag: 'span',
            attributes: {
                title: 'Default Text Size',
            },
        },        
        {
            classes: 'item size_minus',
            name: 'size_minus',
            val: 'minus',
            ontap: 'handleSizeChange',
            content: 'A-',
            tag: 'span',
            attributes: {
                title: 'Shrink Text'
            }
        },
        {
            classes: 'item font_serif',
            name: 'font_serif',
            ontap: 'handleFontChange',
            val: 'serif',
            content: 'Abc',
            tag: 'span',
            attributes: {
                title: 'Serif'
            }
        },        
        {
            classes: 'item font_sans_serif',
            name: 'font_sans_serif',
            ontap: 'handleFontChange',
            val: 'sans_serif',
            content: 'Abc',
            tag: 'span',
            attributes: {
                title: 'Sans Serif',
            }
        },
        {
            classes: 'item font_monospace',
            name: 'font_monospace',
            ontap: 'handleFontChange',
            val: 'monospace',
            content: 'Abc',
            tag: 'span',
            attributes: {
                title: 'Monospace',
            }
        },
        {
            classes: 'item paragraph_toggle',
            name: 'paragraph_toggle',
            kind: Toggle,
            trueContent: 'Verse Display',
            falseContent: '&para;',
            trueTitle: 'Verse Display',
            falseTitle: 'Paragraph Display',
            // trueComponent: {
            //     components: [
            //         {}
            //     ]
            // },
            falseComponent: {
                allowHtml: true
            }
        },
        {
            classes: 'item copy_toggle',
            name: 'copy_toggle',
            kind: Toggle,
            trueContent: 'Read Display',
            falseContent: 'Copy Display',            
            trueTitle: 'Read Display',
            falseTitle: 'Copy Display'
        },        
        {
            classes: 'item italics_toggle',
            name: 'italics_toggle',
            kind: Toggle,
            trueContent: 'I',
            falseContent: 'I',           
            trueTitle: 'Disable Italization of Added Words',
            falseTitle: 'Enable Italization of Added Words'
        },        
        {
            classes: 'item strongs_toggle',
            name: 'strongs_toggle',
            kind: Toggle,
            trueContent: 'Disable Strongs',
            falseContent: 'Enable Strongs',            
            trueTitle: 'Disable Strongs Numbers',
            falseTitle: 'Enable Strongs Numbers'
        },        
        {
            classes: 'item redletter_toggle',
            name: 'redletter_toggle',
            kind: Toggle,
            trueContent: 'Disable Red Letter',
            falseContent: 'Enable Red Letter',            
            trueTitle: 'Disable Red Letter',
            falseTitle: 'Enable Red Letter', 
            trueComponent: {
                components: [
                    {classes: 'block_enabled', _content: '&#10003;', allowHtml: true},
                    {tag: 'span', content: 'Red Letter'}
                ]
            },        
            falseComponent: {
                components: [
                    {classes: 'block_disabled', _content: ' ', allowHtml: true},
                    {tag: 'span', content: 'Red Letter'}
                ]
            }
        },
        {
            classes: 'item help',
            name: 'help',
            content: '?',
            tag: 'span',
            ontap: 'handleHelp'
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
        
        {name: 'Dialogs', components: [
            {name: 'HelpDialog', kind: Help, showing: false}
        ]}
    ],

    bindings: [    
        {from: 'app.UserConfig.paragraph', to: '$.paragraph_toggle.value', oneWay: false, transform: function(value, dir) {
            console.log('FormatButtons paragraph_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},         
        {from: 'app.UserConfig.copy', to: '$.copy_toggle.value', oneWay: false, transform: function(value, dir) {
            console.log('FormatButtons copy_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},             
        {from: 'app.UserConfig.advanced_toggle', to: '$.advanced_toggle.value', oneWay: false, transform: function(value, dir) {
            console.log('FormatButtons advanced_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},           
        {from: 'app.UserConfig.italics', to: '$.italics_toggle.value', oneWay: false, transform: function(value, dir) {
            console.log('FormatButtons italics', value, dir);
            return value;
        }},         
        {from: 'app.UserConfig.strongs', to: '$.strongs_toggle.value', oneWay: false, transform: function(value, dir) {
            console.log('FormatButtons strongs', value, dir);
            return value;
        }},             
        {from: 'app.UserConfig.red_letter', to: '$.redletter_toggle.value', oneWay: false, transform: function(value, dir) {
            console.log('FormatButtons red_letter', value, dir);
            return value;
        }}
    ],

    create: function() {
        this.inherited(arguments);
    }
});
