var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('../components/Locale/i18nInput');
var i18n = require('../components/Locale/i18nContent');
var Bible = require('../components/BibleSelect/MultiSelect');

module.exports = kind({
    name: 'MinimalWithParallelBible',
    kind: FormBase,

    components: [
        { classes: 'single_line_go', components: [
            {kind: Input, name: 'request', classes: 'request max_wide', placeholder: 'Enter search keyword(s) or passage reference(s)'},
        ]},        
        { classes: 'single_line_go', components: [
            {kind: Bible, name: 'bible', parallelLimit: 4, selectorWidth: 500},
        ]},
        { classes: 'single_line_go', components: [
            {kind: Button, ontap: 'submitForm', components: [
                {kind: i18n, content: 'Go'}
            ]}
        ]}
    ]
});
