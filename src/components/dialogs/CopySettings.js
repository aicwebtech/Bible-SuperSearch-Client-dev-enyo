var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Group = require('enyo/Group');
var utils = require('enyo/utils');
var Signal = require('../Signal');


var Input = require('../../components/Locale/i18nInput');
var Checkbox = require('enyo/Checkbox');
var inc = require('../../components/Locale/i18nComponent');
var i18n = require('../../components/Locale/i18nContent');

var Preset = kind({
    name: 'CopySettingsPreset',
    kind: Button,
    settings: null,
    label: null,

    components: [
        {name: 'label', kind: i18n}
    ],

    bindings: [
        {from: 'label', to: '$.label.string'}
    ]
});

var presetOptions = [
    {
        label: 'Word Processor', 
        name: 'word_processor',
        settings: {
            copy_separate_line: false,
            copy_omit_extra_br: false,
            copy_abbr_book: false,
            copy_text_format: 'reference_text',
            copy_passage_format: 'reference_passage',
            copy_passage_verse_number: true,
            render_style: 'passage'
        }
    }, 
    {
        label: 'Outline',
        name: 'outline',
        settings: {
            copy_separate_line: true,
            copy_omit_extra_br: true,
            copy_abbr_book: false,
            copy_text_format: 'reference_text',
            copy_passage_format: 'reference_passage',
            copy_passage_verse_number: true,
            render_style: 'verse'
        }
    },    
    {
        label: 'Custom',
        name: 'custom',
        settings: null
    }
];

