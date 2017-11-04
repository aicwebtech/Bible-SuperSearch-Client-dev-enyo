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
            selectorWidth: 200
        },
        {tag: 'br'},
        {content: 'Find verses containing:'},
        {
            components: [
                {tag: 'span', allowHtml: true, content: '<b>All</b> of the words:'},
                {kind: Input, name: 'search_all'}
            ]
        },
        {
            components: [
                {tag: 'span', allowHtml: true, content: '<b>Any</b> of the words:'},
                {kind: Input, name: 'search_any'}
            ]
        },
        {
            components: [
                {tag: 'span', allowHtml: true, content: '<b>Only one</b> of the words:'},
                {kind: Input, name: 'search_one'}
            ]
        },
        {
            components: [
                {tag: 'span', allowHtml: true, content: '<b>None</b> of the words:'},
                {kind: Input, name: 'search_none'}
            ]
        },
        {
            components: [
                {tag: 'span', allowHtml: true, content: 'The <b>exact phrase</b>:'},
                {kind: Input, name: 'search_phrase'}
            ]
        },
        {tag: 'br'},
        {
            components: [
                {tag: 'span', allowHtml: true, content: 'Restrict Search to:'},
                {kind: SearchType, name: 'search_type'}
            ]
        },
        {components: [
            {kind: Checkbox, name: 'whole_words', id: 'whole_words_adv_word'},
            {tag: 'label', content: ' Whole words', attributes: {for: 'whole_words_adv_word'}}
        ]},
        {tag: 'br'},
        {kind: Button, content: 'Word Search', ontap: 'submitForm'},
    ]
});
