var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var BibleSelect = require('../components/BibleSelect/MultiSelect');
var SearchType = require('../components/SearchType');
var Shortcuts = require('../components/Shortcuts');
var FormSection = require('./FormSection');
var i18nContent = require('../components/Locale/i18nContent');
var i18n = require('../components/Locale/i18nComponent');
var Autocomplete = require('../components/PseudoSelect/PseudoAutocompleteReference');

module.exports = kind({
    name: 'ClassicParallel2',
    kind: FormBase,

    components: [
        {kind: i18n, classes: 'center', content: 'Bible SuperSearch', classes: 'biblesupersearch_classic_title'},
        {
            classes: 'biblesupersearch_classic_form parallel2',
            tag: 'table',
            kind: FormSection,

            components: [
                {tag: 'tr', components: [
                    {tag: 'td', style: 'max-width: 300px', attributes: {rowspan: 4}, components: [
                        {
                            name: 'bible', 
                            kind: BibleSelect, 
                            parallelLimit: 4, 
                            parallelStart: 4, 
                            parallelMinium: 4, 
                            selectorWidth: 300,
                            selectorShortWidth: 150,
                            selectorShortWidthThreshold: 650
                        },
                    ]},
                    {tag: 'td', style: 'text-align:right', components: [
                        {kind: i18nContent, content: 'Passage'}
                    ]},
                    {tag: 'td', classes: 'nowrap', attributes: {colspan: 2}, components: [
                        {name: 'reference', kind: Autocomplete, onblur: 'referenceTyped', style: 'width: 303px;'},
                        {tag: 'span', content: ' '},
                        {kind: Button, ontap: 'submitForm', style: 'width:70px;font-size:70%', components: [
                            {kind: i18nContent, content: 'Look up'}
                        ]},
                    ]}
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', style: 'text-align:right', components: [
                        {kind: i18nContent, content: 'Search'}
                    ]},
                    {tag: 'td', classes: 'nowrap', attributes: {colspan: 2}, components: [
                        {name: 'search', kind: Input, style: 'width: 300px;'},
                        {tag: 'span', content: ' '},
                        {kind: Button, ontap: 'submitForm', style: 'width:70px;font-size:70%', components: [
                            {kind: i18nContent, content: 'Search'}
                        ]},
                    ]}
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', style: 'text-align: right; vertical-align: middle', components: [
                        {kind: i18nContent, content: 'Look for'},
                        {tag: 'span', content: ' '}
                    ]},
                    {tag: 'td', classes: 'nowrap', style: 'vertical-align: top', components: [
                        {kind: SearchType, name: 'search_type', style: 'width:107px;'}, 
                        {tag: 'span', content: ' '},
                        {kind: i18nContent, content: 'in'},
                        {tag: 'span', content: ' '},
                        {kind: Shortcuts, name: 'shortcut', style: 'width:136px;'}
                    ]},
                    {tag: 'td', components: [
                        {kind: Button, random_type: 'Random Verse', ontap: 'submitRandom', style: 'width:110px;font-size:70%', components: [
                            {kind: i18nContent, content: 'Random Verse'}
                        ]}
                    ]}
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', style: 'text-align: center', attributes: {colspan: 2}, components: [
                        {kind: Checkbox, name: 'whole_words', id: 'whole_words'},
                        {tag: 'span', content: ' '},
                        {kind: i18nContent, tag: 'label', content: 'Whole words', attributes: {for: 'whole_words'}},
                        {tag: 'span', content: '&nbsp; &nbsp;', allowHtml: true},
                        {kind: Checkbox, name: 'exact_case', id: 'exact_case'},
                        {tag: 'span', content: ' '},
                        {kind: i18nContent, tag: 'label', content: 'Exact Case', attributes: {for: 'exact_case'}}
                    ]},
                    {tag: 'td', components: [
                        {kind: Button, content: 'Random Chapter', random_type: 'Random Chapter', ontap: 'submitRandom', style: 'width:110px;font-size:70%', components: [
                            {kind: i18nContent, content: 'Random Chapter'}
                        ]}
                    ]}
                ]}
            ]
        }
    ],
    create: function() {
        this.inherited(arguments);
    }
});
