// This renders individual passages
var kind = require('enyo/kind');
var i18n = require('../../components/Locale/i18nComponent');

module.exports = kind({
    name: 'ErrorView',
    // kind: i18n,
    classes: 'biblesupersearch_error_view',
    allowHtml: true,
    errors: [],

    handlers: {
        onLocaleChange: 'localeChanged',
    },

    errorsChanged: function(errors) {
        this.renderErrors();
    },
    localeChanged: function(inSender, inEvent) {
        this.renderErrors();
    },
    renderErrors: function() {
        this.log();
        var errorsTranslated = [];

        for(i in this.errors) {
            errorsTranslated.push( this.app.t(this.errors[i]) );
        }        

        this.set('content', errorsTranslated.join('<br /><br />'));
    }

});
