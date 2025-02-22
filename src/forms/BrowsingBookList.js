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

module.exports = kind({
    name: 'BrowsingBookList',
    kind: FormBase,

    components: [
        {
            kind: FormSection,
            classes: 'biblesupersearch_browsing_form bss_book_list',
            components: [
                {tag: 'h1', content: 'Book List'},
                {classes: 'biblesupersearch_center_element', components: [
                    {kind: i18n, content: 'Select Bible version(s):'},
                    {
                        name: 'bible', 
                        kind: BibleSelect, 
                        parallelLimit: 4, 
                        parallelStart: 4, 
                        selectorWidth: 300
                    },
                    {tag: 'br'},
                    {kind: i18n, content: 'Enter passage(s):'},
                    {name: 'reference', kind: Input, style: 'width: 100%; max-width: 300px', onblur: 'referenceTyped'},
                ]}

            ]
        },
    ],
    create: function() {
        this.inherited(arguments);
    }
});