// This might be converted to an actual dialog some day
module.exports = kind({
    name: 'CopySettings',
    classes: 'biblesupersearch_copy_settings',
    textFormat: null,
    passageFormat: null,
    preset: null,

    components: [
        {
            classes: 'bss_presets_container',
            components: [
                {
                    kind: i18n,
                    content: 'Copy Format',
                    tag: 'span',
                    classes: 'bss_label',
                },
                {tag: 'span', content: ': &nbsp;', classes: 'bss_label', allowHtml: true},
                {            
                    classes: 'bss_presets',
                    name: 'presets_group',
                    kind: Group
                }
            ]
        },
        {
            classes: 'bss_settings',
            name: 'settings_container',
            components: [
                {
                    classes: 'bss_section',
                    components: [
                        {kind: inc, content: 'Single Verses', classes: 'bss_header'},
                        {
                            kind: Group,
                            name: 'text_format',
                            components: [
                                {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                                    {classes: 'bss_element', components: [
                                        {kind: Checkbox, name: 'reference_text', id: 'reference_text', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'reference_text'}, classes: 'bss_label', content: 'Reference - Text'}
                                ]},                
                                {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                                    {classes: 'bss_element', components: [
                                        {kind: Checkbox, name: 'text_reference', id: 'text_reference', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'text_reference'}, classes: 'bss_label', content: 'Text - Reference'}
                                ]},                
                                {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                                    {classes: 'bss_element', components: [
                                        {kind: Checkbox, name: 'text_only', id: 'text_only', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'text_only'}, classes: 'bss_label', content: 'Text Only'}
                                ]},                
                                // {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                                //     {classes: 'bss_element', components: [
                                //         {kind: Checkbox, name: 'reference_only', id: 'reference_only', type: 'radio'}
                                //     ]},
                                //     {kind: i18n, tag: 'label', attributes: {for: 'reference_only'}, classes: 'bss_label', content: 'Reference Only'}
                                // ]}
                            ]
                        },  
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'separate_line', id: 'separate_line'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'separate_line'}, classes: 'bss_label', content: 'Separate Line'}
                        ]},        
                    ]
                },
                {
                    classes: 'bss_section',
                    components: [
                        {kind: inc, content: 'Multi-verse Passages', classes: 'header'},
                        {
                            kind: Group,
                            name: 'passage_format',
                            components: [
                                {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                                    {classes: 'bss_element', components: [
                                        {kind: Checkbox, name: 'reference_passage', id: 'reference_passage', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'reference_passage'}, classes: 'bss_label', content: 'Reference - Passage'}
                                ]},                
                                {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                                    {classes: 'bss_element', components: [
                                        {kind: Checkbox, name: 'passage_reference', id: 'passage_reference', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'passage_reference'}, classes: 'bss_label', content: 'Passage - Reference'}
                                ]},                
                                {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                                    {classes: 'bss_element', components: [
                                        {kind: Checkbox, name: 'passage_only', id: 'passage_only', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'passage_only'}, classes: 'bss_label', content: 'Passage Only'}
                                ]}                                
                            ]
                        },        
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'passage_verse_number', id: 'passage_verse_number'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'passage_verse_number'}, classes: 'bss_label', content: 'Show Verse Number'}
                        ]},
                    ]
                },
                {
                    classes: 'bss_section',
                    components: [              
                        {kind: inc, content: 'Other', classes: 'bss_header'},
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'abbr_book', id: 'abbr_book'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'abbr_book'}, classes: 'bss_label', content: 'Abbreviate Books'}
                        ]},                        
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'testament', id: 'testament'}
                            ]},
                            {tag: 'label', attributes: {for: 'testament'}, classes: 'bss_label', components: [
                                {kind: i18n, content: 'Include Testament'},
                            ]}
                        ]},
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'omit_extra_br', id: 'omit_extra_br'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'omit_extra_br'}, classes: 'bss_label', content: 'Omit Extra Line Breaks'}
                        ]},                          
                        // NOT NEEDED?
                        // {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                        //     {classes: 'bss_element', components: [
                        //         {kind: Checkbox, name: 'allow_html', id: 'allow_html'}
                        //     ]},
                        //     {kind: i18n, tag: 'label', attributes: {for: 'allow_html'}, classes: 'bss_label', content: 'Allow HTML Line Breaks'}
                        // ]},                
                    ]
                },                
                {
                    classes: 'bss_section', 
                    components: [
                        {kind: inc, content: 'Text Display', classes: 'bss_header'},
                        {
                            kind: Group,
                            name: 'render_style',
                            components: [
                                {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                                    {classes: 'bss_element', components: [
                                        {kind: Checkbox, name: 'paragraph', id: 'copy_settings_paragraph', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'copy_settings_paragraph'}, classes: 'bss_label', content: 'Paragraph Display'}
                                ]},                
                                {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                                    {classes: 'bss_element', components: [
                                        {kind: Checkbox, name: 'passage', id: 'copy_settings_passage', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'copy_settings_passage'}, classes: 'bss_label', content: 'Passage Display'}
                                ]},                
                                {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                                    {classes: 'bss_element', components: [
                                        {kind: Checkbox, name: 'verse', id: 'copy_settings_verse', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'copy_settings_verse'}, classes: 'bss_label', content: 'Verse Display'}
                                ]},     
                                {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                                    {classes: 'bss_element', components: [
                                        {kind: Checkbox, name: 'verse_passage', id: 'copy_settings_verse_passage', type: 'radio'}
                                    ]},
                                    {kind: i18n, tag: 'label', attributes: {for: 'copy_settings_verse_passage'}, classes: 'bss_label', content: 'Verse as Passage Display'}
                                ]},              
                            ]
                        }      
                    ]
                },
                {classes: 'bss-clear-both'}
            ]
        }
    ],

    bindings: [    
        {from: 'app.UserConfig.copy_separate_line', to: '$.separate_line.checked', oneWay: false, transform: function(value, dir) {
            // console.log('Copy separate_line', value, dir);
            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
            return value;
        }},         
        {from: 'app.UserConfig.copy_omit_extra_br', to: '$.omit_extra_br.checked', oneWay: false, transform: function(value, dir) {
            // console.log('Copy omit_extra_br', value, dir);
            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
            return value;
        }},        
        {from: 'app.UserConfig.copy_abbr_book', to: '$.abbr_book.checked', oneWay: false, transform: function(value, dir) {
            // console.log('Copy abbr_book', value, dir);
            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
            return value;
        }},            
        {from: 'app.UserConfig.copy_passage_verse_number', to: '$.passage_verse_number.checked', oneWay: false, transform: function(value, dir) {
            // console.log('Copy passage_verse_number', value, dir);
            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
            return value;
        }},                  
        {from: 'app.UserConfig.copy_testament', to: '$.testament.checked', oneWay: false, transform: function(value, dir) {
            // console.log('Copy testament', value, dir);
            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
            return value;
        }},             
        {from: 'app.UserConfig.copy_text_format', to: 'textFormat', oneWay: false, transform: function(value, dir) {
            // console.log('Copy textFormat', value, dir);

            if(dir == 1 && this.$[value]) {
                // console.log('Copy textFormat setActive');
                this.$.text_format.set('active', this.$[value]);
                this.$[value].set('checked', true);
            }

            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 

            return value;
        }},
        {from: 'app.UserConfig.copy_passage_format', to: 'passageFormat', oneWay: false, transform: function(value, dir) {
            // console.log('Copy passageFormat', value, dir);

            if(dir == 1 && this.$[value]) {
                // console.log('Copy passageFormat setActive');
                this.$.passage_format.set('active', this.$[value]);
                this.$[value].set('checked', true);
            }

            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 

            return value;
        }},         
        {from: 'app.UserConfig.render_style', to: 'renderStyle', oneWay: false, transform: function(value, dir) {
            // console.log('Copy renderStyle', value, dir);

            if(dir == 1 && this.$[value]) {
                this.$.render_style.set('active', this.$[value]);
                this.$[value].set('checked', true);
            }

            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 

            return value;
        }},        
        {from: 'app.UserConfig.copy_preset', to: 'preset', oneWay: false, transform: function(value, dir) {
            // console.log('Copy preset', value, dir);

            if(dir == 1 && this.$.presets_group && this.$.presets_group.$[value]) {
                // console.log('Copy preset setActive');
                this.$.presets_group.set('active', this.$.presets_group.$[value]);
                this.$.presets_group.$[value].set('checked', true);
                this.applyPreset(value);
            }

            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 

            return value;
        }}
    ],

    handlers: {
        onActiveChanged: 'handleActiveChanged'
    },

    create: function() {
        this.inherited(arguments);

        presetOptions.forEach(function(opt) {
            this.$.presets_group.createComponent({
                kind: Preset,
                name: opt.name,
                label: opt.label,
                settings: opt.settings
            });
        }, this);
    },

    handleActiveChanged: function(inSender, inEvent) {
        this.app.debug && this.log(inEvent);
        var value = (inEvent.active) ? inEvent.active.name : null;

        if(inEvent.originator.name == 'text_format') {
            this.set('textFormat', value);
        }        

        if(inEvent.originator.name == 'passage_format') {
            this.set('passageFormat', value);
        }              

        if(inEvent.originator.name == 'render_style') {
            this.set('renderStyle', value);
        }        

        if(inEvent.originator.name == 'presets_group') {
            this.set('preset', value);
            this.$.settings_container && this.$.settings_container.set('showing', value == 'custom' ? true : false);
        }
    },
    applyPreset: function(preset) {
        if(!this.$.presets_group || !this.$.presets_group.$[preset]) {
            return;
        }

        var settings = utils.clone(this.$.presets_group.$[preset].get('settings'));
        settings && this.app.UserConfig.set(settings);
    }
});