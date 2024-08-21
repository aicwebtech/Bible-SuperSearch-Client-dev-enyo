var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('../components/Locale/i18nInput');
var i18n = require('../components/Locale/i18nContent');
var Bible = require('../components/BibleSelect/MultiSelect');
<<<<<<< HEAD
=======
var Autocomplete = require('../components/PseudoSelect/PseudoAutocompleteReference');
>>>>>>> master

module.exports = kind({
    name: 'MinimalWithShortBible',
    kind: FormBase,

    components: [
        { classes: 'single_line_short_bible', components: [
            {kind: Autocomplete, name: 'request', classes: 'request', placeholder: 'Enter search keyword(s) or passage reference(s)'},
            {tag: 'span', components: [
                {
                    kind: Bible, 
                    name: 'bible', 
                    tag: 'span',
                    parallelLimit: 1, 
                    selectorShortWidth: 150, 
                    selectorWidth: 150, 
                    selectorAlwaysShort: true
                },
                {kind: Button, ontap: 'submitForm', components: [
                    {kind: i18n, content: 'Go'}
                ]}
            ]}
        ]}
    ]
});
