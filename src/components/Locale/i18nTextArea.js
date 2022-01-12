var kind = require('enyo/kind');
var TextArea = require('enyo/TextArea');

module.exports = kind({
    name: 'i18nContent',
    kind: TextArea,
    containsVerses: false,

    published: {
        titleString: '',
        placeholderString: '',
    },

    handlers: {
        onLocaleChange: 'localeChanged',
    },

    create: function() {
        this.inherited(arguments);

        if(this.attributes.title && this.attributes.title != '' && this.titleString == '') {
            this.titleString = this.attributes.title;
        }        

        if(this.attributes.placeholder && this.attributes.placeholder != '' && this.placeholderString == '') {
            this.placeholderString = this.attributes.placeholder;
        }        

        this.translate();
    },
    stringChanged: function(was, is) {
        this.translate();
    },    
    titleStringChanged: function(was, is) {
        this.translate();
    },    
    placeholderStringChanged: function(was, is) {
        this.translate();
    },
    localeChanged: function(inSender, inEvent) {
        this.translate();
    },
    translate: function() {
        var titleString = this.get('titleString'),
            placeholderString = this.get('placeholderString');    

        if(titleString && titleString != '') {
            this.setAttribute('title', this.app.t(titleString) );
        }        

        if(placeholderString && placeholderString != '') {
            this.setAttribute('placeholder', this.app.t(placeholderString) );
        }
    }
});
