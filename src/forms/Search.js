var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var BibleSelect = require('../components/BibleSelect/SingleSelect');

module.exports = kind({
    name: 'Search',
    kind: FormBase,

    components: [
        {content: 'Search FORM'},
        { components: [
            {name: 'bible', kind: BibleSelect},
            { components: [
                {tag: 'label', content: 'Search'},
                {name: 'search', kind: Input},
            ]},
            { components: [
                {tag: 'label', content: 'Passage(s)'},
                {name: 'reference', kind: Input},
            ]},
            { components: [
                {kind: Button, content: 'Random Chapter', ontap: 'submitRandom', random_type: 'Random Chapter'},
                {kind: Button, content: 'Random Verse', ontap: 'submitRandom', random_type: 'Random Verse'},
                {kind: Button, content: 'Go', ontap: 'submitForm'}
            ]}
        ]}
    ], 
    bindings: [
        {from: 'formData.search', to: '$.search.value', oneWay: false},
        {from: 'formData.reference', to: '$.reference.value', oneWay: false},
        {from: 'formData.bible', to: '$.bible.value', oneWay: false, transform: function(value, dir) {
            this.log('bible', value, dir);
            return value || null;
        }}
    ]
});
