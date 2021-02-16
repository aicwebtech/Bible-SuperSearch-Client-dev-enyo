var kind = require('enyo/kind');
var Select = require('../Select');
// var Select = require('enyo/Select');
var Locales = require('../../i18n/LocaleLoader')



module.exports = kind({
    kind: Select,

    create: function() {
        this.inherited(arguments);

        for(i in Locales) {
            this.createComponent({
                content: i,
                value: i
            });
        }
    },

    change: function(inSender, inEvent) {
        this.inherited(arguments);
        // this.log(inSender.getValue());
        this.app.set('locale', this.getValue());
    }
});