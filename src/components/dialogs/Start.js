var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'StartDialog',
    kind: Dialog,
    maxWidth: '400px',
    height: '475px',
    classes: 'help_dialog bible_start',
    bibleString: null,
    
    published: {
        list: [
            {verse: 'John', desc:'Life and Teachings of Jesus Christ'},
            {verse: 'Romans', desc: 'Basic Christian Beliefs'},
            {verse: 'Genesis, Chapters 1 - 3', desc: 'Creation and the Fall of Man', linkVerse: 'Genesis 1 - 3'},
            {verse: 'Luke', desc: 'Birth of Christ / Life of Christ'},
            {verse: '1 Corinthians', desc: 'Imperfection in Churches and Believers'},
            {verse: '2 Corinthians', desc: 'Imperfection in Churches and Believers'},
            {verse: 'Mark', desc: 'Life and Teachings of Jesus Christ'},
            {verse: 'Genesis, Chapters 4 - 50', desc: 'Early human history, especially that of Israel', linkVerse: 'Genesis 4 - 50'},
            {verse: 'Matthew', desc: 'Life and Teachings of Jesus Christ'},
            {verse: 'Galatians', desc: 'The relationship between the Old Testament Law and the Church'},
            {verse: 'Exodus', desc: 'History and Law'},
            {verse: 'Ephesians', desc: 'Salvation by faith, not works'},
            {verse: 'Philippians', desc: 'Christian life and experience. &nbsp;The Apostle Paul gave up credentials under the OT Law to follow Christ'},
            {verse: 'Isaiah 53', desc: 'Christ the suffering servant'},
            {verse: 'Psalm 22', desc: 'Christ’s crucifixion foretold'},
        ]
    },

    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, tag: 'h3', content: 'New to the Bible?'}, 
            {kind: i18n, tag: 'h4', content: 'Not Sure Where to Begin?'}, 
            // {tag: 'h4', content: 'Here\'s a reading list to get you started'}, 
        ]}
    ],

    bodyComponents: [
        {classes: 'list start_list', name: 'ListContainer'}
    ],

    buttonComponents: [
        {name: 'Close', kind: Button, ontap: 'close', components: [
            {kind: i18n, content: 'Close'},
        ]}
    ],

    handlers: {
        onLocaleChange: 'localeChanged',
    },

    create: function() {
        if(this.multiColumn) {
            this.width = '1200px';
        }

        this.inherited(arguments);
        this.populateList();
    },
    close: function() {
        this.app.set('startShowing', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);

        if(is && this.app.getSelectedBiblesString() != this.bibleString) {
            this.populateList(); // redraww the list because the URLs have changed
            this.$.ListContainer.render();
        }
    },
    listChanged: function(was, is) {
        this.populateList();
        this.$.ListContainer.render();
    },
    populateList: function() {
        this.$.ListContainer.destroyClientControls();
        var col = 1;
            colName = 'Col_1';

        this.bibleString = this.app.getSelectedBiblesString();
        var urlBase = '#/r/' + this.bibleString + '/';

        this.list.forEach(function(item, key) {
            var desc = this.app.t(item.desc);
            var urlVerse = item.linkVerse || item.verse;
            var url = urlBase + urlVerse;
            var numDisplay = (key + 1) + ') ';

            if(!this.$.ListContainer.$[colName]) {
                this.$.ListContainer.createComponent({
                    name: colName,
                    classes: 'col'
                });
            }

            this.$.ListContainer.$[colName].createComponent({
                verses: item.verses,
                owner: this,
                classes: 'item start_item', components: [
                    {classes: 'num', content: numDisplay},
                    {classes: 'verses', components: [
                        {kind: Anchor, href: url, _title: item.verses, content: item.verse, ontap: 'handleVerseTap'}
                    ]},
                    {classes: 'desc', content: desc, allowHtml: true},
                    {classes: 'clear-both'}
                ]
            });
        }, this);
    },
    handleVerseTap: function(inSender, inEvent) {
        this.close();
    },
    localeChanged: function(inSender, inEvent) {
        this.populateList();
        this.render();
    }
});
