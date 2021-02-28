var kind = require('enyo/kind');
var Anchor = require('enyo/Anchor');
var LinkBuilder = require('./LinkBuilder');

module.exports = kind({
    name: 'Link',
    kind: Anchor,
    LinkBuilder: LinkBuilder, 

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
            if(this.containsVerses) {
                this.setContent( this.app.vt(string) );
            }
            else {
                this.setContent( this.app.t(string) );
            }
        }        

        if(titleString && titleString != '') {
            this.setAttribute('title', this.app.t(titleString) );
        }
    }
});
