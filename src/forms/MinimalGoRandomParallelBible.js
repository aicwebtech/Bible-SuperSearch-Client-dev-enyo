var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var Bible = require('../components/BibleSelect/MultiSelect');

module.exports = kind({
    name: 'MinimalGoRandomParallelBible',
    kind: FormBase,

    components: [
        { classes: 'single_line_go', components: [
            {kind: Input, name: 'request', classes: 'request', placeholder: 'Enter passage reference(s) or search keyword(s)'},
        ]},        
        { classes: 'single_line_go', components: [
            {kind: Bible, name: 'bible', parallelLimit: 4, width: 300},
        ]},
        { classes: 'single_line_go', components: [
            {kind: Button, content: 'Bible Search', ontap: 'submitForm'},
            {kind: Button, content: 'Random Chapter', ontap: 'submitRandom', random_type: 'Random Chapter'}
        ]}
    ]
});
