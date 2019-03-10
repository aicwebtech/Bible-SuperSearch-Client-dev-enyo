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
                    {tag: 'label', allowHtml: true, classes: 'resp_left_label resp_left_label_165', content: 'Find words within:'},
                    {kind: ProximitySelect, classes: 'resp_input resp_input_100', name: 'proximity_limit', style: 'max-width: 100px'}
                ]
            },
            {tag: 'br'},
            {
                classes: 'biblesupersearch_center_element',
                components: [
                    {kind: Button, content: 'Proximity Search', ontap: 'submitForm'}
                ]
            }
        ]}
    ],

    beforeSubmitForm: function(formData) {
        formData.search_type = 'proximity';
        return formData;
    },
});
