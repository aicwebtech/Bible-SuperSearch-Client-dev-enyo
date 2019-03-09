var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
// var Bible = require('../components/BibleSelect/MultiSelect');
var Bible = require('../components/BibleSelect/SingleSelect');

module.exports = kind({
    name: 'MinimalWithBibleWide',
    kind: FormBase,

    components: [
        { classes: 'single_line_bible', components: [
            {kind: Input, name: 'request', classes: 'request', placeholder: 'Enter passage(s) or keyword(s)'},
            {tag: 'span', classes: 'bible_selector', components: [
                {kind: Bible, name: 'bible', parallelLimit: 1, shortWidthThreshold: 800, shortWidthWidth: 155, width: 280},
                {kind: Button, content: 'Go', ontap: 'submitForm'}
            ]}
        ]}
    ]
});
