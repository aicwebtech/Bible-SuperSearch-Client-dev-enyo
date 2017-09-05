var kind = require('enyo/kind');
var Sel = require('enyo/Select');

module.exports = kind({
    name: 'SingleSelect',
    kind: Sel,
    parallelNumber: 0,

    create: function() {
        this.inherited(arguments);

        var statics = this.app.get('statics'),
            bibles = statics.bibles;

        if(this.parallelNumber && this.parallelNumber != 0) {
            this.createComponent({
                content: 'Paralell Bible #' + this.parallelNumber.toString(),
                value: '0'
            });
        }
        else {
            this.createComponent({
                content: 'Select a Bible',
                value: '0'
            });
        }

        for(i in bibles) {
            this.createComponent({
                content: bibles[i].name,
                value: bibles[i].module
            });
        }
    }
});
