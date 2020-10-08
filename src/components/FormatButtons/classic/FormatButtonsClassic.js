var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var Base = require('../FormatButtonsBase');
var Toggle = require('../../Toggle');
var Image = require('../../Image');
var Help = require('../../dialogs/Help');

module.exports = kind({
    name: 'FormatButtonsClassic',
    kind: Base,
    classes: 'format_buttons_classic',
    
    components: [
        // {kind: Checkbox, name: 'copy'},
        // {tag: 'span', content: ' Copy'},
        // {kind: Checkbox, name: 'paragraph'},
        // {tag: 'span', content: ' Paragraph'},

        {
            name: 'size_plus',
            kind: Image,
            relSrc: 'classic/formatting/large.jpg',
            tag: 'span',
            val: 'plus',
            ontap: 'handleSizeChange',
            alt: 'Enlarge Text'
        },      
        {
            name: 'size_reg',
            kind: Image,
            relSrc: 'classic/formatting/med.jpg',
            val: 'reg',
            ontap: 'handleSizeChange',
            alt: 'Default Text Size'
        },        
        {
            name: 'size_minus',
            kind: Image,
            relSrc: 'classic/formatting/small.jpg',
            val: 'minus',
            ontap: 'handleSizeChange',
            alt: 'Shrink Text'
        },
        {
            name: 'font_serif',
            kind: Image,
            relSrc: 'classic/formatting/serif.jpg',
            ontap: 'handleFontChange',
            val: 'serif',
            alt: 'Serif'
        },        
        
        // Not yet implemented!

        {
            name: 'font_sans_serif',
            kind: Image,
            relSrc: 'classic/formatting/sans-serif.jpg',
            ontap: 'handleFontChange',
            val: 'sans_serif',
            alt: 'Sans Serif'
        },
        {
            name: 'font_monospace',
            kind: Image,
            relSrc: 'classic/formatting/monospace.jpg',
            ontap: 'handleFontChange',
            val: 'monospace',
            alt: 'Monospace'
        },
        {
            name: 'paragraph_toggle',
            kind: Toggle,
            trueImage: 'classic/formatting/verse_display.jpg',
            falseImage: 'classic/formatting/paragraph_display.jpg',
            trueAlt: 'Verse Display',
            falseAlt: 'Paragraph Display'
        },
        {
            name: 'copy_toggle',
            kind: Toggle,
            trueImage: 'classic/formatting/ez-copy-off.jpg',
            falseImage: 'classic/formatting/ez-copy-on.jpg',
            trueAlt: 'Read Display',
            falseAlt: 'Copy Display'
        },        
        {
            name: 'italics_toggle',
            kind: Toggle,
            // trueImage: 'classic/formatting/italics_disable.jpg',
            // falseImage: 'classic/formatting/italics_enable.jpg',            
            trueImage: 'classic/formatting/italics_enable_new.png',
            falseImage: 'classic/formatting/italics_disable_new.png',
            trueAlt: 'Disable Italization of Added Words',
            falseAlt: 'Enable Italization of Added Words'
        },        
        {
            name: 'strongs_toggle',
            kind: Toggle,
            // trueImage: 'classic/formatting/strongs_disable.jpg',
            // falseImage: 'classic/formatting/strongs_enable.jpg',            
            trueImage: 'classic/formatting/strongs_enable_new.png',
            falseImage: 'classic/formatting/strongs_disable_new.png',
            trueAlt: 'Disable Strongs Numbers',
            falseAlt: 'Enable Strongs Numbers'
        },        
        {
            name: 'redletter_toggle',
            kind: Toggle,
            // trueImage: 'classic/formatting/redletter_disable.jpg',
            // falseImage: 'classic/formatting/redletter_enable.jpg',            
            trueImage: 'classic/formatting/red_enable_new.png',
            falseImage: 'classic/formatting/red_disable_new.png',
            trueAlt: 'Disable Red Letter',
            falseAlt: 'Enable Red Letter'
        },
        {
            name: 'help',
            kind: Image,
            relSrc: 'classic/formatting/help.jpg',
            ontap: 'handleHelp'
        },
        {
            name: 'advanced_toggle',
            kind: Toggle,
            trueImage: 'classic/formatting/basic.jpg',
            falseImage: 'classic/formatting/advanced.jpg',
            trueAlt: 'Basic',
            falseAlt: 'Advanced'
        },
        {
            classes: 'item sos',
            name: 'sos_button',
            content: 'Bible SOS',
            ontap: 'handleSos'
        },        
        {
            classes: 'item start',
            name: 'start_button',
            content: 'Start',
            ontap: 'handleStart',
            attributes: {title: 'Bible Start Guide'}
        },        
        {
            classes: 'item download',
            name: 'download_button',
            content: '&#11123;&nbsp;',
            allowHtml: true,
            ontap: 'handleDownload',
            attributes: {title: 'Bible Downloads'}
        },

        {name: 'Dialogs', components: [
            {name: 'HelpDialog', kind: Help, showing: false}
        ]}
    ],

    bindings: [
        // {from: 'app.UserConfig.paragraph', to: '$.paragraph.checked', oneWay: false, transform: function(value, dir) {
        //     console.log('paragraph', value, dir);
        //     return value;
        //     // return (value && value != 0 && value != false) ? true : false;
        // }},         
        {from: 'app.UserConfig.paragraph', to: '$.paragraph_toggle.value', oneWay: false, transform: function(value, dir) {
            console.log('paragraph_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},         
        {from: 'app.UserConfig.copy', to: '$.copy_toggle.value', oneWay: false, transform: function(value, dir) {
            console.log('copy_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},             
        {from: 'app.UserConfig.advanced_toggle', to: '$.advanced_toggle.value', oneWay: false, transform: function(value, dir) {
            console.log('advanced_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},           
        {from: 'app.UserConfig.italics', to: '$.italics_toggle.value', oneWay: false, transform: function(value, dir) {
            console.log('italics', value, dir);
            return value;
        }},         
        {from: 'app.UserConfig.strongs', to: '$.strongs_toggle.value', oneWay: false, transform: function(value, dir) {
            console.log('strongs', value, dir);
            return value;
        }},             
        {from: 'app.UserConfig.red_letter', to: '$.redletter_toggle.value', oneWay: false, transform: function(value, dir) {
            console.log('red_letter', value, dir);
            return value;
        }},     
        // {from: 'app.UserConfig.copy', to: '$.copy.checked', oneWay: false, transform: function(value, dir) {
        //     console.log('copy', value, dir);
        //     return value;
        //     // return (value && value != 0 && value != false) ? true : false;
        // }}
    ],

    create: function() {
        this.inherited(arguments);
    }
});
