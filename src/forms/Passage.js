var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var BibleSelect = require('../components/BibleSelect/MultiSelect');

module.exports = kind({
    name: 'Passage',
    kind: FormBase,

    components: [
        {content: 'Passage FORM'},
        { components: [
            {name: 'bible', kind: BibleSelect},
            { components: [
                {tag: 'label', content: 'Passage(s)'},
                {name: 'reference', kind: TextArea},
            ]},
            { components: [
                {kind: Button, content: 'Random Chapter', ontap: 'submitRandom', random_type: 'Random Chapter'},
                {kind: Button, content: 'Random Verse', ontap: 'submitRandom', random_type: 'Random Verse'},
                {kind: Button, content: 'Go', ontap: 'submitForm'}
            ]}
        ]}
    ], 

    _bindings: [
        {from: 'formData.reference', to: '$.reference.value', oneWay: false, transform: function(value, dir) { return value || null; }},
        // {from: 'formData.bible', to: '$.bible.value',  oneWay: false, transform: function(value, dir) {
        //     this.log('bible', value, dir);
        //     return value || null;
        // }}
    ],

    create: function() {
        // this.formData.bible = [this.app.configs.defaultBible];
        // this.formData.bible = ['kjv', 'asv', 'niv'];
        this.log(this.formData);
        this.inherited(arguments);
    }
});
