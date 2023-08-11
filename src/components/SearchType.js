var kind = require('enyo/kind');
var Sel = require('./Select');

module.exports = kind({
    name: 'SearchType',
    kind: Sel,
    defaultValue: null,
    defaultSelection: null,

    create: function() {
        this.inherited(arguments);

        var statics = this.app.get('statics'),
            search_types = statics.search_types,
            configs = this.app.get('configs'),
            selected = 0;

        if(!search_types || search_types.length == 0) {
            this.app.debug && this.log('using hardcoded search types')
            search_types = this.defaultSearchTypes;
        }

        for(i in search_types) {
            selected = (this.defaultValue == search_types[i].value) ? i : selected;

            this.createComponent({
                content: search_types[i].label,
                value: search_types[i].value
            });
        }

        this.defaultSelection = selected;
        this.resetValue();
    },

    rendered: function() {
        // this.inherited();
        this.setSelected(this.defaultSelection);
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
