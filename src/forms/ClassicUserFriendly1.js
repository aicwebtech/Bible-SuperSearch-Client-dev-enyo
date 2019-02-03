var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var BibleSelect = require('../components/BibleSelect/MultiSelect');
var SearchType = require('../components/SearchType');
var Shortcuts = require('../components/Shortcuts');
var FormSection = require('./FormSection');

module.exports = kind({
    name: 'ClassicUserFriendly2',
    kind: FormBase,

    components: [
        {classes: 'center', content: 'Bible SuperSearch', classes: 'biblesupersearch_classic_title'},
        {
            kind: FormSection,
            classes: 'biblesupersearch_classic_form user_friendly',
            components: [
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
                ]}

            ]
        }
    ],
    create: function() {
        this.inherited(arguments);
    }
});
