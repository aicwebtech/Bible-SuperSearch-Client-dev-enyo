var kind = require('enyo/kind');
var Sel = require('../Select');

module.exports = kind({
    name: 'SingleSelect',
    kind: Sel,
    width: 270,
    shortWidthThreshold: 250, // viewport width (pixels) at which menu displays short names
    shortWidthWidth: 160,
    isShort: false,
    alwaysShort: false,
    parallelNumber: 0,
    classes: 'biblesupersearch_bible_selector',

    handlers: {
        resize: 'handleResize',
    },

    create: function() {
        this.inherited(arguments);
        this.isShort = (this.shortWidthThreshold <= window.innerWidth) ? false : true;
        this.isShort = (this.alwaysShort) ? true : this.isShort;

        var statics = this.app.get('statics'),
            bibles = statics.bibles,
            configs = this.app.get('configs'),
            enabled = configs.enabledBibles,
            noSelectLabel = 'Select a Bible',
            width = (this.isShort) ? this.shortWidthWidth : this.width;

        if(this.parallelNumber && this.parallelNumber != 0) {
            var noSelectLabel = 'Paralell Bible #' + this.parallelNumber.toString();
        }

        if(!this.app.singleBibleEnabled()) {        
            this.createComponent({
                content: noSelectLabel,
                value: '0'
            });
        }

        if(Array.isArray(enabled) && enabled.length) {
            for(i in enabled) {
                bibles[enabled[i]] && this._addBibleHelper(bibles[enabled[i]]);
            }
        }
        else {        
            for(i in bibles) {
                this._addBibleHelper(bibles[i]);
            }
        }

        if(width && width != 0) {
            this.addStyles('width:100%; max-width:' + this.width.toString() + 'px');
            // this.style = 'width:100%; max-width:' + this.width.toString() + 'px';
        }
        else {
            this.addStyles('width:100%');
            // this.style = 'width:100%';
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
            this.setSelectedValue(this.app.configs.defaultBible);
            // this.set('value', this.app.configs.defaultBible);
        }
    },
    applyDefaultValue: function() {
        var value = this.getValue();

        this.app.debug && this.log(value);

        if(!value || value == 0) {
            this.resetValue();
        }
    },
    _addBibleHelper: function(bible) {
        if(bible.lang != this._lastLang) {
            // do something?
        }

        this._lastLang = bible.lang;

        var narrow = this.isShort,
            contentShort = bible.shortname + ' (' + bible.lang + ')',
            contentLong = bible.name + ' (' + bible.lang + ')',
            content = narrow ? contentShort : contentLong;

        this.createComponent({
            content: content,
            value: bible.module,
            contentShort: contentShort,
            contentLong: contentLong
        });
    },
    _lastLang: null,
    valueChanged: function(was, is) {
        this.inherited(arguments);
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
    },
    isShortChanged: function(was, is) {
        var width = (is) ? this.shortWidthWidth : this.width;
        var comp = this.getClientControls();

        comp.forEach(function(option) {
            var content = (is) ? option.contentShort : option.contentLong;
            content && option.set('content', content);
        }, this);

        // this.app.debug && this.log('width', width);

        if(width && width != 0) {
            this.log('applying max-width');
            this.applyStyle('max-width', width.toString() + 'px' );
            this.render();
        }
    },
    handleResize: function(inSender, inEvent) {
        var isShort = (this.shortWidthThreshold <= window.innerWidth) ? false : true;
        isShort = (this.alwaysShort) ? true : isShort;
        this.set('isShort', isShort);
    }
});
