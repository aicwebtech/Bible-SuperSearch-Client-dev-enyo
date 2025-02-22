var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('../components/Locale/i18nInput');
var i18n = require('../components/Locale/i18nContent');
var Autocomplete = require('../components/PseudoSelect/PseudoAutocompleteReference');

module.exports = kind({
    name: 'Minimal',
    kind: FormBase,

    components: [  
        { classes: 'bss_single_line', components: [
            {kind: Autocomplete, name: 'request', classes: 'bss_request', placeholder: 'Enter search keyword(s) or passage reference(s)'},
            {kind: Button, ontap: 'submitForm', components: [
                {kind: i18n, content: 'Go'}
            ]}
        ]}
    ]
});
