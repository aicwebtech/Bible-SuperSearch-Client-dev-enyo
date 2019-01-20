var kind = require('enyo/kind');
var FormBase = require('../FormBase');

module.exports = kind({
    name: 'FormExpandingBase',
    kind: FormBase,
    expanded: false,
    drawerAnimationStep: 0,
    drawerAnimationThreshold: 3,

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

    handlers: {
        onDrawerAnimationEnd: 'handleEndAnimation',
        onDrawerAnimationStep: 'handleStepAnimation'
    },

    create: function() {
        this.inherited(arguments); 
    },
    expandedChanged: function(was, is) {
        this.$.Expand1 && this.$.Expand1.set('showing', !is);
        this.$.Expand0 && this.$.Expand0.set('showing', !!is);
        this.$.Expansion && this.$.Expansion.set('open', !!is);

        var bibset = (is) ? this.parallelBibleSettings.expanded : this.parallelBibleSettings.contracted;

        if(bibset && !is) {
            this.$.bible && this.$.bible.set('parallelLimit', bibset.parallelLimit);
            this.$.bible && this.$.bible.set('parallelStart', bibset.parallelStart);
        }

        if(!is) {
            this.$.bible && this.$.bible.parallelCleanup();
        }
    },
    toggleExpanded: function() {
        this.set('expanded', !this.get('expanded'));
    },
    handleEndAnimation: function(inSender, inEvent) {
        // var open = inEvent.originator.get('open');
        // this.log(inSender);
        // this.log(inEvent);
        // this.log(open);

        this.drawerAnimationStep = 0;

        // if(open == true) {
        //     this.$.bible && this.$.bible.set('parallelLimit', this.parallelBibleSettings.expanded.parallelLimit);
        //     this.$.bible && this.$.bible.set('parallelStart', this.parallelBibleSettings.expanded.parallelStart);
        // }
    },
    handleStepAnimation: function(inSender, inEvent) {
        var open = inEvent.originator.get('open');
        // this.log(inSender);
        // this.log(inEvent);
        // this.log(open);
        // this.log('drawerAnimationStep', this.drawerAnimationStep);

        this.drawerAnimationStep ++;


        if(this.drawerAnimationStep == this.drawerAnimationThreshold && open == true) {
            this.$.bible && this.$.bible.set('parallelLimit', this.parallelBibleSettings.expanded.parallelLimit);
            this.$.bible && this.$.bible.set('parallelStart', this.parallelBibleSettings.expanded.parallelStart);
        }
    }
});