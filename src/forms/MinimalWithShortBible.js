var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('../components/Locale/i18nInput');
var i18n = require('../components/Locale/i18nContent');
var Bible = require('../components/BibleSelect/SingleSelect');

module.exports = kind({
    name: 'MinimalWithShortBible',
    kind: FormBase,

    components: [
        { classes: 'single_line_short_bible', components: [
            {kind: Input, name: 'request', classes: 'request', placeholder: 'Enter search keyword(s) or passage reference(s)'},
            {tag: 'span', components: [
                {kind: Bible, name: 'bible', parallelLimit: 1, shortWidthWidth: 150, width: 150, alwaysShort: true},
                {kind: Button, ontap: 'submitForm', components: [
                    {kind: i18n, content: 'Go'}
                ]}
            ]}
        ]}
    ]
});
