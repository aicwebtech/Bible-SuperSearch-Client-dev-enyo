// This renders disambiguation items
var kind = require('enyo/kind');
var Anchor = require('enyo/Anchor');
var utils = require('enyo/utils');
var i18n = require('../../components/Locale/i18nContent');

module.exports = kind({
    name: 'DisambiguationView',
    components: [],

    _addItem: function(item) {
        var url = 'Javascript:void(0)';
        var runForm = true;
        var content = item.description;

        if(item.type == 'book') {
            url = '#/p/' + item.data.bible.join(',') + '/' + item.simple + '/1';
            runForm = false;
            content = 'The Book of ' + item.simple;
        }

        this.createComponent({
            classes: 'item',
            formData: item.data,
            ontap: 'handleTap',
            runForm: runForm,
            components: [
                {
                    kind: Anchor,
                    classes: 'std_link',
                    // content: content,
                    components: [
                        {kind: i18n, content: 'The book of'},
                        {tag: 'span', content: ' '},
                        {tag: 'span', content: item.simple}
                    ],
                    href: url
                }
            ]
        });
    },
    handleTap: function(inSender, inEvent) {
        if(inSender.runForm) {
            var formData = utils.clone(inSender.formData);
            this.app.runFormData(formData);
        }
    }
});
