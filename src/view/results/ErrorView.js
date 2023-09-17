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
        var errorsTranslated = [];

        for(i in this.errors) {
            var nr = this.errors[i].match(/Your request for (.*) produced no results./);

            if(nr) {
                var e = this.app.t('Your search produced no results.');
                e = e.replace('.', '');
                e = e +': ' + this.app.vt(nr[1]);
                errorsTranslated.push(e);
            }
            else {
                errorsTranslated.push( this.app.t(this.errors[i]) );
            }
        }        

        this.set('content', errorsTranslated.join('<br /><br />'));
    }

});
