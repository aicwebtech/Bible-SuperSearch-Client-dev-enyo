var kind = require('enyo/kind');
var FormBase = require('../FormBase');
var utils = require('enyo/utils');

module.exports = kind({
    name: 'FormExpandingBase',
    kind: FormBase,
    expanded: false,
    drawerAnimationStep: 0,
    drawerAnimationThreshold: 3,
    // FormatButtonsIncludeAdvancedToggle: false,

    // List of fields on the 'expander'
    // When these fields are populated, we ensure that the expander is expanded
    expansionFields: ['passage', 'whole_words', 'exact_case', 'shortcut', 'search_type'],

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
        onDrawerAnimationStep: 'handleStepAnimation',
        onFormFieldChanged: 'handleFormFieldChanged'
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
        this.app.debug && this.log();
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
        this.drawerAnimationStep ++;

        if(this.drawerAnimationStep == this.drawerAnimationThreshold && open == true) {
            this.$.bible && this.$.bible.set('parallelLimit', this.parallelBibleSettings.expanded.parallelLimit);
            this.$.bible && this.$.bible.set('parallelStart', this.parallelBibleSettings.expanded.parallelStart);
        }
    },

    _referenceChangeHelper: function(value) {
        this.inherited(arguments);

        if(value && value != '') {
            this.app.debug && this.log('expanding because of reference change', value);
            this.set('expanded', true);
            this.$.PassageContainer && this.$.PassageContainer.set('showing', true);
        }

        return value || null;
    },
    handleFormFieldChanged: function(inSender, inEvent) {
        // this.log('form field changed', inEvent);

        if(inEvent.dir == 1 && (inEvent.value && inEvent.value != '') ) {
            if((this.expansionFields.indexOf(inEvent.field) != -1)) {
                valIndex = -1;

                if(this.$[inEvent.field].getIndexByValue) {
                    valIndex = this.$[inEvent.field].getIndexByValue(inEvent.value);
                }

                if(valIndex != 0) {
                    this.app.debug && this.log('expanding because of field', inEvent.field);
                    this.set('expanded', true);
                }
            }

            if(inEvent.field == 'bible' && Array.isArray(inEvent.value) && inEvent.value.length > this.parallelBibleSettings.contracted.parallelLimit) {
                this.app.debug && this.log('expanding because of parallel bibles');
                // this.log('Bible field changed', inEvent);
                this.set('expanded', true);
                this.app.debug && this.log('bible parallelLimit', this.$.bible.get('parallelLimit'));
                this.app.debug && this.log('bible parallelStart', this.$.bible.get('parallelStart'));
                // this.$.bible.parallelCleanup();
                this.$.bible.set('value', utils.clone(inEvent.value));
            }
        }
    }
});
