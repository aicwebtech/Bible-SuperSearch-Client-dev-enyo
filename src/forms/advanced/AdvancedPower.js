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
                {tag: 'span', allowHtml: true, content: 'Boolean Search:'},
                {kind: TextArea, name: 'search'}
            ]
        },
        {
            components: [
                {tag: 'span', allowHtml: true, content: 'Passage Limitation:'},
                {kind: TextArea, name: 'reference'}
            ]
        },
        {tag: 'br'},
        {kind: Button, content: 'Power Search', ontap: 'submitForm'}
    ]
});