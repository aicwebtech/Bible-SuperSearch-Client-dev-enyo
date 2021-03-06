var kind = require('enyo/kind');
var Select = require('../Select');
// var Select = require('enyo/Select');
var Locales = require('../../i18n/LocaleLoader')

module.exports = kind({
    kind: Select,

    handlers: {
        onLocaleChange: 'handleLocaleChange'
    },

    create: function() {
        this.inherited(arguments);

        if(!this.app.debug) {
            this.set('showing', false);
        }

        for(i in Locales) {
            if(!Locales[i] || !Locales[i].meta || !Locales[i].meta.lang_name_en) {
                continue;
            }

            var langName = Locales[i].meta.lang_name || Locales[i].meta.lang_name_en

            this.createComponent({
                content: langName + ' (' + i.toUpperCase() + ')',
                value: i
            });
        }
    },

    change: function(inSender, inEvent) {
        this.inherited(arguments);
        // this.log(inSender.getValue());
        this.app.set('locale', this.getValue());
    }, 

    handleLocaleChange: function() {
        this.setSelectedByValue(this.app.get('locale'));
    }
});