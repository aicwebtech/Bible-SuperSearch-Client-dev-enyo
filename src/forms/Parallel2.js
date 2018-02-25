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
    name: 'ClassicParallel2',
    kind: FormBase,

    components: [
        {classes: 'center', content: 'Bible SuperSearch', classes: 'biblesupersearch_classic_title'},
        {
            classes: 'biblesupersearch_classic_form',
            tag: 'table',

            components: [
                {tag: 'tr', components: [
                    {tag: 'td', attributes: {rowspan: 4}, components: [
                        {
                            name: 'bible', 
                            kind: BibleSelect, 
                            parallelLimit: 4, 
                            parallelStart: 4, 
                            selectorWidth: 300
                        },
                    ]},
                    {tag: 'td', style: 'text-align:right', content: 'Passage'},
                    {tag: 'td', attributes: {colspan: 3}, components: [
                        {name: 'reference', kind: Input, onblur: 'referenceTyped'},
                        {kind: Button, content: 'Look up', ontap: 'submitForm', style: 'width:70px;font-size:70%'},
                    ]}
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', style: 'text-align:right', content: 'Search'},
                    {tag: 'td', attributes: {colspan: 3}, components: [
                        {name: 'search', kind: Input},
                        {kind: Button, content: 'Look up', ontap: 'submitForm', style: 'width:70px;font-size:70%'},
                    ]}
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', style: 'text-align: right; vertical-align: middle', content: 'Look for '},
                    {tag: 'td', style: 'vertical-align: top', components: [
                        {kind: SearchType, name: 'search_type'}, 
                        {tag: 'span', content: ' in '},
                        {kind: Shortcuts, name: 'shortcut'}
                    ]},
                    {tag: 'td', components: [
                        {kind: Button, content: 'Random Verse', random_type: 'Random Verse', ontap: 'submitRandom'}
                    ]}
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', attributes: {colspan: 2}, components: [
                        {kind: Checkbox, name: 'whole_words', id: 'whole_words'},
                        {tag: 'label', content: ' Whole words', attributes: {for: 'whole_words'}},
                        {kind: Checkbox, name: 'exact_case', id: 'exact_case'},
                        {tag: 'label', content: ' Exact Case', attributes: {for: 'exact_case'}}
                    ]},
                    {tag: 'td', components: [
                        {kind: Button, content: 'Random Chapter', random_type: 'Random Chapter', ontap: 'submitRandom'}
                    ]}
                ]}
            ],

            components_: [
                {classes: 'biblesupersearch_center_element', components: [
                    {content: 'Select Bible version(s):'},
                    {
                        name: 'bible', 
                        kind: BibleSelect, 
                        parallelLimit: 4, 
                        parallelStart: 4, 
                        selectorWidth: 300
                    },
                    {tag: 'br'},
                    {content: 'Enter word(s), phrase(s) or expression(s):'},
                    {name: 'search', kind: Input, style: 'width: 100%; max-width: 300px'},
                    {tag: 'br'},
                    {tag: 'br'},
                    {components: [
                        {tag: 'span', content: 'Search for: '},
                        {kind: SearchType, name: 'search_type', style: 'width: 100%; max-width: 200px'}
                    ]},
                    {components: [
                        {tag: 'span', content: 'Limit search to: '},
                        {kind: Shortcuts, name: 'shortcut', style: 'width: 100%; max-width: 200px'}
                    ]},
                    {components: [
                        {kind: Checkbox, name: 'whole_words', id: 'whole_words'},
                        {tag: 'label', content: ' Whole words only', attributes: {for: 'whole_words'}}
                    ]},
                    {tag: 'br'},
                    {kind: Button, content: 'Search the Bible', ontap: 'submitForm'},
                    {tag: 'br'},
                    {tag: 'br'},
                    {content: 'Enter passage(s):'},
                    {name: 'reference', kind: Input, style: 'width: 100%; max-width: 300px', onblur: 'referenceTyped'},
                    { components: [
                        {tag: 'small', content: 'Example: John 4; Rom 5:8;'},
                    ]},
                    {kind: Button, content: 'Look up Passage(s)', ontap: 'submitForm'},
                    {tag: 'br'},
                    {tag: 'br'},
                    {components: [
                        {
                            kind: Button, 
                            content: 'Random Chapter', 
                            ontap: 'submitRandom', 
                            random_type: 'Random Chapter', 
                            style: 'margin-right: 4px', 
                            classes: 'user_friendly_random'
                        },
                        {
                            kind: Button, 
                            content: 'Random Verse', 
                            ontap: 'submitRandom', 
                            random_type: 'Random Verse', 
                            classes: 'user_friendly_random'
                        }
                    ]},
                    {tag: 'br'},
                    {components: [
                        {
                            tag: 'small', 
                            name: 'tip', 
                            content: 'Tip: Entering both a passage and a search query will result in the limitation of the search to the specified passage(s).'
                        }
                    ]}
                ]}

            ]
        }
    ],
    create: function() {
        this.inherited(arguments);
        this.log();
    }
});
