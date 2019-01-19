var kind = require('enyo/kind');
var FormBase = require('../FormBase');

module.exports = kind({
    name: 'FormExpandingBase',
    kind: FormBase,
    expanded: false,

    parallelBibleSettings: {
        contracted: {
            parallelLimit: 1,
            parallelStart: 1
        },
        expanded: {
            parallelLimit: 6,
            parallelStart: 2
        }
    },

    create: function() {
        this.inherited(arguments); 
    },
    expandedChanged: function(was, is) {
        this.$.Expand1 && this.$.Expand1.set('showing', !is);
        this.$.Expand0 && this.$.Expand0.set('showing', !!is);
        this.$.Expansion && this.$.Expansion.set('showing', !!is);

        var bibset = (is) ? this.parallelBibleSettings.expanded : this.parallelBibleSettings.contracted;

        if(bibset) {
            this.$.bible && this.$.bible.set('parallelLimit', bibset.parallelLimit);
            this.$.bible && this.$.bible.set('parallelStart', bibset.parallelStart);
        }

        if(!is) {
            this.$.bible && this.$.bible.parallelCleanup();
        }
    },
    toggleExpanded: function() {
        this.set('expanded', !this.get('expanded'));
    }
});