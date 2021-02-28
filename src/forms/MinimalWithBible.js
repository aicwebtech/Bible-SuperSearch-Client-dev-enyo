var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Bible = require('../components/BibleSelect/SingleSelect');
var Input = require('../components/Locale/i18nInput');
var i18n = require('../components/Locale/i18nContent');

module.exports = kind({
    name: 'MinimalWithBible',
    kind: FormBase,

    components: [
        { classes: 'single_line_bible', components: [
            {kind: Input, name: 'request', classes: 'request', placeholder: 'Enter search keyword(s) or passage reference(s)'},
            {tag: 'span', components: [
                {kind: Bible, name: 'bible', parallelLimit: 1, shortWidthThreshold: 500, shortWidthWidth: 165, width: 240},
                {kind: Button, ontap: 'submitForm', components: [
                    {kind: i18n, content: 'Go'}
                ]}
            ]}
        ]}
    ]
});
