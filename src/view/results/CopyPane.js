var kind = require('enyo/kind');
var Button = require('enyo/Button');
var TextArea = require('enyo/TextArea');
var utils = require('enyo/utils');

module.exports = kind({
    tag: 'td',
    classes: 'biblesupersearch_copy_pane',
    components: [
        {kind: Button, content: 'Copy', ontap: 'handleCopy'},
        {name: 'CopyText', kind: TextArea, disabled: true, selectOnFocus: true}
    ],
    handleCopy: function(inSender, inEvent) {
        // alert(this.$.CopyText.get('value'));
        // utils.asyncMethod(this.$.CopyText, 'selectContents');
        // this.$.CopyText.focus();
        
        var id = this.$.CopyText.id;
        this.log('elementID', id);
        // var n = document.getElementById(this.$.CopyText.id);

        var n = this.$.CopyText.hasNode();
        // n && n.focus();
        // n && n.select();

        // this.log(n);

        // Code copeid from enyo core, not working with textarea
        // if (n && n.setSelectionRange) {
        //     this.log('setSelectionRange');
        //     // n.setSelectionRange(0, n.value.length);
        //     n.setSelectionRange(0, 100);
        // } 
        // else if (n && n.createTextRange) {
        //     this.log('createTextRange');
        //     var r = n.createTextRange();
        //     r.expand('textedit');
        //     r.select();
        // }

        // This code for selection all text in a HTML element was migrated from Bible SuperSearch version 3.0
        // This works, but there is probably a better way
        if (document.selection) {
            var div = document.body.createTextRange();
            div.moveToElementText(n);
            div.select();
        }
        else {
            var div = document.createRange();
            div.setStartBefore(n);
            div.setEndAfter(n);
            window.getSelection().addRange(div);
        }

        // this.$.CopyText.hasNode().select();
        
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
        var curText = this.$.CopyText.get('value') || '';
        var text = text || '';
        this.$.CopyText.set('value', curText + text);
    },
    clearText: function() {
        this.$.CopyText.set('value', null);
    }
})