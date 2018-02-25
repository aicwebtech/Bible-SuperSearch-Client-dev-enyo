var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
// var Bible = require('../components/BibleSelect/MultiSelect');
var Bible = require('../components/BibleSelect/SingleSelect');

module.exports = kind({
    name: 'MinimalWithShortBible',
    kind: FormBase,

    components: [
        { classes: 'single_line_short_bible', components: [
            {kind: Input, name: 'request', classes: 'request', placeholder: 'Enter passage reference(s) or search keyword(s)'},
            {tag: 'span', components: [
                {kind: Bible, name: 'bible', parallelLimit: 1, shortWidthWidth: 150, width: 150, alwaysShort: true},
                {kind: Button, content: 'Go', ontap: 'submitForm'}
            ]}
        ]}
    ]
});
