var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('../components/Locale/i18nInput');
var i18n = require('../components/Locale/i18nContent');

module.exports = kind({
    name: 'Minimal',
    kind: FormBase,

    components: [
        { classes: 'single_line', components: [
            {kind: Input, name: 'request', placeholder: 'Enter search keyword(s) or passage reference(s)'},
            {kind: Button, ontap: 'submitForm', components: [
                {kind: i18n, content: 'Go'}
            ]}
        ]}
    ]
});
