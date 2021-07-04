var kind = require('enyo/kind');
var Button = require('enyo/Button');
var utils = require('enyo/utils');
var i18n = require('../../components/Locale/i18nContent');
var signal = require('enyo/Signals');

module.exports = kind({
    tag: 'td',
    classes: 'biblesupersearch_copy_pane',
    displayedBible: null,
    components: [
        {kind: signal, onTriggerCopy: 'handleTriggerCopy'},
        {style: 'height:20px; overflow: show', components: [
            {kind: Button, ontap: 'handleCopy', components: [
                {kind: i18n, content: 'Copy'}
            ]},
        ]},
        {name: 'CopyText', tag: 'p', allowHtml: true, style: 'z-index: 500'}
    ],
    handleCopy: function(inSender, inEvent) {        
        this.log('elementID', this.$.CopyText.id);
        var n = this.$.CopyText.hasNode();
        // n && n.focus();  // doesn't work
        // n && n.select(); // doesn't work

        this.log('node', n);

        if(!n) {
            return;
        }

        // This code for selection all text in a HTML element was migrated from Bible SuperSearch version 3.0
        // This works, but there is probably a better way
        if (document.selection) {
            // this.log('default');
            var div = document.body.createTextRange();
            div.moveToElementText(n);
            div.select();
        }
        else {
            // this.log('alt');
            var div = document.createRange();
            div.setStartBefore(n);
            div.setEndAfter(n);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(div);
        }

        try {
            var success = document.execCommand('copy');

            if(success) {
                this.app.alert('Copied to clipboard', inSender, inEvent);
            }
            else {
                this.app.alert('Failed to copy');
            }
        }
        catch (e) {
            this.app.alert('Failed to copy');
        }
    }, 
    handleTriggerCopy: function(inSender, inEvent) {
        this.log();
        if(this.displayedBible == 1) {
            this.handleCopy(inEvent.inSender, inEvent.inEvent);
        }
    },
    appendText: function(text) {
        var curText = this.$.CopyText.get('content') || '';
        var text = text || '';
        this.$.CopyText.set('content', curText + text);
    },
    clearText: function() {
        this.$.CopyText.set('content', null);
    }
});
