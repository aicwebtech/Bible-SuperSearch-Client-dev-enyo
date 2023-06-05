var kind = require('enyo/kind');
var Select = require('../PseudoSelect/PseudoSelect');
// var Select = require('enyo/Select');
var Locales = require('../../i18n/LocaleLoader')

// NOT WORKING YET!  DO NOT USE
// ALWAYS SETS LOCALE TO EN!!!

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

            this.createOptionComponent({
                content: langName + ' (' + i.toUpperCase() + ')',
                value: i
            });
        }

        this.initOptions();
        this.app.debug && this.log('init locale on selector', this.app.get('locale'));
        this.set('value', this.app.get('locale'));

        //this.handleLocaleChange();
    },

    change: function(inSender, inEvent) {
        this.inherited(arguments);
        this.app.set('locale', this.getValue());
    }, 
    _afterValueChanged: function(optionControl) {
        this.inherited(arguments);
        this.app.set('locale', this.get('value'));
    },
    handleLocaleChange: function() {
        this.set('value', this.app.get('locale'));
        // this.setSelectedByValue(this.app.get('locale'));
    }
});