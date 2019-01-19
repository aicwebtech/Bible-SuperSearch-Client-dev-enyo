var kind = require('enyo/kind');
var FormBase = require('../FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var BibleSelect = require('../../components/BibleSelect/MultiSelect');
var SearchType = require('../../components/SearchType');
var Shortcuts = require('../../components/Shortcuts');

module.exports = kind({
    name: 'Expanding',
    kind: FormBase,

    components: [
        {
            classes: 'biblesupersearch_expanding_form expanding',
            components: [
                {classes: 'input_row_wide', components: [
                    {name: 'request', kind: TextArea},
                ]},
                {classes: 'input_row', components: [
                    {classes: 'label', content: 'Bible Version(s):'},
                    {classes: 'element', components: [
                        {name: 'bible', kind: BibleSelect, parallelStart:2, parallelLimit: 6}
                    ]}
                ]},                
                {classes: 'input_row', components: [
                    {classes: 'label', content: 'Limit Search To:'},
                    {classes: 'element', components: [
                        {kind: Shortcuts, name: 'shortcut'}
                    ]}
                ]},                
                {classes: 'input_row', components: [
                    {classes: 'label', content: 'Passages:'},
                    {classes: 'element', components: [
                        {kind: TextArea, name: 'passage'}
                    ]}
                ]},                
                {classes: 'input_row', components: [
                    {classes: 'label', content: 'Search Type:'},
                    {classes: 'element', components: [
                        {kind: SearchType, name: 'search_type'}
                    ]}
                ]},                
                {classes: 'input_row', components: [
                    {classes: 'label', content: 'Whole Words Only:'},
                    {classes: 'element', components: [
                        {kind: Checkbox, name: 'whole_words'}
                    ]}
                ]},               
                {classes: 'input_row', components: [
                    {classes: 'label', content: 'Exact Case:'},
                    {classes: 'element', components: [
                        {kind: Checkbox, name: 'exact_case'}
                    ]}
                ]},

                /*
                {classes: 'biblesupersearch_center_element', components: [
                    {content: 'Select Bible version(s):'},
                    {
                        name: 'bible2', 
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
                        {tag: 'label', content: ' Whole words only', attributes: {for: 'whole_words'}},
                        {tag: 'span', content: '&nbsp; &nbsp;', allowHtml: true},
                        {kind: Checkbox, name: 'exact_case', id: 'exact_case'},
                        {tag: 'label', content: ' Exact Case', attributes: {for: 'exact_case'}}
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
                ]}*/

            ]
        }
    ]

});
