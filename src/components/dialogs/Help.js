var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Dialog = require('./Dialog');

module.exports = kind({
    name: 'HelpDialog',
    kind: Dialog,
    width: '200px',
    height: '130px',
    
    published: {
        message: 'Help me, I cant find it'
    },

    bodyComponents: [
        {name: 'MessageContainer', allowHtml: true}
    ],

    buttonComponents: [
        {name: 'Close', kind: Button, content: 'Close', ontap: 'close'}
    ],

    bindings: [
        {from: 'message', to: '$.MessageContainer.content'}
    ],

    create: function() {
        this.inherited(arguments);
    },

    messageChanged: function(was, is) {

    }
});
