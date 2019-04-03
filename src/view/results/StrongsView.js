// This renders individual passages
var kind = require('enyo/kind');

module.exports = kind({
    name: 'StrongsView',
    components: [],

    // Duplicated from strongs hover - hover dialog needs to use this kind!
    _addStrongs: function(item) {
        this.log('strongs item', item);
        var head = '';
        var text = '';

        if(item.number.charAt(0) == "H"){
            var classes = 'item hebrew';
        }
        else {
            var classes = 'item greek';
        }

        if(item.tvm && item.tvm != '') {
            text = item.tvm;

            var comp = this.createComponent({
                classes: classes,
                components: [
                    {classes: 'strongs_tvm', allowHtml: true, content: item.tvm}
                ]
            });
        }
        else {
            head = '<span>' + item.root_word + '</span> &nbsp; (' + item.number + ')<br />' + item.transliteration + ' (' + item.pronunciation + ')';
            text = item.entry;
    
            var comp = this.createComponent({
                classes: classes,
                components: [
                    {classes: 'strongs_head', allowHtml: true, content: head},
                    {classes: 'strongs_body', allowHtml: true, content: text},
                ]
            });
        }
    },
});
