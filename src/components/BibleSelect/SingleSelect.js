var kind = require('enyo/kind');
var Sel = require('enyo/Select');

module.exports = kind({
    name: 'SingleSelect',
    kind: Sel,
    parallelNumber: 0,
    classes: 'biblesupersearch_bible_selector',

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

        if(this.parallelNumber == 1) {
            this.log('setting myself to default');
            this.set('value', this.app.configs.defaultBible);
        }
    },
    valueChanged: function(was, is) {
        this.inherited(arguments);
        this.log(was, is);
    }
});
