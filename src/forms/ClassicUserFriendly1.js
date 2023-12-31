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
var EtcButtons = require('../components/DialogEtcButtons/DialogEtcButtonsHtml');
var i18nContent = require('../components/Locale/i18nContent');
var i18n = require('../components/Locale/i18nComponent');
var Autocomplete = require('../components/PseudoSelect/PseudoAutocompleteReference');

module.exports = kind({
    name: 'ClassicUserFriendly2',
    kind: FormBase,

    components: [
        {kind: i18n, classes: 'center', content: 'Bible SuperSearch', classes: 'biblesupersearch_classic_title'},
        {
            kind: FormSection,
            classes: 'biblesupersearch_classic_form user_friendly',
            components: [
                {classes: 'biblesupersearch_center_element', components: [
                    {kind: i18n, content: 'Select Bible version(s):'},
                    {
                        name: 'bible', 
                        kind: BibleSelect, 
                        parallelLimit: 8,
                        parallelStart: 4, 
                        selectorWidth: 300
                    },
                    {tag: 'br'},
                    
                    {kind: i18n, content: 'Enter word(s), phrase(s) or expression(s):'},
                    {name: 'search', kind: Input, style: 'width: 100%; max-width: 300px'},
                    {tag: 'br'},
                    {tag: 'br'},         
                    {components: [
                        {kind: i18nContent, tag: 'span', content: 'Search for:'},
                        {tag: 'span', content: ' '},
                        {kind: SearchType, name: 'search_type', style: 'width: 100%; max-width: 200px'}
                    ]},                    
                    {components: [
                        {kind: i18nContent, tag: 'span', content: 'Limit search to:'},
                        {tag: 'span', content: ' '},
                        {kind: Shortcuts, name: 'shortcut', style: 'width: 100%; max-width: 200px'}
                    ]},
                    {tag: 'br'},
                    {components: [
                        {kind: Checkbox, name: 'whole_words', id: 'whole_words'},
                        {tag: 'span', content: ' '},
                        {kind: i18nContent, tag: 'label', content: 'Whole words only', attributes: {for: 'whole_words'}},
                        {tag: 'span', content: '&nbsp; &nbsp;', allowHtml: true},
                        {kind: Checkbox, name: 'exact_case', id: 'exact_case'},
                        {tag: 'span', content: ' '},
                        {kind: i18nContent, tag: 'label', content: 'Exact Case', attributes: {for: 'exact_case'}}
                    ]},
                    {tag: 'br'},
                    {kind: Button, ontap: 'submitForm', components: [
                        {kind: i18nContent, content: 'Search the Bible'}
                    ]},
                    {tag: 'br'},
                    {tag: 'br'},
                    {kind: i18n, content: 'Enter passage(s):'},
                    {name: 'reference', kind: Autocomplete, style: 'width: 100%; max-width: 300px', onblur: 'referenceTyped'},
                    { components: [
                        {kind: i18nContent, tag: 'small', content: 'Example:'},
                        {kind: i18nContent, tag: 'small', containsVerses: true, content: ' John 4; Romans 5:8;'}
                    ]},
                    {kind: Button, ontap: 'submitForm', components: [
                        {kind: i18nContent, content: 'Look up Passage(s)'}
                    ]},
                    {tag: 'br'},
                    {tag: 'br'},
                    {components: [
                        {
                            kind: Button, 
                            content: 'Random Chapter', 
                            ontap: 'submitRandom', 
                            random_type: 'Random Chapter', 
                            style: 'margin-right: 4px', 
                            classes: 'user_friendly_random', 
                            components: [
                                {kind: i18nContent, content: 'Random Chapter'}
                            ]
                        },
                        {
                            kind: Button, 
                            content: 'Random Verse', 
                            ontap: 'submitRandom', 
                            random_type: 'Random Verse', 
                            classes: 'user_friendly_random',
                            components: [
                                {kind: i18nContent, content: 'Random Verse'}
                            ]
                        }
                    ]},
                    {tag: 'br'},
                    {components: [
                        {
                            kind: i18nContent,
                            tag: 'small', 
                            name: 'tip', 
                            content: 'Tip: Entering both a passage and a search query will result in the limitation of the search to the specified passage(s).'
                        }
                    ]},
                    {kind: EtcButtons}
                ]}

            ]
        },
    ],
    create: function() {
        this.inherited(arguments);
    }
});
