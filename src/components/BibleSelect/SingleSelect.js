var kind = require('enyo/kind');
var Sel = require('../Select');

module.exports = kind({
    name: 'SingleSelect',
    kind: Sel,
    width: 0,
    parallelNumber: 0,
    classes: 'biblesupersearch_bible_selector',

    create: function() {
        this.inherited(arguments);

        var statics = this.app.get('statics'),
            bibles = statics.bibles,
            configs = this.app.get('configs'),
            enabled = configs.enabledBibles,
            noSelectLabel = 'Select a Bible';

        if(this.parallelNumber && this.parallelNumber != 0) {
            var noSelectLabel = 'Paralell Bible #' + this.parallelNumber.toString();
        }

        this.createComponent({
            content: noSelectLabel,
            value: '0'
        });

        if(Array.isArray(enabled) && enabled.length) {
            for(i in enabled) {
                this._addBibleHelper(bibles[enabled[i]]);
            }
        }
        else {        
            for(i in bibles) {
                this._addBibleHelper(bibles[i]);
            }
        }

        if(this.width && this.width != 0) {
            this.style = 'width:' + this.width.toString();
        }

        this.resetValue();
    },
    // rendered: function() {
    //     this.inherited(arguments);
    //     this.resetValue();
    // },
    resetValue: function() {
        window.select = this;

        if(this.parallelNumber == 0 || this.parallelNumber == 1) {
            this.log('setting myself to default');
            this.setSelectedValue(this.app.configs.defaultBible);
            // this.set('value', this.app.configs.defaultBible);
        }
    },
    _addBibleHelper: function(bible) {
        if(bible.lang != this._lastLang) {
            // do something?
        }

        this._lastLang = bible.lang;
        var content = bible.name + ' (' + bible.lang + ')';

        this.createComponent({
            content: content,
            value: bible.module
        });
    },
    _lastLang: null,
    valueChanged: function(was, is) {
        this.inherited(arguments);
        this.log(was, is);
    },
    setSelectedValue: function(value) {
        var value = value || 0
            controls = this.getClientControls();

        if(this.setSelectedByValue) {
            this.setSelectedByValue(value);
            return;
        }

        for(i in controls) {
            if(controls[i].get('value') == value) {
                this.setSelected(i);
                break;
            }
        }
    }
});
