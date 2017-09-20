var kind = require('enyo/kind');
var Sel = require('./Select');

module.exports = kind({
    name: 'SearchType',
    kind: Sel,

    create: function() {
        this.inherited(arguments);

        var statics = this.app.get('statics'),
            search_types = statics.search_types,
            configs = this.app.get('configs');

        for(i in search_types) {
            this.createComponent({
                content: search_types[i].label,
                value: search_types[i].value
            });
        }

        this.resetValue();
    }
});
