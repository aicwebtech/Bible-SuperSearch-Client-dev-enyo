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
    classes: 'bss_help_dialog bss_bible_start',
    bibleString: null,
    titleBarHeight: 64,
    
    published: {
        list: [
            {verse: 'John', desc:'Life and Teachings of Jesus Christ', linkVerse: 'John/1'},
            {verse: 'Romans', desc: 'Basic Christian Beliefs', linkVerse: 'Romans/1'},
            {verse: 'Genesis, Chapters 1 - 3', desc: 'Creation and the Fall of Man', linkVerse: 'Genesis/1-3'},
            {verse: 'Luke', desc: 'Birth of Christ / Life of Christ', linkVerse: 'Luke/1'},
            {verse: '1 Corinthians', desc: 'Imperfection in Churches and Believers', linkVerse: '1 Corinthians/1'},
            {verse: '2 Corinthians', desc: 'Imperfection in Churches and Believers', linkVerse: '2 Corinthians/1'},
            {verse: 'Mark', desc: 'Life and Teachings of Jesus Christ', linkVerse: 'Mark/1'},
            {verse: 'Genesis, Chapters 4 - 50', desc: 'Early human history, especially that of Israel', linkVerse: 'Genesis/4'},
            {verse: 'Matthew', desc: 'Life and Teachings of Jesus Christ', linkVerse: 'Matthew/1'},
            {verse: 'Galatians', desc: 'The relationship between the Old Testament Law and the Church', linkVerse: 'Galatians/1'},
            {verse: 'Exodus', desc: 'History and Law', linkVerse: 'Exodus/1'},
            {verse: 'Ephesians', desc: 'Salvation by faith, not works', linkVerse: 'Ephesians/1'},
            {verse: 'Philippians', desc: 'Christian life and experience. &nbsp;The Apostle Paul gave up credentials under the OT Law to follow Christ', linkVerse: 'Philippians/1'},
            {verse: 'Isaiah 53', desc: 'Christ the suffering servant', linkVerse: 'Isaiah/53'},
            {verse: 'Psalms 22', desc: 'Christ\'s crucifixion foretold', linkVerse: 'Psalms/22'},
        ]
    },

    titleComponents: [
        {classes: 'bss_header', components: [
            {kind: i18n, classes: 'bss_dialog_title', content: 'New to the Bible?'}, 
            {kind: i18n, classes: 'bss_dialog_subtitle', content: 'Not Sure Where to Begin?'}, 
        ]}
    ],

    bodyComponents: [
        {classes: 'bss_list bss_start_list', name: 'ListContainer'}
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
        var urlBase = '#/p/' + this.bibleString + '/';

        this.list.forEach(function(item, key) {
            var t = this;
            var desc = this.app.t(item.desc);
            var urlVerse = item.linkVerse || item.verse;
            urlVerse = this.app.vt(urlVerse);
            verseTrans = this.app.vt(item.verse);
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
                classes: 'bss_item bss_start_item', components: [
                    {classes: 'bss_num', content: numDisplay},
                    {classes: 'bss_verses', components: [
                        {kind: Anchor, href: url, _title: item.verses, content: verseTrans, ontap: 'handleVerseTap'}
                    ]},
                    {classes: 'bss_desc', content: desc, allowHtml: true},
                    {classes: 'bss-clear-both'}
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
