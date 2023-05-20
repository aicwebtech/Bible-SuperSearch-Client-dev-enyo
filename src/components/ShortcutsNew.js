var kind = require('enyo/kind');
var Sel = require('./PseudoSelect/PseudoSelect');

module.exports = kind({
    name: 'Shortcuts',
    kind: Sel,
    noSelectLabel: 'Entire Bible',
    selectedPassagesLabel: 'Passage(s) listed above',

    create: function() {
        this.inherited(arguments);

        var statics = this.app.get('statics'),
            shortcuts = statics.shortcuts,
            configs = this.app.get('configs');

        this.createOptionComponent({
            content: this.noSelectLabel,
            value: '0'
        });        

        if(this.selectedPassagesLabel) {        
            this.createOptionComponent({
                content: this.selectedPassagesLabel,
                value: '1'
            });
        }

        for(i in shortcuts) {
            this.createOptionComponent({
                content: shortcuts[i].name,
                value: shortcuts[i].reference,
                titleVerse: true,
                attributes: {
                    title: shortcuts[i].reference
                }
            });
        }

        this.initOptions();
        this.resetValue();
    }
});
