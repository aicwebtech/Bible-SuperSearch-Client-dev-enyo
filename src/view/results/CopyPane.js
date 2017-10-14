var kind = require('enyo/kind');
var Button = require('enyo/Button');
var utils = require('enyo/utils');

module.exports = kind({
    tag: 'td',
    classes: 'biblesupersearch_copy_pane',
    components: [
        {kind: Button, content: 'Copy', ontap: 'handleCopy'},
        {name: 'CopyText', tag: 'p', allowHtml: true}
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
                alert('Copied to clipboard');
            }
            else {
                alert('Failed to copy');
            }
        }
        catch (e) {
            alert('Failed to copy');
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
