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
            {tag: 'h5', content: 'Basic Search'},
            {content: 'faith'}
        ],
        boolSearch: [
            {tag: 'h5', content: 'Advanced Searches'},
            {content: 'Jesus AND Lord OR Christ'},
            {content: 'Jesus OR Lord NOT Christ'},

        ],
        basicLookup: [
            {tag: 'h5', content: 'Passage Retrieval'},
            {content: 'Romans 8:2'},
            {content: 'Rom 8:2'},
            {content: 'Example: Rom. 8:2'},
            {content: 'Ro. 8:2'},
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
        var urlBase = '#/r/' + this.bibleString + '/';

        section.forEach(function(item, key) {
            var t = this,
                component = {
                    kind: i18nComponent
                };


            if(item.tag) {
                component.tag = item.tag;
                component.content = this.app.t(item.content);
            }
            else {
                component.content = this.app.vt(item.content);
            }

            // var desc = this.app.t(item.desc);
            // var urlVerse = item.linkVerse || item.verse;
            // urlVerse = this.app.vt(urlVerse);
            // verseTrans = this.app.vt(item.verse);
            // var url = urlBase + urlVerse;
            // var numDisplay = (key + 1) + ') ';

            if(!this.$.ListContainer.$[colName]) {
                this.$.ListContainer.createComponent({
                    name: colName,
                    classes: 'col'
                });
            }

            this.$.ListContainer.$[colName].createComponent(component);

            // this.$.ListContainer.$[colName].createComponent({
            //     verses: item.verses,
            //     owner: this,
            //     classes: 'item start_item', components: [
            //         {classes: 'num', content: numDisplay},
            //         {classes: 'verses', components: [
            //             {kind: Anchor, href: url, _title: item.verses, content: verseTrans, ontap: 'handleVerseTap'}
            //         ]},
            //         {classes: 'desc', content: desc, allowHtml: true},
            //         {classes: 'clear-both'}
            //     ]
            // });
        }, this);
    },
    handleVerseTap: function(inSender, inEvent) {
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

