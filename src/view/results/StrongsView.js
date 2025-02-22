// This renders individual passages
var kind = require('enyo/kind');

module.exports = kind({
    name: 'StrongsView',
    classes: 'biblesupersearch_strongs_view',
    components: [],

    _addStrongs: function(item) {
        var head = '';
        var text = '';

        if(item.number.charAt(0) == "H") {
            var classes = 'bss_item bss_hebrew';
        }
        else {
            var classes = 'bss_item bss_greek';
        }

        if(item.tvm && item.tvm != '') {
            text = item.tvm;

            var comp = this.createComponent({
                classes: classes,
                components: [
                    {classes: 'bss_strongs_tvm', allowHtml: true, content: item.tvm}
                ]
            });
        }
        else {
            head = '<span>' + item.root_word + '</span> &nbsp; (' + item.number + ')<br />' + item.transliteration + ' (' + item.pronunciation + ')';
            text = item.entry;
    
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
