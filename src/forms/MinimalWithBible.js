var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Bible = require('../components/BibleSelect/MultiSelect');
var Input = require('../components/Locale/i18nInput');
var i18n = require('../components/Locale/i18nContent');

module.exports = kind({
    name: 'MinimalWithBible',
    kind: FormBase,

    components: [
        { classes: 'single_line_bible', components: [
            {kind: Input, name: 'request', classes: 'request', placeholder: 'Enter search keyword(s) or passage reference(s)'},
            {tag: 'span', components: [
                {
                    kind: Bible, 
                    name: 'bible', 
                    tag: 'span', 
                    parallelLimit: 1, 
                    selectorShortWidthThreshold: 500,
                    selectorShortWidth: 165,
                    selectorWidth: 240 
                },
                {kind: Button, ontap: 'submitForm', components: [
                    {kind: i18n, content: 'Go'}
                ]}
            ]}
        ]}
    ]
});
