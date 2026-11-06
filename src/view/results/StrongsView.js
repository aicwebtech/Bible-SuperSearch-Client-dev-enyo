// This renders individual passages
var kind = require('enyo/kind');

module.exports = kind({
    name: 'StrongsView',
    classes: 'biblesupersearch_strongs_view',
    components: [],

    // Handles both the legacy (entry / tvm) and the modern (definition / is_special) definition structures
    _addStrongs: function(item) {
        var head = '';
        var text = '';
        var isModern = typeof item.definition != 'undefined';

        if(item.number.charAt(0) == "H") {
            var classes = 'bss_item bss_hebrew';
        }
        else {
            var classes = 'bss_item bss_greek';
        }

        // Tense / voice / mood entry
        if(isModern ? item.is_special == 1 : (item.tvm && item.tvm != '')) {
            text = isModern ? item.definition : item.tvm;

            var comp = this.createComponent({
                classes: classes,
                components: [
                    {classes: 'bss_strongs_tvm', allowHtml: true, content: text}
                ]
            });
        }
        else {
            head = '<span>' + (item.root_word || '') + '</span> &nbsp; (' + item.number + ')';

            if(item.transliteration || item.pronunciation) {
                head += '<br />' + (item.transliteration || '');
                head += item.pronunciation ? ' (' + item.pronunciation + ')' : '';
            }

            text = isModern ? item.definition : item.entry;

            var comp = this.createComponent({
                classes: classes,
                components: [
                    {classes: 'bss_strongs_head', allowHtml: true, content: head},
                    {classes: 'bss_strongs_body biblesupersearch_strongs_body', allowHtml: true, content: text},
                ]
            });
        }
    },
});
