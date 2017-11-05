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
