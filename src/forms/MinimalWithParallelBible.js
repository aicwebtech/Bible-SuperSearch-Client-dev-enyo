var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var Bible = require('../components/BibleSelect/MultiSelect');

module.exports = kind({
    name: 'MinimalWithParallelBible',
    kind: FormBase,

    components: [
        { classes: 'single_line_go', components: [
            {kind: Input, name: 'request', classes: 'request max_wide', placeholder: 'Enter passage reference(s) or search keyword(s)'},
        ]},        
        { classes: 'single_line_go', components: [
            {kind: Bible, name: 'bible', parallelLimit: 4, selectorWidth: 500},
        ]},
        { classes: 'single_line_go', components: [
            {kind: Button, content: 'Go', ontap: 'submitForm'},
        ]}
    ]
});
