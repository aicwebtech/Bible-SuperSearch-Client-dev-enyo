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
        var list = this.app.configs.languageList || [];

        if(list.length > 0) {
            for(idx in list) {
                this._createLocaleHelper(list[idx]);
            }
        }
        else {            
            for(i in Locales) {
                this._createLocaleHelper(i);
            }
        }

        this.app.debug && this.log('init locale on selector', this.app.get('locale'));
        this.handleLocaleChange();
    },

    _createLocaleHelper: function(i) {
        if(!Locales[i] || !Locales[i].meta || !Locales[i].meta.lang_name_en) {
            return;
        }

        var ldb = Locales[i].meta.debug || false;
        var langName = Locales[i].meta.lang_name || Locales[i].meta.lang_name_en;

        if(ldb && !this.app.debug && !this.app.configs.debugLocale) {
            return;
        }

        this.createComponent({
            content: langName + ' (' + this.app._fmtLocaleName(i) + ')',
            value: i
        });
    },

    change: function(inSender, inEvent) {
        this.inherited(arguments);
        this.app.set('localeManual', true);
        this.app.set('locale', this.getValue());
        //Signal.send('onChangeLocaleManual');
    }, 

    handleLocaleChange: function() {
        this.setSelectedByValue(this.app.get('locale'));
    }
});