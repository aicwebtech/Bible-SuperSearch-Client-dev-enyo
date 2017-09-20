var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var BibleSelect = require('../components/BibleSelect/MultiSelect');
var SearchType = require('../components/SearchType');
var Shortcuts = require('../components/Shortcuts');

module.exports = kind({
    name: 'ClassicUserFriendly2',
    kind: FormBase,
    classes: 'bacon',

    components: [
        {classes: 'center', content: 'Bible SuperSearch', classes: 'biblesupersearch_classic_title'},
        {
            classes: 'biblesupersearch_classic_form',
            components: [
                {classes: 'biblesupersearch_center_element', components: [
                    {content: 'Select Bible version(s):'},
                    {name: 'bible', kind: BibleSelect, parallelLimit: 4, parallelStart: 4, elementWidth: 300},
                    {tag: 'br'},
                    {content: 'Enter passage(s):'},
                    {name: 'reference', kind: Input, style: 'width: 300px'},
                    {content: 'Example: John 4; Rom 5:8;'},
                    {kind: Button, content: 'Look up Passage(s)', ontap: 'submitForm'},
                    {tag: 'br'},
                    {tag: 'br'},
                    {components: [
                        {kind: Button, content: 'Random Chapter', ontap: 'submitRandom', random_type: 'Random Chapter', style: 'margin-right: 4px'},
                        {kind: Button, content: 'Random Verse', ontap: 'submitRandom', random_type: 'Random Verse'}
                    ]},
                    {tag: 'br'},
                    {content: 'Enter word(s), phrase(s) or expression(s):'},
                    {name: 'search', kind: Input, style: 'width: 300px'},
                    {tag: 'br'},
                    {tag: 'br'},
                    {components: [
                        {tag: 'span', content: 'Search for: '},
                        {kind: SearchType, name: 'search_type'}
                    ]},
                    {components: [
                        {tag: 'span', content: 'Limit search to: '},
                        {kind: Shortcuts, name: 'shortcut'}
                    ]},
                    {components: [
                        {kind: Checkbox, name: 'whole_words', id: 'whole_words'},
                        {tag: 'label', content: ' Whole words only', attributes: {for: 'whole_words'}}
                    ]},
                    {kind: Button, content: 'Search the Bible', ontap: 'submitForm'},
                    {tag: 'br'},
                    {tag: 'br'},
                    {name: 'tip', content: 'Tip: Entering both a passage and a search query will result in the limitation of the search to the specified passage(s).'}
                ]}

            ]
        }
    ],

    bindings: [
        {from: 'formData.search', to: '$.search.value', oneWay: false},
        {from: 'formData.reference', to: '$.reference.value', oneWay: false},
        {from: 'formData.bible', to: '$.bible.value', oneWay: false, transform: function(value, dir) {
            this.log('bible', value, dir);
            return value || null;
        }}
    ],
    create: function() {
        this.inherited(arguments);
        this.log();
    }
});
