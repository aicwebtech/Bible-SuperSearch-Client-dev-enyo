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
        {style: 'overflow: show', components: [
            {kind: Button, ontap: 'handleCopy', components: [
                {kind: i18n, content: 'Copy'}
            ]},
        ]},
        {name: 'CopyText', tag: 'p', allowHtml: true, style: 'z-index: 500', classes: 'bss_txt'}
    ],
    handleCopy: function(inSender, inEvent) {        
        return this.app._copyComponentContent(this.$.CopyText);
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
