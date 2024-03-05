var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');
var i18nComponent = require('../Locale/i18nComponent');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'HelpDialog',    
    kind: Dialog,
    maxWidth: '500px',
    height: '475px',
    classes: 'help_dialog help',
    bibleString: null,
    titleBarHeight: 64,
    
    published: {
        section: null
    },

    sections: {
        basicSearch: [
            {tag: 'h3', content: 'Basic Searches'},
                {content: 'faith', link: 'search'},
                {content: 'Romans, searched for faith', link: 'both', reference: 'Romans', search: 'faith'},
                {tag: 'h4', kind: i18n, content: 'All Words'},
                    {content: 'faith hope', link: 'search', search: 'faith hope', searchType: 'all_words'},            
                    {content: 'preserve words', link: 'search', search: 'preserve words', searchType: 'all_words'},            
                {tag: 'h4', kind: i18n, content: 'Any Word'},
                    {content: 'faith hope', link: 'search', search: 'faith hope', searchType: 'or'},            
                    {content: 'preserve words', link: 'search', search: 'preserve words', searchType: 'or'},            
                {tag: 'h4', kind: i18n, content: 'Words Within 5 Verses'},
                    {content: 'faith hope', link: 'search', search: 'faith hope', searchType: 'proximity'},            
                    {content: 'preserve words', link: 'search', search: 'preserve words', searchType: 'proximity'},                
                {tag: 'h4', kind: i18n, content: 'Exact Phrase'},
                    {content: 'faith hope', link: 'search', search: 'faith hope', searchType: 'phrase'},            
                    {content: 'preserve words', link: 'search', search: 'preserve words', searchType: 'phrase'},                
                {tag: 'h4', kind: i18n, content: 'Only One Word'},
                    {content: 'faith hope', link: 'search', search: 'faith hope', searchType: 'xor'},            
                    {content: 'preserve words', link: 'search', search: 'preserve words', searchType: 'xor'},
                {tag: 'h4', kind: i18n, content: 'Wildcard'},         
                {tag: 'div', components: [
                    {tag: 'span', content: '<b>*</b> &nbsp;', allowHtml: true},
                    {kind: i18n, content: 'Matches unlimited characters'}
                ]},
            {tag: 'br'},
            {content: 'stand*', link: 'search'},
        ],
        basicLookup: [
            {tag: 'h3', content: 'Passage Retrieval'},
            {content: 'Romans 8:2', link: 'passage'},
            {content: 'Rom 8:2', link: 'passage'},
            {content: 'Ro. 8:2', link: 'passage'},
            {content: 'Rom 3:23, 6:23, 5:8, 10:9,13;', link: 'passage'},
            {content: 'Ephesians 2:8,9; Acts 4:12; John 8:31-32,36', link: 'passage'},
            {content: 'John 13:36 - 14:3', link: 'passage'},

        ],

        // :todo - add shortcut list here!
        limitingSearches: [
            {tag: 'h3', kind: i18n, content: 'Limiting Searches'},
            // {tag: 'h4', kind: i18n, content: 'Preset Limits'},
            {tag: 'table', classes: 'bss_shortcuts_table', components: [
                {tag: 'thead', components: [
                    {tag: 'th', kind: i18n, content: 'Name'},
                    {tag: 'th', kind: i18n, content: 'Alias'},
                    {tag: 'th', kind: i18n, content: 'Passages'},
                ]},
                {name: 'Shortcuts', tag: 'tbody', components: []}
            ]},
            // {tag: 'h4', kind: i18n, content: 'Custom Limits'},
        ],

        specialFormatting: [
            {tag: 'h3', content: 'Formatting'},
            
            {tag: 'h4', content: 'Highlight'},
            {tag: 'div', components: [
                {tag: 'span', kind: i18n, content: 'highlight_description'},
            ]},            

            {tag: 'h4', content: 'Red Letter'},
            {tag: 'div', components: [
                {tag: 'span', kind: i18n, content: 'red_letter_description'},
                {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;('},
                {tag: 'span', kind: i18n, content: 'Supported Bibles Only'},
                {tag: 'span', content: '.)'}
            ]},            

            {tag: 'h4', content: 'Italics'},
            {tag: 'div', components: [
                {tag: 'span', kind: i18n, content: 'italics_description'},
                {tag: 'span', allowHtml: true, content: '&nbsp; &nbsp;('},
                {tag: 'span', kind: i18n, content: 'Supported Bibles Only'},
                {tag: 'span', content: '.)'}
            ]},            

            {tag: 'h4', content: 'Strong\'s'},
            {tag: 'div', components: [
                {tag: 'span', kind: i18n, content: 'strongs_numbers_description'},
                {tag: 'span', allowHtml: true, content: '&nbsp; &nbsp;('},
                {tag: 'span', kind: i18n, content: 'Supported Bibles Only'},
                {tag: 'span', content: '.)'}
            ]},
        ],
        boolSearch: [
            {tag: 'h3', content: 'Advanced Searches using Boolean'},
            {tag: 'div', components: [
                {kind: i18n, content: 'Select'},
                {tag: 'span', content: ' \''},
                {kind: i18n, content: 'Boolean Expression'},
                {tag: 'span', content: '\''}
            ]},
            {tag: 'br'},
            {tag: 'table', classes: 'biblesupersearch_center_element',components: [
                {tag: 'tr', components: [
                    {tag: 'th', kind: i18n, content: 'Operators', attributes: {colspan: 3}}
                ]},
                {tag: 'tr', components: [
                    {tag: 'th', kind: i18n, content: 'Operator'},
                    {tag: 'th', kind: i18n, content: 'Aliases'},
                    {tag: 'th', kind: i18n, content: 'Description'},
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', content: 'AND'},
                    {tag: 'td', content: '&'},
                    {tag: 'td', classes: 'desc', kind: i18n, content: 'Match both'}
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', content: 'OR'},
                    {tag: 'td', content: '|'},
                    {tag: 'td', classes: 'desc', kind: i18n, content: 'Match either'}
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', content: 'XOR'},
                    {tag: 'td', content: '^'},
                    {tag: 'td', classes: 'desc', kind: i18n, content: 'Match only one'}
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', content: 'NOT'},
                    {tag: 'td', content: '-'},
                    {tag: 'td', classes: 'desc', kind: i18n, content: 'Does not match'}
                ]},
                {tag: 'tr', components: [
                    {tag: 'td', content: 'CHAP'},
                    {tag: 'td', content: ''},
                    {tag: 'td', classes: 'desc', kind: i18n, content: 'Matches words in the same chapter'}
                ]},                     
                {tag: 'tr', components: [
                    {tag: 'td', content: 'BOOK'},
                    {tag: 'td', content: ''},
                    {tag: 'td', classes: 'desc', kind: i18n, content: 'Matches words in the same book'}
                ]},                
                {tag: 'tr', components: [
                    {tag: 'td', content: 'PROX(N)'},
                    {tag: 'td', content: ''},
                    {tag: 'td', classes: 'desc', kind: i18n, content: 'Matches words in the same book, and within N verses of each other'}
                ]},                
                {tag: 'tr', components: [
                    {tag: 'td', content: 'PROC(N)'},
                    {tag: 'td', content: ''},
                    {tag: 'td', classes: 'desc', kind: i18n, content: 'Matches words in the same chapter, and within N verses of each other'}
                ]}
            ]},

            {tag: 'br'},
            {content: 'Jesus AND Lord OR Christ', link: 'search', searchType: 'boolean'},
            {content: '(Lord OR Christ) AND Jesus', link: 'search', searchType: 'boolean'},
            {content: '(preserved OR stand) AND (word OR truth)', link: 'search', searchType: 'boolean'},
            {content: '"Lord Jesus" OR Christ', link: 'search', searchType: 'boolean'},

            {tag: 'h4', content: 'Special Proximity Operators'},
            {content: 'preserve PROX(4) words OR truth', link: 'search', searchType: 'boolean'},
            {content: 'faith PROX(4) joy PROX(10) hope', link: 'search', searchType: 'boolean'},
            {content: 'faith CHAP joy OR hope', link: 'search', searchType: 'boolean'},

            {tag: 'br'},
            {content: 'Note: PROX / CHAP operators cannot be enclosed within parentheses or brackets.'},
            {tag: 'br'},
            // {content: 'For details, please see the User\'s Manual.'},
            // {tag: 'br'},
        ],
    },

    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, classes: 'bss_dialog_title', content: 'Bible SuperSearch'}, 
            {kind: i18n, classes: 'bss_dialog_subtitle', content: 'Quick Start Guide'}
        ]}
    ],

    bodyComponents: [
        {classes: 'list start_list', name: 'ListContainer'},
        { classes: 'link', components: [
            {tag: 'hr'}, 
            {tag: 'a', content: 'www.BibleSuperSearch.com', attributes: {href: 'https://www.biblesupersearch.com', target: '_NEW'}},
            {tag: 'hr'}
        ]}
    ],

    buttonComponents: [
        {name: 'UsersManual', kind: Button, ontap: 'usersManual', showing: false, components: [
            {kind: i18n, content: 'User\'s Manual'},
        ]},
        {name: 'UmSpacer', tag: 'span', allowHtml: true, content: '&nbsp; &nbsp;', showing: false}, 
        {name: 'Close', kind: Button, ontap: 'close', components: [
            {kind: i18n, content: 'Close'},
        ]}
    ],

    handlers: {
        onLocaleChange: 'localeChanged',
        onShowHelp: 'showHelp'
    },

    create: function() {
        if(this.multiColumn) {
            this.width = '1200px';
        }

        this.inherited(arguments);

        var statics = this.app.get('statics'),
            shortcuts = statics.shortcuts;
            limSearchIdx = 1;
        
        this.sections.limitingSearches[limSearchIdx].components[1].components = [];

        for(i in shortcuts) {
            if(!this.app.configs.shortcutsShowHidden && shortcuts[i].display == '0') {
                continue;
            }

            this.sections.limitingSearches[limSearchIdx].components[1].components.push({
                tag: 'tr',
                components: [
                    {tag: 'td', kind: i18n, content: shortcuts[i].name},
                    {tag: 'td', kind: i18n, content: shortcuts[i].short1}, // not returned by API
                    {tag: 'td', kind: i18n, content: shortcuts[i].reference, containsVerses: true},
                ]
            })
        }

        this.populateList();

        if(this.app.configs.legacyManual) {
            this.$.UsersManual.set('showing', true);
            this.$.UmSpacer.set('showing', true);
        }
    },
    close: function() {
        this.set('showing', false);
        this.app.set('helpShowing', false);
    },
    usersManual: function() {
        window.open(
            this.app.get('rootDir') +  '/user_guide.html', 
            'helpDialog',
            'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes,height=800,width=600'
        );

        this.close();
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);

        if(is && this.app.getSelectedBiblesString() != this.bibleString) {
            this.populateList(); // redraww the list because the URLs have changed
            this.$.ListContainer.render();
        }
    },
    sectionChanged: function(was, is) {
        this.populateList();
        this.$.ListContainer.render();
    },
    populateList: function() {
        this.$.ListContainer.destroyClientControls();
        
        if(this.section && this.sections[section]) {
            return this._populateListSection(this.sections[section]);
        }

        for(i in this.sections) {
            this._populateListSection(this.sections[i]);
        }
    },
    _populateListSection: function(section) {
        var col = 1;
            colName = 'Col_1';

        this.bibleString = this.app.getSelectedBiblesString();
        var passageUrlBase = '#/r/' + this.bibleString + '/';
        var searchUrlBase  = '#/s/' + this.bibleString + '/';
        var formUrlBase    = '#/f/';

        section.forEach(function(item, key) {
            var t = this,
                component = {
                    kind: i18nComponent
                },
                url = null,
                linkType = item.link || null;

            if(item.tag) {
                component.tag = item.tag;
                component.content = this.app.t(item.content);
                component.components = item.components;
                component.classes = item.classes;
                component.allowHtml = item.allowHtml || false;
            }
            else {
                component.content = this.app.vt(item.content);
            }

            if(!this.$.ListContainer.$[colName]) {
                this.$.ListContainer.createComponent({
                    name: colName,
                    classes: 'col'
                });
            }

            if(linkType == 'passage') {
                trans = this.app.vt(item.content);
                url = passageUrlBase + trans;
            }
            else if(linkType == 'search') {
                trans = this.app.wt(item.content);
                url = searchUrlBase + trans;

                if(item.searchType) {
                    url += '/1/' + item.searchType;
                }
            }
            else if(linkType == 'both') {
                trans = this.app.vt(item.content);

                url = searchUrlBase + this.app.wt(item.search) + '/';

                if(item.searchType) {
                    url += item.searchType;
                }

                url += '//' + this.app.vt(item.reference);
            }
            else if(linkType == 'form') {
                var formData = item.formData,
                    trans = this.app.wt(item.content);

                if(formData.reference) {
                    formData.reference = this.app.vt(formData.reference);
                }                

                if(formData.search) {
                    formData.search = this.app.wt(formData.search);
                }

                formData.bible = this.bibleString;
                url = formUrlBase + encodeURI( JSON.stringify(formData) );
            }

            if(url) {
                url = url.replace(/\s+/g, '.');

                this.$.ListContainer.$[colName].createComponent({
                    owner: this,
                    classes: 'link',
                    components: [
                        {kind: Anchor, href: url, content: trans, ontap: 'handleLinkTap'}
                    ]
                });
            }
            else {
                this.$.ListContainer.$[colName].createComponent(component);
            }
        }, this);
    },
    handleLinkTap: function(inSender, inEvent) {
        this.close();
    },
    localeChanged: function(inSender, inEvent) {
        this.populateList();
        this.$.ListContainer.render();
    },
    showHelp: function(inSender, inEvent) {
        this.set('section', inEvent.section || null);
        this.set('showing', true);
    }
});

