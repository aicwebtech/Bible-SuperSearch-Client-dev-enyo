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
                {tag: 'label', classes: 'left_label', allowHtml: true, style: 'width: 44%; max-width: 200px', content: '<b>All</b> of the words:'},
                {kind: Input, style: 'width: 55%; max-width: 150px', name: 'search_all'}
            ]
        },
        {
            components: [
                {tag: 'label', classes: 'left_label', allowHtml: true, style: 'width: 44%; max-width: 200px', content: '<b>Any</b> of the words:'},
                {kind: Input, style: 'width: 55%; max-width: 150px', name: 'search_any'}
            ]
        },
        {
            components: [
                {tag: 'label', classes: 'left_label', allowHtml: true, style: 'width: 44%; max-width: 200px', content: '<b>Only one</b> of the words:'},
                {kind: Input, style: 'width: 55%; max-width: 150px', name: 'search_one'}
            ]
        },
        {
            components: [
                {tag: 'label', classes: 'left_label', allowHtml: true, style: 'width: 44%; max-width: 200px', content: '<b>None</b> of the words:'},
                {kind: Input, style: 'width: 55%; max-width: 150px', name: 'search_none'}
            ]
        },
        {
            components: [
                {tag: 'label', classes: 'left_label', allowHtml: true, style: 'width: 44%; max-width: 200px', content: 'The <b>exact phrase</b>:'},
                {kind: Input, style: 'width: 55%; max-width: 150px', name: 'search_phrase'}
            ]
        },
        {tag: 'br'},
        {
            components: [
                {tag: 'label', classes: 'left_label', allowHtml: true, style: 'width: 44%; max-width: 200px', content: 'Restrict Search to:'},
                {kind: SearchType, style: 'width: 55%; max-width: 155px', name: 'search_type'}
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
