var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var Base = require('../FormatButtonsBase');
var Toggle = require('../../Toggle');

module.exports = kind({
    name: 'FormatButtonsClassic',
    kind: Base,
    
    components: [
        {kind: Checkbox, name: 'copy'},
        {tag: 'span', content: ' Copy'},
        {kind: Checkbox, name: 'paragraph'},
        {tag: 'span', content: ' Paragraph'},
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
        }
    ],

    bindings: [
        {from: 'app.UserConfig.paragraph', to: '$.paragraph.checked', oneWay: false, transform: function(value, dir) {
            console.log('paragraph', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},         
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
        {from: 'app.UserConfig.copy', to: '$.copy.checked', oneWay: false, transform: function(value, dir) {
            console.log('copy', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }}
    ]

});
