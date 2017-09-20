var kind = require('enyo/kind');
var Sel = require('./Select');

module.exports = kind({
    name: 'Shortcuts',
    kind: Sel,
    noSelectLabel: 'Entire Bible',

    create: function() {
        this.inherited(arguments);

        var statics = this.app.get('statics'),
            shortcuts = statics.shortcuts,
            configs = this.app.get('configs');

        this.createComponent({
            content: this.noSelectLabel,
            value: '0'
        });

        for(i in shortcuts) {
            this.createComponent({
                content: shortcuts[i].name,
                value: shortcuts[i].reference
            });
        }

        this.resetValue();
    }
});
