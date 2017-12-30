var FormBase = require('../FormBase');
var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var BibleSelect = require('../../components/BibleSelect/MultiSelect');
var SearchType = require('../../components/SearchType');
var Shortcuts = require('../../components/Shortcuts');

module.exports = kind({
    name: 'AdvancedWord',
    kind: FormBase,

    components: [
        {
            name: 'bible', 
            kind: BibleSelect, 
            parallelLimit: 8, 
            parallelStart: 1, 
            selectorWidth: 270,
            classes: 'biblesupersearch_center_element'
        },
        {tag: 'br'},
        {content: 'Find verses containing:'},
        {tag: 'br'},
        {
            components: [
                {tag: 'label', classes: 'resp_left_label resp_left_label_165', allowHtml: true, content: '<b>All</b> of the words:'},
                {kind: Input, classes: 'resp_input resp_input_200', name: 'search_all'}
            ]
        },
        {
            components: [
                {tag: 'label', classes: 'resp_left_label resp_left_label_165', allowHtml: true, content: '<b>Any</b> of the words:'},
                {kind: Input, classes: 'resp_input resp_input_200', name: 'search_any'}
            ]
        },
        {
            components: [
                {tag: 'label', classes: 'resp_left_label resp_left_label_165', allowHtml: true, content: '<b>Only one</b> of the words:'},
                {kind: Input, classes: 'resp_input resp_input_200', name: 'search_one'}
            ]
        },
        {
            components: [
                {tag: 'label', classes: 'resp_left_label resp_left_label_165', allowHtml: true, content: '<b>None</b> of the words:'},
                {kind: Input, classes: 'resp_input resp_input_200', name: 'search_none'}
            ]
        },
        {
            components: [
                {tag: 'label', classes: 'resp_left_label resp_left_label_165', allowHtml: true, content: 'The <b>exact phrase</b>:'},
                {kind: Input, classes: 'resp_input resp_input_200', name: 'search_phrase'}
            ]
        },
        {tag: 'br'},
        {
            components: [
                {tag: 'label', classes: 'resp_left_label resp_left_label_165', allowHtml: true, content: 'Restrict Search to:'},
                {kind: SearchType, classes: 'resp_input resp_input_200', name: 'search_type', style: 'max-width: 200px'}
            ]
        },
        {tag: 'br'},
        {
            classes:'biblesupersearch_center_element',
            components: [
                {kind: Checkbox, name: 'whole_words', id: 'whole_words_adv_word'},
                {tag: 'label', content: ' Whole words', attributes: {for: 'whole_words_adv_word'}}
        ]},
        {tag: 'br'},
        {
            classes: 'biblesupersearch_center_element',
            components: [
                {kind: Button, content: 'Word Search', ontap: 'submitForm'}
            ]
        }
    ]
});
