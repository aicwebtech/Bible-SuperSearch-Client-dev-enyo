var FormBase = require('../FormBase');
var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var BibleSelect = require('../../components/BibleSelect/MultiSelect');
var SearchType = require('../../components/SearchType');
var ProximitySelect = require('../../components/ProximitySelect');
var FormSection = require('../FormSection');
var i18n = require('../../components/Locale/i18nComponent');
var i18nContent = require('../../components/Locale/i18nContent');

module.exports = kind({
    name: 'AdvancedProximity',
    kind: FormBase,

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
                    {kind: Input, name: 'search', style: 'width: 98%'},
                    {tag: 'br'},
                    {tag: 'br'},
                    {kind: i18nContent, tag: 'label', allowHtml: true, classes: 'bss_resp_left_label bss_resp_left_label_165', content: 'Find words within:'},
                    {kind: ProximitySelect, classes: 'bss_resp_input bss_resp_input_100', name: 'proximity_limit', style: 'max-width: 100px'}
                ]
            },
            {tag: 'br'},
            {
                classes: 'biblesupersearch_center_element',
                components: [
                    {kind: Button, ontap: 'submitForm', components: [
                        {kind: i18nContent, content: 'Proximity Search'}
                    ]}
                ]
            }
        ]}
    ],

    beforeSubmitForm: function(formData) {
        formData.search_type = 'proximity';
        return formData;
    },
});
