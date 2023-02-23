var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var Checkbox = require('enyo/Checkbox');
var BibleSelect = require('../components/BibleSelect/MultiSelect');
var BookSelect = require('../components/BookSelect');
var FormSection = require('./FormSection');
var EtcButtons = require('../components/DialogEtcButtons/DialogEtcButtonsHtml');
var i18nContent = require('../components/Locale/i18nContent');

module.exports = kind({
    name: 'BrowsingBookSelectorHorizontal',
    kind: FormBase,
    submitFormOnReferenceChange: true,

    components: [
        {
            kind: FormSection,
            classes: 'biblesupersearch_browsing_form book_selector_horizontal',
            components: [
                {classes: 'biblesupersearch_center_element', components: [
                    {
                        kind: BibleSelect, 
                        name: 'bible', 
                        tag: 'span',
                        parallelLimit: 1,
                        selectorWidth: 300,
                        classes: 'inline_block'
                    },
                    {tag: 'span', style: 'white-space: nowrap;', components: [
                        {name: 'reference', kind: BookSelect},
                        {kind: Button, ontap: 'submitForm', classes: 'submit', components: [
                            {kind: i18nContent, content: 'Go'}
                        ]}
                    ]}
                ]},

            ]
        },
    ],
    create: function() {
        this.inherited(arguments);
    }
});
