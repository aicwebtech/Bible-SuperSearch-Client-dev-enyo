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
    classes: 'sos',
    
    published: {
        message: 'Help me, I cant find it', 
        list: [
            {label: 'Lonely', verses: 'Romans 1:1; John 3:15-17, Psalms 23'},
            {label: 'Afraid', verses: 'Isaiah 41:10; Psalms 91'},
            {label: 'Troubled', verses: 'John 16:33'},
            {label: 'Doubting', verses: 'Psalms 17'},
        ]
    },

    bodyComponents: [
        {name: 'MessageContainer', allowHtml: true}, 
        {name: 'ListContainer'}
    ],

    buttonComponents: [
        {name: 'Close', kind: Button, content: 'Close', ontap: 'close'}
    ],

    bindings: [
        {from: 'message', to: '$.MessageContainer.content'}
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
