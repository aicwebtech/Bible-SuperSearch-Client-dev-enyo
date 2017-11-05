var FormBase = require('../FormBase');
var kind = require('enyo/kind');
var Button = require('enyo/Button');
var TextArea = require('enyo/TextArea');
var BibleSelect = require('../../components/BibleSelect/MultiSelect');

module.exports = kind({
    name: 'AdvancedPower',
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
        {
            components: [
                {allowHtml: true, content: 'Boolean Search:'},
                {kind: TextArea, name: 'search', style: 'width: 98%; height: 50px;'}
            ]
        },
        {
            components: [
                {allowHtml: true, content: 'Passage Retrieval:'},
                {kind: TextArea, name: 'reference', style: 'width: 98%; height: 50px;'}
            ]
        },
        {tag: 'br'},
        {
            classes: 'biblesupersearch_center_element',
            components: [
                {kind: Button, content: 'Power Search', ontap: 'submitForm'}
            ]
        }
    ]
});