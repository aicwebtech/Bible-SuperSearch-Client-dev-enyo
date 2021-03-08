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
    maxWidth: '400px',
    height: '475px',
    classes: 'help_dialog help',
    bibleString: null,
    
    published: {
        section: null
    },

    sections: {
        basicSearch: [
            {tag: 'h3', content: 'Basic Search'},
            {content: 'faith', link: 'search'},
            {content: 'Wildcards: \'_\' and \'%\''},
        ],
        boolSearch: [
            {tag: 'h3', content: 'Advanced Searches using Boolean'},
            {content: 'Select Boolean Search'},
            {content: 'Jesus AND Lord OR Christ', link: 'search', searchType: 'boolean'},
            {content: '(Lord OR Christ) AND Jesus', link: 'search', searchType: 'boolean'},
            {content: '(preserved OR stand) AND (word OR truth)', link: 'search', searchType: 'boolean'},

            {tag: 'h4', content: 'Special Proximity Operators'},
            {content: 'preserve PROX(4) words OR truth'},
            {content: 'Note: PROX / CHAP operators cannot be enclosed within parentheses or brackets.'}
        ],
        basicLookup: [
            {tag: 'h3', content: 'Passage Retrieval'},
            {content: 'Romans 8:2', link: 'passage'},
            {content: 'Rom 8:2', link: 'passage'},
            {content: 'Rom. 8:2', link: 'passage'},
            {content: 'Ro. 8:2', link: 'passage'},
            {content: 'Rom 3:23, 6:23, 5:8, 10:9,13;', link: 'passage'},
            {content: 'Ephesians 2:8,9; Acts 4:12; John 8:31-32,36', link: 'passage'},
            {content: '1 Corinthians 4:8 - 5:2', link: 'passage'},

        ],
    },

    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, tag: 'h3', content: 'Bible SuperSearch'}, 
            {kind: i18n, tag: 'h4', content: 'Quick Start Guide'}
        ]}
    ],

    bodyComponents: [
        {classes: 'list start_list', name: 'ListContainer'}
    ],

    buttonComponents: [
        {name: 'UsersManual', kind: Button, ontap: 'usersManual', components: [
            {kind: i18n, content: 'User\'s Manual'},
        ]},
        {tag: 'span', allowHtml: true, content: '&nbsp; &nbsp;'}, 
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
        this.populateList();
    },
    close: function() {
        this.set('showing', false);
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
        var searchUrlBase = '#/s/' + this.bibleString + '/';
        var bothUrlBase = '#/f/';

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
                url = passageUrlBase + item.content;
                trans = this.app.vt(item.content);
            }
            else if(linkType == 'search') {
                trans = this.app.t(item.content);
                url = searchUrlBase + item.content;

                if(item.searchType) {
                    url += '/' + item.searchType;
                }
            }
            else if(linkType == 'both') {
                // Untested
                var formData = {
                    reference: item.reference,
                    search: item.search,
                    bible: this.bibleString,
                }

                url = bothUrlBase + JSON.stringify(formData);
                trans = this.app.vt(item.content);
            }

            if(url) {
                this.$.ListContainer.$[colName].createComponent({
                    owner: this,
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

