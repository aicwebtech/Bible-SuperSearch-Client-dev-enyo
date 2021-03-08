var kind = require('enyo/kind');
var Option = require('enyo/Option');

module.exports = kind({
    name: 'i18nOption',
    kind: Option,
    titleVerse: false,

    published: {
        string: '',
        titleString: ''
    },

    handlers: {
        onLocaleChange: 'localeChanged',
    },

    create: function() {
        this.inherited(arguments);
        
        if(this.content != '' && this.string == '') {
            this.string = this.content;
        }

        if(this.attributes.title && this.attributes.title != '' && this.titleString == '') {
            this.titleString = this.attributes.title;
        }

        this.translate();
    },
    stringChanged: function(was, is) {
        this.translate();
    },    
    titleStringChanged: function(was, is) {
        this.translate();
    },
    localeChanged: function(inSender, inEvent) {
        this.translate();
    },
    translate: function() {
        var string = this.get('string'),
            titleString = this.get('titleString');

        if(string && string != '') {
            this.setContent( this.app.t(string) );
        }        

        if(titleString && titleString != '') {
            var titleTrans = (this.titleVerse) ? this.app.vt(titleString) : this.app.t(titleString);
            this.setAttribute('title', titleTrans );
        }
    }
});