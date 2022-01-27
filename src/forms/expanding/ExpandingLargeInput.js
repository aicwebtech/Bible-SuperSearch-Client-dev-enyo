var kind = require('enyo/kind');
var FormBase = require('./FormBaseExpanding');
var FormSection = require('../FormSection');
var Button = require('enyo/Button');
var Input = require('../../components/Locale/i18nInput');
var TextArea = require('../../components/Locale/i18nTextArea');
var Checkbox = require('enyo/Checkbox');
var BibleSelect = require('../../components/BibleSelect/MultiSelect');
var SearchType = require('../../components/SearchType');
var Shortcuts = require('../../components/Shortcuts');
var Drawer = require('enyo/Drawer');
var DialogButtons = require('../../components/DialogEtcButtons/DialogEtcButtonsHtml');
var easing = require('layout/easing');
// var app = require('../../app');
// var i18n = require('enyo/i18n');
var i18n = require('../../components/i18n');
var LocaleSelector = require('../../components/Locale/LocaleSelector');
var inc = require('../../components/Locale/i18nComponent');
var i18n = require('../../components/Locale/i18nContent');

module.exports = kind({
    name: 'Expanding',
    kind: FormBase,

    components: [
        {
            kind: FormSection,
            classes: 'biblesupersearch_expanding_form expanding',
            components: [                
                {classes: 'input_row_wide', components: [
                    {
                        name: 'request', 
                        kind: TextArea, 
                        placeholder: 'Enter search keyword(s) or passage reference(s)', 
                        enterSubmit: false,
                        style: 'height: 60px'
                    },
                ]},                 
                {classes: 'input_row_wide', components: [
                    {classes: 'element', components: [
                        {
                            name: 'bible', 
                            classes: 'bible',
                            kind: BibleSelect, 
                            parallelStart: 1, 
                            parallelLimit: 1,
                            selectorWidth: 500
                        }
                    ]}
                ]},      
                {
                    name: 'Expansion', 
                    classes: 'wrapper', 
                    kind: Drawer,
                    open: false, 
                    orient: 'v',
                    components: [
                        {classes: 'input_row', components: [
                            {kind: i18n, classes: 'label', content: 'Match:'},
                            {classes: 'element', components: [
                                {kind: SearchType, name: 'search_type', defaultValue: 'boolean'}
                            ]}
                        ]},                
                        {classes: 'input_row', components: [
                            {kind: i18n, classes: 'label', content: 'Limit Search To:'},
                            {classes: 'element', components: [
                                {kind: Shortcuts, name: 'shortcut', selectedPassagesLabel: 'Passage(s) listed below:', onchange: 'shortcutChangedHandler'}
                            ]}
                        ]},                
                        {name: 'PassageContainer', showing: false, classes: 'input_row', components: [
                            {kind: i18n, classes: 'label', content: 'Passages:'},
                            {classes: 'element', components: [
                                {kind: TextArea, name: 'reference', enterSubmit: false, style: 'height: 30px'}
                            ]}
                        ]},                                     
                        {classes: 'input_row_checkbox', components: [
                            {classes: 'checkbox_container', components: [
                                {kind: i18n, tag: 'label', attributes: {for: 'whole_words'}, classes: 'label', content: 'Whole Words Only:'},
                                {classes: 'element', components: [
                                    {kind: Checkbox, name: 'whole_words', id: 'whole_words'}
                                ]}
                            ]},               
                            {classes: 'checkbox_container', components: [
                                {kind: i18n, tag: 'label', attributes: {for: 'exact_case'}, classes: 'label', content: 'Exact Case:'},
                                {classes: 'element', components: [
                                    {kind: Checkbox, name: 'exact_case', id: 'exact_case'}
                                ]}
                            ]},
                        ]},
                        {classes: 'input_row_wide', components: [
                            {
                                kind: Button, 
                                ontap: 'submitRandom', 
                                random_type: 'Random Chapter', 
                                style: 'margin-right: 4px', 
                                classes: 'random',
                                components: [{kind: i18n, content: 'Random Chapter'}]
                            },
                            {
                                kind: Button, 
                                ontap: 'submitRandom', 
                                random_type: 'Random Verse', 
                                classes: 'random',
                                components: [{kind: i18n, content: 'Random Verse'}]
                            }
                        ]},
                        {kind: DialogButtons}
                    ]
                },
                {classes: 'input_row_wide', components: [
                    {
                        kind: Button, 
                        ontap: 'submitForm', 
                        components: [{kind: i18n, content: 'Search'}]
                    },
                ]},                
                {classes: 'expander_row', components: [
                    {name: 'Expand1', kind: Button, content: "&#9660;", ontap: 'toggleExpanded', allowHtml: true},
                    {name: 'Expand0', kind: Button, content: "&#9650;", ontap: 'toggleExpanded', allowHtml: true, showing: false}
                ]}, 
            ],
        }
    ], 

    expandedChanged: function(was, is) {
        this.inherited(arguments);
    },
    shortcutChangedHandler: function(inSender, inEvent) {
        this.app.debug && this.log('shortcut value selected', inSender.get('value'));

        var val = inSender.get('value');

        if(val == 1) {
            this.app.debug && this.log('shortcut setting passage SHOWING');
        }
        else {
            this.app.debug && this.log('shortcut setting passage HIDING');
        }

        this.$.PassageContainer.set('showing', (val == 1) );
    },

});
