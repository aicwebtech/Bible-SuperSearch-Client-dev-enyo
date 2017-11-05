var FormBase = require('../FormBase');
var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var BibleSelect = require('../../components/BibleSelect/MultiSelect');
var SearchType = require('../../components/SearchType');
var ProximitySelect = require('../../components/ProximitySelect');

module.exports = kind({
    name: 'AdvancedProximity',
    kind: FormBase,

    components: [
        {
            name: 'bible', 
            kind: BibleSelect, 
            parallelLimit: 8, 
            parallelStart: 1, 
            selectorWidth: 200
        },
        {tag: 'br'},
        {
            components: [
                {kind: Input, name: 'search', style: 'width: 98%'},
                {tag: 'br'},
                {tag: 'label', allowHtml: true, content: 'Find words within '},
                {kind: ProximitySelect, name: 'proximity_limit'}
            ]
        },
        {tag: 'br'},
        {
            classes: 'biblesupersearch_center_element',
            components: [
                {kind: Button, content: 'Proximity Search', ontap: 'submitForm'}
            ]
        }
    ],

    beforeSubmitForm: function(formData) {
        formData.search_type = 'proximity';
        return formData;
    },
});
