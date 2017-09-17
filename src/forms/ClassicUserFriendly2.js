var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var BibleSelect = require('../components/BibleSelect/MultiSelect');

module.exports = kind({
    name: 'ClassicUserFriendly2',
    kind: FormBase,
    classes: 'bacon',

    components: [
        {classes: 'center', content: 'Bible SuperSearch', classes: 'classic_title'},
        {
            classes: 'classic_form',
            components: [
                {classes: 'biblesupersearch_center_element', components: [
                    {content: 'Select Bible Version(s)'},
                    {name: 'Bibles', kind: BibleSelect, parallelLimit: 4, parallelStart: 4, elementWidth: 300},
                    {tag: 'br'},
                    {content: 'Enter passage(s)'},
                    {name: 'reference', kind: Input},
                    {content: 'Example: John 4; Rom 5:8;'},
                    {kind: Button, content: 'Look up Passages', ontap: 'submitForm'},
                    {tag: 'br'},
                    {components: [
                        {kind: Button, content: 'Random Chapter', ontap: 'submitRandom', random_type: 'Random Chapter', style: 'margin-right: 4px'},
                        {kind: Button, content: 'Random Verse', ontap: 'submitRandom', random_type: 'Random Verse'}
                    ]}
                ]}

            ]
        }
    ],

    // bindings: [

    // ], 
    create: function() {
        this.inherited(arguments);
        this.log();
    }
});
