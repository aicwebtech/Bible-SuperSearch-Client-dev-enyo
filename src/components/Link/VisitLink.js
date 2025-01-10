var kind = require('enyo/kind');
var Anchor = require('enyo/Anchor');
var LinkBuilder = require('./LinkBuilder');

module.exports = kind({
    name: 'VisitedLink',
    kind: Anchor,
    LinkBuilder: LinkBuilder, 
    visited: false,
    visitedClasses: null,
    absHref: '',

    handlers: {
        ontap: 'handleTap'
    },

    create: function() {
        this.inherited(arguments);
        var t = this;

        if(this.visited) {
            this.app.pushVisited(this.absHref);
            this.addClass(this.visitedClasses);
        } else if(this.app.visited.find(function(item) { return item == t.absHref; })) {
            this.visited = true;
            this.addClass(this.visitedClasses);
        }
    },
    visitedChanged: function(was, is) {
        if(is) {
            this.app.pushVisited(this.absHref);
        } else {
            this.app.remVisited(this.absHref);
        }

        this.addRemoveClass(this.visitedClasses, is);
    },
    handleTap: function() {
        this.set('visited', true);
    }
});

