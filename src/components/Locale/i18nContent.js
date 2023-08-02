var kind = require('enyo/kind');
var Component = require('enyo/Component');

module.exports = kind({
    name: 'i18nContent',
    tag: 'span',
    containsVerses: false,
    titleVerses: false,

    published: {
        string: '',
        titleString: '',
        labelString: '',
        placeholderString: '',
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

        if(this.attributes.label && this.attributes.label != '' && this.labelString == '') {
            this.labelString = this.attributes.label;
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
    labelStringChanged: function(was, is) {
        this.translate();
    },
    localeChanged: function(inSender, inEvent) {
        this.translate();
    },
    translate: function() {
        var string = this.get('string'),
            titleString = this.get('titleString'),
            labelString = this.get('labelString'),
            placeholderString = this.get('placeholderString');

        if(string && string != '') {
            if(this.containsVerses) {
                this.setContent( this.app.vt(string) );
            }
            else {
                this.setContent( this.app.t(string) );
            }
        }        

        if(titleString && titleString != '') {
            if(this.titleVerses) {
                this.setAttribute('title', this.app.vt(titleString) );
            } else {
                this.setAttribute('title', this.app.t(titleString) );
            }
        }        

        if(labelString && labelString != '') {
            this.setAttribute('label', this.app.t(labelString) );
        }        

        if(placeholderString && placeholderString != '') {
            this.setAttribute('placeholder', this.app.t(placeholderString) );
        }
    }
});
