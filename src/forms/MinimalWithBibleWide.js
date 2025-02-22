var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('../components/Locale/i18nInput');
var i18n = require('../components/Locale/i18nContent');
var Bible = require('../components/BibleSelect/MultiSelect');
var Autocomplete = require('../components/PseudoSelect/PseudoAutocompleteReference');

module.exports = kind({
    name: 'MinimalWithBibleWide',
    kind: FormBase,

    components: [
        { classes: 'bss_single_line_bible', components: [
            {kind: Autocomplete, name: 'request', classes: 'bss_request', placeholder: 'Enter search keyword(s) or passage reference(s)'},
            {tag: 'span', classes: 'bss_bible_selector', components: [
                {
                    kind: Bible, 
                    name: 'bible', 
                    tag: 'span',
                    parallelLimit: 1, 
                    selectorShortWidthThreshold: 800, 
                    selectorShortWidth: 140, 
                    selectorWidth: 280
                },
                {kind: Button, ontap: 'submitForm', components: [
                    {kind: i18n, content: 'Go'}
                ]}
            ]}
        ]}
    ]
});
