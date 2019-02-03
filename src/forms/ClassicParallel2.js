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

module.exports = kind({
    name: 'ClassicParallel2',
    kind: FormBase,

    components: [
        {classes: 'center', content: 'Bible SuperSearch', classes: 'biblesupersearch_classic_title'},
        {
            classes: 'biblesupersearch_classic_form parallel2',
            tag: 'table',
            kind: FormSection,
            // attributes: {border: 1},
            // style: 'width: 656px',

            components: [
                {tag: 'tr', components: [
                    {tag: 'td', style: 'max-width: 300px', attributes: {rowspan: 4}, components: [
                        {
                            name: 'bible', 
                            kind: BibleSelect, 
                            parallelLimit: 4, 
                            parallelStart: 4, 
                            selectorWidth: 300,
                            selectorShortWidth: 150,
                            selectorShortWidthThreshold: 650
                        },
                    ]},
                    {tag: 'td', style: 'text-align:right', content: 'Passage'},
                    {tag: 'td', classes: 'nowrap', attributes: {colspan: 2}, components: [
                        {name: 'reference', kind: Input, onblur: 'referenceTyped', style: 'width: 300px;'},
                        {tag: 'span', content: ' '},
                        {kind: Button, content: 'Look up', ontap: 'submitForm', style: 'width:70px;font-size:70%'},
                    ]}
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', style: 'text-align:right', content: 'Search'},
                    {tag: 'td', classes: 'nowrap', attributes: {colspan: 2}, components: [
                        {name: 'search', kind: Input, style: 'width: 300px;'},
                        {tag: 'span', content: ' '},
                        {kind: Button, content: 'Search', ontap: 'submitForm', style: 'width:70px;font-size:70%'},
                    ]}
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', style: 'text-align: right; vertical-align: middle', content: 'Look for '},
                    {tag: 'td', classes: 'nowrap', style: 'vertical-align: top', components: [
                        {kind: SearchType, name: 'search_type', style: 'width:107px;'}, 
                        {tag: 'span', content: ' in '},
                        {kind: Shortcuts, name: 'shortcut', style: 'width:136px;'}
                    ]},
                    {tag: 'td', components: [
                        {kind: Button, content: 'Random Verse', random_type: 'Random Verse', ontap: 'submitRandom', style: 'width:110px;font-size:70%'}
                    ]}
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', style: 'text-align: center', attributes: {colspan: 2}, components: [
                        {kind: Checkbox, name: 'whole_words', id: 'whole_words'},
                        {tag: 'label', content: ' Whole words', attributes: {for: 'whole_words'}},
                        {tag: 'span', content: '&nbsp; &nbsp;', allowHtml: true},
                        {kind: Checkbox, name: 'exact_case', id: 'exact_case'},
                        {tag: 'label', content: ' Exact Case', attributes: {for: 'exact_case'}}
                    ]},
                    {tag: 'td', components: [
                        {kind: Button, content: 'Random Chapter', random_type: 'Random Chapter', ontap: 'submitRandom', style: 'width:110px;font-size:70%'}
                    ]}
                ]}
            ]
        }
    ],
    create: function() {
        this.inherited(arguments);
    }
});
