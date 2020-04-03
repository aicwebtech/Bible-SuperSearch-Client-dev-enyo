var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Dialog = require('./Dialog');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'SosDialog',
    kind: Dialog,
    width: '400px',
    height: '400px',
    classes: 'bible_sos',
    
    published: {
        list: [
            {label: 'Afraid', verses: 'Psalms 34:4; Matt 10:28; 2 Tim 1:7; Hebrews 13:5,6'},
            {label: 'Anxious', verses: 'Psalms 46; Matt 6:19-34; Phil 4:6; 1 Peter 5:6,7'},
            {label: 'Backsliding', verses: 'Psalms 51; 1 John 1:4-9'},
            {label: 'Bereaved', verses: 'Matt 5:4; 2 Corinthians 1:3-4'},
            {label: 'Lonely', verses: 'Psalms 23; Hebrews 13:5,6'},
            {label: 'Discouraged', verses: 'Psalms 23; Psalms 42:6-11; Psalms 55:22; Matthew 5:11, 12; 2 Corinthians 4:8-18; Phil 4:4-7'},
            {label: 'Doubting', verses: 'Matthew 8:26; Hebrews 11'},
            {label: 'Troubled', verses: 'John 16:33'},
        ]
    },

    bodyComponents: [
        {classes: 'sos_header', components: [
            {tag: 'h1', content: 'Bible SOS'}, 
            {tag: 'h2', content: 'Emergency Help from the Bible'}, 
        ]},
        {classes: 'sos_list', name: 'ListContainer'}
    ],

    buttonComponents: [
        {name: 'Close', kind: Button, content: 'Close', ontap: 'close'}
    ],

    bindings: [
        // {from: 'message', to: '$.MessageContainer.content'}
    ],

    create: function() {
        this.inherited(arguments);
        this.populateList();
    },
    close: function() {
        this.app.set('sosShowing', false);
    },
    messageChanged: function(was, is) {

    },
    listChanged: function(was, is) {
        this.populateList();
        this.$.ListContainer.render();
    },
    populateList: function() {
        this.$.ListContainer.destroyClientControls();

        this.list.forEach(function(item) {
            var label = item.label + ': ';

            this.$.ListContainer.createComponent({
                verses: item.verses,
                owner: this,
                // ontap: 'handleVerseTap',
                classes: 'sos_item', components: [
                    {classes: 'label', content: label},
                    // TODO - make these fully-functioning hyperlinks, including right click!
                    {classes: 'verses', content: item.verses, ontap: 'handleVerseTap'},
                    {classes: 'clear-both'}
                ]
            });
        }, this);
    },
    handleVerseTap: function(inSender, inEvent) {
        this.log();
        var verses = inSender.get('content');

        this.log(verses);

        Signal.send('onClickReference', {reference: verses});
    }
});
