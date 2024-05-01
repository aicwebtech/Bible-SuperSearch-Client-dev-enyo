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
        var list = this.app.configs.languageList || [],
            defLang = this.app.configs.language || 'en';

        this._createLocaleHelper(defLang);

        if(list.length > 0) {
            for(idx in list) {
                list[idx] != defLang && this._createLocaleHelper(list[idx]);
            }
        }
        else {            
            for(i in Locales) {
                i != defLang && this._createLocaleHelper(i);
            }
        }

        this.app.debug && this.log('init locale on selector', this.app.get('locale'));
        this.handleLocaleChange();
    },

    _createLocaleHelper: function(i) {
        if(!Locales[i] || !Locales[i].meta || !Locales[i].meta.nameEn) {
            return;
        }

        var ldb = Locales[i].meta.debug || false;
        var langName = Locales[i].meta.name || Locales[i].meta.nameEn;

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