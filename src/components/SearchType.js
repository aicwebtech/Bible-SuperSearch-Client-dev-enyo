var kind = require('enyo/kind');
var Sel = require('./Select');

module.exports = kind({
    name: 'SearchType',
    kind: Sel,
    defaultValue: null,
    defaultSelection: null,

    handlers: {
        onBibleChange: 'handleBibleChange'
    },

    create: function() {
        this.inherited(arguments);

        var statics = this.app.get('statics'),
            search_types = statics.search_types,
            configs = this.app.get('configs'),
            selected = 0;

        if(!search_types || search_types.length == 0) {
            this.app.debug && this.log('using hardcoded search types');
            search_types = this.defaultSearchTypes;
        }

        for(i in search_types) {
            selected = (this.defaultValue == search_types[i].value) ? i : selected;

            this.createComponent({
                content: search_types[i].label,
                value: search_types[i].value,
                multiLang: search_types[i].multi_lang
            });
        }

        this.defaultSelection = selected;
        this.resetValue();
    },

    rendered: function() {
        // this.inherited();
        this.setSelected(this.defaultSelection);
    },

    handleBibleChange: function(inSender, inEvent) {
        var pls = this.app.statics.parallel_lang_search || 'always';

        if(pls == 'search_type') {
            var components = this.getClientControls(),
                showIt = !this.app.selectedBiblesMultipleLanguages(),
                value = this.get('value'),
                resetValue = false;

                // this.log(this.app.getSelectedBiblesString(), showIt);
                
            components.forEach(function(com) {
                if(!com.get('multiLang')) {
                    if(!showIt && com.get('value') == value) {
                        resetValue = true;
                    }

                    com.set('showing', showIt);
                }
            }, this);

            if(resetValue) {
                this.app.alertPrompt('You cannot search across Bibles of different languages with the selected search type.');
                this.setSelected(this.defaultSelection);
            }
        } 
        //else if(pls == 'never' && this.app.selectedBiblesMultipleLanguages()) {
            // not valid - because users can look up passages across versions of diffrent languages
            // It is difficult to tell here if a search is being performed as well.
            // Will save this validation for the API for now ....
            //this.app.alert('You cannot search across Bibles of different languages.');
        //}
    },

    defaultSearchTypes: [
        {
            'label' : 'All Words',
            'value' : 'and'
        },
        {
            'label' : 'Any Word',
            'value' : 'or'
        },
        {
            'label' : 'Exact Phrase',
            'value' : 'phrase'
        },
        {
            'label' : 'Only One Word',
            'value' : 'xor'
        },
        {
            'label' : 'Two or More Words',
            'value' : 'two_or_more'
        },
        {
            'label' : 'Words Within 5 Verses',
            'value' : 'proximity'
        },
        {
            'label' : 'Words Within Same Chapter',
            'value' : 'chapter'
        },
        {
            'label' : 'Boolean Expression',
            'value' : 'boolean'
        },
        {
            'label' : 'Regular Expression',
            'value' : 'regexp'
        },
    ]
});
