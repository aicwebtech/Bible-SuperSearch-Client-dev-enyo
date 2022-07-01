var Anchor = require('enyo/Anchor');
var kind = require('enyo/kind');

module.exports = kind({
    name: 'AssetLink',
    kind: Anchor,

    published: {
        relHref: null
    },
    create: function() {
        this.inherited(arguments);
        this.generateAbsHref();
    },
    relHrefChanged: function(was, is) {
        this.generateAbsHref();
    },
    generateAbsHref: function() {
        if(this.relHref) {
            var href = this.app.get('rootDir') + '/assets/extras/' + this.relHref;
            this.set('href', href);
        }
    }
});
