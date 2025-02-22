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
    name: 'BrowsingBookSelector',
    kind: FormBase,
    submitFormOnReferenceChange: true,

    components: [
        {
            kind: FormSection,
            classes: 'biblesupersearch_browsing_form bss_book_selector_vertical',
            components: [
                {classes: 'biblesupersearch_center_element', components: [
                    {
                        name: 'bible', 
                        kind: BibleSelect, 
                        parallelLimit: 4, 
                        parallelStart: 1, 
                        selectorWidth: 300
                    },
                    {tag: 'br'},
                    {name: 'reference', kind: BookSelect},
                    {kind: Button, ontap: 'submitForm', classes: 'bss_submit', components: [
                        {kind: i18nContent, content: 'Go'}
                    ]},
                ]},
                {kind: EtcButtons}

            ]
        },
    ],
    create: function() {
        this.inherited(arguments);
    }
});
