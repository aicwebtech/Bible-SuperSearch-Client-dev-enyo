var kind = require('enyo/kind');
var Select = require('../Select');
var Signal = require('../../components/Signal');
var Locales = require('../../i18n/LocaleLoader')

module.exports = kind({
    kind: Select,

    handlers: {
        onLocaleChange: 'handleLocaleChange'
    },

    create: function() {
        this.inherited(arguments);

        for(i in Locales) {
            if(!Locales[i] || !Locales[i].meta || !Locales[i].meta.lang_name_en) {
                continue;
            }

            var ldb = Locales[i].meta.debug || false;
            var langName = Locales[i].meta.lang_name || Locales[i].meta.lang_name_en;

            if(ldb && !this.app.debug && !this.app.configs.debugLocale) {
                continue;
            }

            this.createComponent({
                content: langName + ' (' + i.toUpperCase() + ')',
                value: i
            });
        }

        this.app.debug && this.log('init locale on selector', this.app.get('locale'));
        this.handleLocaleChange();
    },

    change: function(inSender, inEvent) {
        this.inherited(arguments);
        this.app.set('locale', this.getValue());
        Signal.send('onChangeLocaleManual');
    }, 

    handleLocaleChange: function() {
        this.setSelectedByValue(this.app.get('locale'));
    }
});