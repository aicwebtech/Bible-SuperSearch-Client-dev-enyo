var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('../components/Locale/i18nInput');
var i18n = require('../components/Locale/i18nContent');
var Bible = require('../components/BibleSelect/MultiSelect');
var Autocomplete = require('../components/PseudoSelect/PseudoAutocompleteReference');

module.exports = kind({
    name: 'MinimalGoRandomBible',
    kind: FormBase,

    components: [
        { classes: 'bss_single_line_go', components: [
            {kind: Autocomplete, name: 'request', classes: 'bss_request', placeholder: 'Enter search keyword(s) or passage reference(s)'},
        ]},        
        { classes: 'bss_single_line_go', components: [
            {kind: Bible, name: 'bible', parallelLimit: 1},
        ]},
        { classes: 'bss_single_line_go', components: [
            {kind: Button, ontap: 'submitForm', components: [
                {kind: i18n, content: 'Bible Search'}
            ]},
            {kind: Button, ontap: 'submitRandom', random_type: 'Random Chapter', components: [
                {kind: i18n, content: 'Random Chapter'}
            ]},
        ]}
    ]
});
