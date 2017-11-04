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
                {tag: 'span', allowHtml: true, content: 'Find words within '},
                {kind: ProximitySelect, name: 'proximity_limit'},
                {tag: 'span', allowHtml: true, content: '&nbsp; &nbsp;'},
                {kind: Input, name: 'search'}
            ]
        },
        {kind: Button, content: 'Proximity Search', ontap: 'submitForm'},
    ],

    beforeSubmitForm: function(formData) {
        formData.search_type = 'proximity';
        return formData;
    },
});
