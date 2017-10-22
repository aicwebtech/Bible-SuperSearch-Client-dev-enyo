var Image = require('enyo/Image');
var kind = require('enyo/kind');

module.exports = kind({
    name: 'ImageCustom',
    kind: Image,
    setTitleToAlt: true,

    published: {
        relSrc: null
    },
    create: function() {
        this.inherited(arguments);
        this.generateAbsSrc();
        this.applyAltToTitle();
    },
    altChanged: function(was, is) {
        this.inherited(arguments);
        this.applyAltToTitle();
    },
    relSrcChanged: function(was, is) {
        this.generateAbsSrc();
    },
    generateAbsSrc: function() {
        if(this.relSrc) {
            var src = this.app.get('rootDir') + '/assets/images/' + this.relSrc;
            // var src = '@../assets/images/' + this.relSrc;
            this.set('src', src);
        }
    },
    applyAltToTitle: function() {
        if(this.setTitleToAlt) {
            this.setAttribute('title', this.get('alt'));
        }
    }
});
