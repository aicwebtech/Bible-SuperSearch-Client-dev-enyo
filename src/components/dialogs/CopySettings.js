var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Group = require('enyo/Group');
var Signal = require('../Signal');


var Input = require('../../components/Locale/i18nInput');
var Checkbox = require('enyo/Checkbox');
var inc = require('../../components/Locale/i18nComponent');
var i18n = require('../../components/Locale/i18nContent');

// This might be converted to an actual dialog some day
module.exports = kind({
    name: 'CopySettings',
    classes: 'biblesupersearch_copy_settings',
    textFormat: null,
    passageFormat: null,
    preset: null,

    components: [
        {
            classes: 'presets',
            components: [
                {kind: Button, content: 'Verse'},
                {kind: Button, content: 'Outline'},
                {kind: Button, content: 'Something Else'}
            ]
        },
        {
            classes: 'settings',
            components: [
                {
                    classes: 'section',
                    components: [
                        {kind: inc, content: 'Single Verses', classes: 'header'},
                        {
                            kind: Group,
                            name: 'text_format',
                            components: [
                                {classes: 'checkbox_container checkbox_first', components: [
                                    {classes: 'element', components: [
                                        {kind: Checkbox, name: 'reference_text', id: 'reference_text', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'reference_text'}, classes: 'label', content: 'Reference - Text'}
                                ]},                
                                {classes: 'checkbox_container checkbox_first', components: [
                                    {classes: 'element', components: [
                                        {kind: Checkbox, name: 'text_reference', id: 'text_reference', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'text_reference'}, classes: 'label', content: 'Text - Reference'}
                                ]},                
                                {classes: 'checkbox_container checkbox_first', components: [
                                    {classes: 'element', components: [
                                        {kind: Checkbox, name: 'text_only', id: 'text_only', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'text_only'}, classes: 'label', content: 'Text Only'}
                                ]},                
                                // {classes: 'checkbox_container checkbox_first', components: [
                                //     {classes: 'element', components: [
                                //         {kind: Checkbox, name: 'reference_only', id: 'reference_only', type: 'radio'}
                                //     ]},
                                //     {kind: i18n, tag: 'label', attributes: {for: 'reference_only'}, classes: 'label', content: 'Reference Only'}
                                // ]}
                            ]
                        },  
                        {classes: 'checkbox_container checkbox_first', components: [
                            {classes: 'element', components: [
                                {kind: Checkbox, name: 'separate_line', id: 'separate_line'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'separate_line'}, classes: 'label', content: 'Separate Line'}
                        ]},        
                    ]
                },
                {
                    classes: 'section',
                    components: [
                        {kind: inc, content: 'Multi-verse Passages', classes: 'header'},
                        {
                            kind: Group,
                            name: 'passage_format',
                            components: [
                                {classes: 'checkbox_container checkbox_first', components: [
                                    {classes: 'element', components: [
                                        {kind: Checkbox, name: 'reference_passage', id: 'reference_passage', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'reference_passage'}, classes: 'label', content: 'Reference - Passage'}
                                ]},                
                                {classes: 'checkbox_container checkbox_first', components: [
                                    {classes: 'element', components: [
                                        {kind: Checkbox, name: 'passage_reference', id: 'passage_reference', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'passage_reference'}, classes: 'label', content: 'Passage - Reference'}
                                ]},                
                                {classes: 'checkbox_container checkbox_first', components: [
                                    {classes: 'element', components: [
                                        {kind: Checkbox, name: 'passage_only', id: 'passage_only', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'passage_only'}, classes: 'label', content: 'Passage Only'}
                                ]}
                            ]
                        },        
                        {classes: 'checkbox_container checkbox_first', components: [
                            {classes: 'element', components: [
                                {kind: Checkbox, name: 'passage_verse_number', id: 'passage_verse_number'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'passage_verse_number'}, classes: 'label', content: 'Show Verse Number'}
                        ]},
                    ]
                },
                {
                    classes: 'section',
                    components: [              
                        {kind: inc, content: 'Other', classes: 'header'},
                        {classes: 'checkbox_container checkbox_first', components: [
                            {classes: 'element', components: [
                                {kind: Checkbox, name: 'abbr_book', id: 'abbr_book'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'abbr_book'}, classes: 'label', content: 'Abbreviate Books'}
                        ]},
                        {classes: 'checkbox_container checkbox_first', components: [
                            {classes: 'element', components: [
                                {kind: Checkbox, name: 'omit_extra_br', id: 'omit_extra_br'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'omit_extra_br'}, classes: 'label', content: 'Omit Extra Line Breaks'}
                        ]},                
                    ]
                },
                {classes: 'clear-both'}
            ]
        }
        
    ],

    bindings: [    
        {from: 'app.UserConfig.copy_separate_line', to: '$.separate_line.checked', oneWay: false, transform: function(value, dir) {
            console.log('Copy separate_line', value, dir);
            return value;
        }},         
        {from: 'app.UserConfig.copy_omit_extra_br', to: '$.omit_extra_br.checked', oneWay: false, transform: function(value, dir) {
            console.log('Copy omit_extra_br', value, dir);
            return value;
        }},        
        {from: 'app.UserConfig.copy_abbr_book', to: '$.abbr_book.checked', oneWay: false, transform: function(value, dir) {
            console.log('Copy abbr_book', value, dir);
            return value;
        }},            
        {from: 'app.UserConfig.copy_passage_verse_number', to: '$.passage_verse_number.checked', oneWay: false, transform: function(value, dir) {
            console.log('Copy passage_verse_number', value, dir);
            return value;
        }},             
        {from: 'app.UserConfig.copy_text_format', to: 'textFormat', oneWay: false, transform: function(value, dir) {
            console.log('Copy textFormat', value, dir);

            if(dir == 1 && this.$[value]) {
                console.log('Copy textFormat setActive');
                this.$.text_format.set('active', this.$[value]);
                this.$[value].set('checked', true);
            }

            return value;
        }},
        {from: 'app.UserConfig.copy_passage_format', to: 'passageFormat', oneWay: false, transform: function(value, dir) {
            console.log('Copy passageFormat', value, dir);

            if(dir == 1 && this.$[value]) {
                console.log('Copy passageFormat setActive');
                this.$.passage_format.set('active', this.$[value]);
                this.$[value].set('checked', true);
            }

            return value;
        }}
    ],

    handlers: {
        onActiveChanged: 'handleActiveChanged'
    },

    create: function() {
        this.inherited(arguments);
        // this.$.text_format.set('active', this.$.text_reference);
    },

    handleActiveChanged: function(inSender, inEvent) {
        this.log(inEvent);
        
        if(inEvent.originator.name == 'text_format') {
            this.set('textFormat', inEvent.active.name);
        }        

        if(inEvent.originator.name == 'passage_format') {
            this.set('passageFormat', inEvent.active.name);
        }
    }
});