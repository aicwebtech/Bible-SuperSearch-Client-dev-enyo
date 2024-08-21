var FormBase = require('../FormBase');
var kind = require('enyo/kind');
var Button = require('enyo/Button');
var TextArea = require('enyo/TextArea');
var BibleSelect = require('../../components/BibleSelect/MultiSelect');
var FormSection = require('../FormSection');
var i18n = require('../../components/Locale/i18nComponent');
var i18nContent = require('../../components/Locale/i18nContent');
var Autocomplete = require('../../components/PseudoSelect/PseudoAutocompleteReference');

module.exports = kind({
    name: 'AdvancedPower',
    kind: FormBase,
    defaultSearchType: 'boolean',

    components: [
        {kind: FormSection, components: [
            {
                name: 'bible', 
                kind: BibleSelect, 
                parallelLimit: 8, 
                parallelStart: 1, 
                selectorWidth: 300,
                classes: 'biblesupersearch_center_element'
            },
            {tag: 'br'},
            {
                components: [
                    {kind: i18n, allowHtml: true, content: 'Boolean Search:'},
                    {kind: TextArea, name: 'search', style: 'width: 98%; height: 50px;'}
                ]
            },
            {tag: 'br'},
            {
                components: [
                    {kind: i18n, allowHtml: true, content: 'Passage Retrieval:'},
                    {kind: Autocomplete, name: 'reference', inputStyle: 'width: 98%; height: 50px;', useTextArea: true}
                ]
            },
            {tag: 'br'},
            {
                classes: 'biblesupersearch_center_element',
                components: [
                    {kind: Button, ontap: 'submitForm', components: [
                        {kind: i18nContent, content: 'Power Search'}
                    ]}
                ]
            }
        ]}
    ]
});
