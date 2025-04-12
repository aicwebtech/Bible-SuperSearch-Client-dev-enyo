var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var utils = require('enyo/utils');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'SosDialog',
    kind: Dialog,
    maxWidth: '400px',
    height: '475px',
    classes: 'help_dialog bible_sos',
    bibleString: null,
    titleBarHeight: 64,
    
    published: {
        list: [
            {label: null, verses: 'Romans 3:10, 23; 6:23; 5:8; 10:9, 13; John 3:16; John 14:6; Acts 4:12; Ephesians 2:8, 9'},
            {label: 'Afraid', verses: 'Psalms 34:4; Matthew 10:28; 2 Timothy 1:7; Hebrews 13:5-6'},
            {label: 'Anxious', verses: 'Psalms 46; Matthew 6:19-34; Philippians 4:6; 1 Peter 5:6-7'},
            {label: 'Backsliding', verses: 'Psalms 51; 1 John 1:4-9'},
            {label: 'Bereaved', verses: 'Matthew 5:4; 2 Corinthians 1:3-4'},
            {label: 'Bitter or Critical', verses: '1 Corinthians 13'},
            {label: 'Conscious of Sin', verses: 'Proverbs 28:13'},
            {label: 'Defeated', verses: 'Romans 8:31-39'},
            {label: 'Depressed', verses: 'Psalms 34', newColumn: true},
            {label: 'Disaster Threatens', verses: 'Psalms 91; Psalms 118:5-6; Luke 8:22-25'},
            {label: 'Discouraged', verses: 'Psalms 23; Psalms 42:6-11; Psalms 55:22; Matthew 5:11-12; 2 Corinthians 4:8-18; Philippians 4:4-7'},
            {label: 'Doubting', verses: 'Matthew 8:26; Hebrews 11'},
            {label: 'Facing a Crisis', verses: 'Psalms 121; Matthew 6:25-34; Hebrews 4:16'},
            {label: 'Faith Fails', verses: 'Psalms 42:5; Hebrews 11'},
            {label: 'Friends Fail', verses: 'Psalms 41:9-13; Luke 17:3-4; Romans 12:14,17,19,21; 2 Timothy 4:16-18', newColumn: true},
            {label: 'Hopeless', verses: 'Psalms 71:5; Psalms 42; Lamentations 3:18-26; 1 Peter 1:3, 21'},
            {label: 'Leaving Home', verses: 'Psalms 121; Matthew 10:16-20'},
            {label: 'Lonely', verses: 'Psalms 23; Hebrews 13:5-6'},
            {label: 'Needing God\'s protection', verses: 'Psalms 27:1-6; Psalms 91; Philippians 4:19'},
            {label: 'Needing Guidance', verses: 'Psalms 32:8; Proverbs 3:5-6'},
            {label: 'Needing Peace', verses: 'John 14:1-4; John 16:33; Romans 5:1-5; Philippians 4:6-7'},
            {label: 'Needing Rules for Living', verses: 'Romans 12', newColumn: true},
            {label: 'Overcome', verses: 'Psalms 6; Romans 8:31-39; 1 John 1:4-9'},
            {label: 'Prayerful', verses: 'Psalms 4; Psalms 42; Luke 11:1-13; John 17; 1 John 5:14-15'},
            {label: 'Protected', verses: 'Psalms 18:1-3; Psalms 34:7'},
            {label: 'Sick or in Pain', verses: 'Psalms 38; James 5:14-15; Matthew 26:39; Romans 5:3-5; 2 Corinthians 12:9-10; 1 Peter 4:12,13,19'},
            {label: 'Sorrowful', verses: 'Psalms 51; Matthew 5:4; John 14; 2 Corinthians 1:3-4; 1 Thessalonians 4:13-18'},
            {label: 'Tempted', verses: 'Psalms 1; Psalms 139:23-24; Matthew 26:41; 1 Corinthians 10:12-14; Philippians 4:8; James 4:7; 2 Peter 2:9; 2 Peter 3:17', newColumn: true},
            {label: 'Thankful', verses: 'Psalms 100; 1 Thessalonians 5:18; Hebrews 13:15'},
            {label: 'Traveling', verses: 'Psalms 121'},
            {label: 'Trouble, In', verses: 'Psalms 16; Psalms 31; John 14:1-4; Hebrews 7:25'},
            {label: 'Troubled', verses: 'John 14:1-3, 27; John 16:33; 2 Corinthians 4:8-10'},
            {label: 'Weary', verses: 'Psalms 90; Matthew 11:28-30; 1 Corinthians 15:58; Galatians 6:9-10'},
            {label: 'Worried', verses: 'Matthew 6:19-34; 1 Peter 5:6-7'}
        ]
    },

    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, classes: 'bss_dialog_title', content: 'Emergency Help from the Bible'}, 
            {kind: i18n, classes: 'bss_dialog_subtitle', content: 'Where to go When ...'}, 
        ]}
    ],

    bodyComponents: [
        {classes: 'list sos_list', name: 'ListContainer'}
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
        this.app.set('sosShowing', false);
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
        var list = [];

        // Pre-translate the labels, then sort by the label
        this.list.forEach(function(itemDirty) {
            item = utils.clone(itemDirty);
            item.label = this.app.t(item.label);
            list.push(item);
        }, this);

        list.sort(function(a, b) {
            var labelA = a.label.toUpperCase();
            var labelB = b.label.toUpperCase();

            if(labelA == labelB) {
                return 0;
            }
            else if(labelA < labelB) {
                return -1;
            }
            else {
                return 1;
            }
        });

        list.forEach(function(item) {
            var t = this;
            var versesTranslated = this.app.vt(item.verses);
            var label = item.label ? item.label + ': ' : null;
            var url = urlBase + versesTranslated;
            url = url.replace(/\s+/g, '.');

            if(!this.$.ListContainer.$[colName]) {
                this.$.ListContainer.createComponent({
                    name: colName,
                    classes: 'col'
                });
            }
            
            if(label) {
                this.$.ListContainer.$[colName].createComponent({
                    verses: item.verses,
                    owner: this,
                    classes: 'item sos_item', components: [
                        {classes: 'label', content: label},
                        {classes: 'verses', components: [
                            {kind: Anchor, href: url, _title: versesTranslated, content: versesTranslated, ontap: 'handleVerseTap'}
                        ]},
                        {classes: 'clear-both'}
                    ],
                });
            } else {
                this.$.ListContainer.$[colName].createComponent({
                    verses: item.verses,
                    owner: this,
                    classes: 'item sos_item', components: [
                        // {classes: 'label', content: label},
                        {classes: 'verses_wide', components: [
                            {kind: Anchor, href: url, _title: versesTranslated, content: versesTranslated, ontap: 'handleVerseTap'}
                        ]},
                        // {classes: 'clear-both'}
                    ],
                });
            }
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
