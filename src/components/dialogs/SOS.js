var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');


// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'SosDialog',
    kind: Dialog,
    width: '400px',
    height: '500px',
    classes: 'bible_sos',
    bibleString: null,
    // multiColumn: true,
    
    published: {
        list: [
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
            {label: 'Facing a Crisis', verses: 'Psalms 121; 6:25-34; Hebrews 4:16'},
            {label: 'Faith Fails', verses: 'Psalms 42:5; Hebrews 11'},
            {label: 'Friends Fail', verses: 'Psalms 41:9-13; Luke 17:3-4; Rom 12:14,17,19,21; 2 Timothy 4:16-18', newColumn: true},
            {label: 'Leaving Home', verses: 'Psalms 121; Matthew 10:16-20'},
            {label: 'Lonely', verses: 'Psalms 23; Hebrews 13:5-6'},
            {label: 'Needing God\'s protection', verses: 'Psalms 27:1-6; Psalms 91; Philippians 4:19'},
            {label: 'Needing Guidance', verses: 'Psalms 32:8; Proverbs 3:5-6'},
            {label: 'Needing Peace', verses: 'John 14:1-4; John 16:33; Romans 5:1-5; Philippians 4:6-7'},
            {label: 'Needing Rules for Living', verses: 'Romans 12', newColumn: true},
            {label: 'Overcome', verses: 'Psalms 6; Romans 8:31-39'},
            {label: 'Prayerful', verses: 'Psalms 4; Psalms 42; Luke 11:1-13; John 17; 1 John 5:14-15'},
            {label: 'Protected', verses: 'Psalms 18:1-3; Psalms 34:7'},
            {label: 'Sick or in Pain', verses: 'Psalms 38; James 5:14-15; Matthew 26:39; Romans 5:3-5; 2 Corinthians 12:9-10; 1 Peter 4:12,13,19'},
            {label: 'Sorrowful', verses: 'Psalms 51; Matthew 5:4; John 14; 2 Corinthians 1:3-4; 1 Thessalonians 4:13-18'},
            {label: 'Tempted', verses: 'Psalms 1; Psalms 139:23-24; Matthew 26:41; 1 Corinthians 10:12-14; Philippians 4:8; James 4:7; 2 Peter 2:9; 2 Peter 3:17', newColumn: true},
            {label: 'Thankful', verses: 'Psalms 100; 1 Thessalonians 5:18; Hebrews 13:15'},
            {label: 'Traveling', verses: 'Psalms 121'},
            {label: 'Trouble, In', verses: 'Psalms 16; Psalms 31; John 14:1-4; Hebrews 7:25'},
            {label: 'Troubled', verses: 'John 14:27; John 16:33; 2 Corinthians 4:8-10'},
            {label: 'Weary', verses: 'Psalms 90; Matthew 11:28-30; 1 Corinthians 15:58; Gal 6:9-10'},
        ]
    },

    bodyComponents: [
        {classes: 'sos_header', components: [
            {tag: 'h2', content: 'Bible SOS'}, 
            {tag: 'h3', content: 'Emergency Help from the Bible'}, 
            {tag: 'h3', content: 'Where to go When ...'}, 
        ]},
        {classes: 'sos_list', name: 'ListContainer'}
    ],

    buttonComponents: [
        {name: 'Close', kind: Button, content: 'Close', ontap: 'close'}
    ],

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
        var urlBase = '/#/r/' + this.bibleString + '/';

        this.list.forEach(function(item) {
            var label = item.label + ': ';
            var url = urlBase + item.verses;

            if(item.newColumn && this.multiColumn) {
                col ++;
                colName = 'Col_' + col;
            }

            if(!this.$.ListContainer.$[colName]) {
                this.$.ListContainer.createComponent({
                    name: colName,
                    classes: 'col'
                });
            }

            this.$.ListContainer.$[colName].createComponent({
                verses: item.verses,
                owner: this,
                classes: 'sos_item', components: [
                    {classes: 'label', content: label},
                    {classes: 'verses', content: item.verses, _ontap: 'handleVerseTap', components: [
                        {kind: Anchor, href: url, _title: item.verses, content: item.verses, ontap: 'handleVerseTap'}
                    ]},
                    {classes: 'clear-both'}
                ]
            });
        }, this);
    },
    handleVerseTap: function(inSender, inEvent) {
        // this.log(inSender);
        // this.log(inEvent);

        // var verses = inSender.get('content');
        this.close();

        // this.log(verses);

        // Signal.send('onClickReference', {reference: verses});
        // inEvent.preventDefault();
        // return false;
    }
});
