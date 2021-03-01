var FormBase = require('../FormBase');
var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var BibleSelect = require('../../components/BibleSelect/MultiSelect');
var SearchType = require('../../components/SearchType');
var Shortcuts = require('../../components/Shortcuts');
var FormSection = require('../FormSection');
var i18n = require('../../components/Locale/i18nComponent');
var i18nContent = require('../../components/Locale/i18nContent');

module.exports = kind({
    name: 'AdvancedWord',
    kind: FormBase,

    components: [
        {kind: FormSection, components: [
            {
                name: 'bible', 
                kind: BibleSelect, 
                parallelLimit: 8, 
                parallelStart: 1, 
                selectorWidth: 300,
                classes: 'biblesupersearch_center_element'
            },
            {tag: 'br'},
            {kind: i18n, content: 'Find verses containing:'},
            {tag: 'br'},
            {
                components: [
                    {kind: i18nContent, tag: 'label', classes: 'resp_left_label resp_left_label_165', allowHtml: true, content: '<b>All</b> of the words:'},
                    {kind: Input, classes: 'resp_input resp_input_200', name: 'search_all'}
                ]
            },
            {
                components: [
                    {kind: i18nContent, tag: 'label', classes: 'resp_left_label resp_left_label_165', allowHtml: true, content: '<b>Any</b> of the words:'},
                    {kind: Input, classes: 'resp_input resp_input_200', name: 'search_any'}
                ]
            },
            {
                components: [
                    {kind: i18nContent, tag: 'label', classes: 'resp_left_label resp_left_label_165', allowHtml: true, content: '<b>Only one</b> of the words:'},
                    {kind: Input, classes: 'resp_input resp_input_200', name: 'search_one'}
                ]
            },
            {
                components: [
                    {kind: i18nContent, tag: 'label', classes: 'resp_left_label resp_left_label_165', allowHtml: true, content: '<b>None</b> of the words:'},
                    {kind: Input, classes: 'resp_input resp_input_200', name: 'search_none'}
                ]
            },
            {
                components: [
                    {kind: i18nContent, tag: 'label', classes: 'resp_left_label resp_left_label_165', allowHtml: true, content: 'The <b>exact phrase</b>:'},
                    {kind: Input, classes: 'resp_input resp_input_200', name: 'search_phrase'}
                ]
            },
            {tag: 'br'},
            {
                components: [
                    {kind: i18nContent, tag: 'label', classes: 'resp_left_label resp_left_label_165', allowHtml: true, content: 'Restrict search to:'},
                    {kind: Shortcuts, classes: 'resp_input resp_input_200', name: 'shortcut', style: 'max-width: 200px', selectedPassagesLabel: null},
                    {kind: Input, name: 'reference', type: 'hidden'}
                ]
            },
            {tag: 'br'},
            {
                classes:'biblesupersearch_center_element',
                components: [
                    {kind: Checkbox, name: 'whole_words', id: 'whole_words_adv_word'},
                    {tag: 'span', content: ' '},
                    {kind: i18nContent, tag: 'label', content: 'Whole words only', attributes: {for: 'whole_words_adv_word'}}
            ]},
            {tag: 'br'},
            {
                classes: 'biblesupersearch_center_element',
                components: [
                    {kind: Button, ontap: 'submitForm', components: [
                        {kind: i18nContent, content: 'Word Search'}
                    ]}
                ]
            }
        ]}
    ]
});
