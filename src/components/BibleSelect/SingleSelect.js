var kind = require('enyo/kind');
var utils = require('enyo/utils');
var Sel = require('../Select');
var OptionGroup = require('enyo.OptionGroup');
var i18n = require('../Locale/i18nContent');
// var Option = require('enyo.Option');

module.exports = kind({
    name: 'SingleSelect',
    kind: Sel,
    autoTranslate: false,
    width: 270,
    shortWidthThreshold: 250, // viewport width (pixels) at which menu displays short names
    shortWidthWidth: 160,
    isShort: false,
    alwaysShort: false,
    parallelNumber: 0,
    classes: 'biblesupersearch_bible_selector',
    _currentGroup: null,
    downloadableOnly: false,
    defaultNull: false,

    handlers: {
        resize: 'handleResize',
    },

    create: function() {
        this.inherited(arguments);
        // this.isShort = (this.shortWidthThreshold <= window.innerWidth) ? false : true;
        // this.isShort = (this.alwaysShort) ? true : this.isShort;

        var statics = this.app.get('statics'),
            bibles = statics.bibles,
            biblesDisplayed = this.app.get('biblesDisplayed'),
            configs = this.app.get('configs'),
            enabled = configs.enabledBibles,
            noSelectLabel = 'Select a Bible',
            width = (this.isShort) ? this.shortWidthWidth : this.width;

        if(this.parallelNumber && this.parallelNumber != 0) {
            if(this.downloadableOnly) {
                noSelectLabel = 'Bible #' + this.parallelNumber.toString();
            }
            else {
                noSelectLabel = 'Parallel Bible #' + this.parallelNumber.toString();
            }
        }

        if(!this.app.singleBibleEnabled()) {        
            if(this.app.configs.bibleGrouping && this.app.configs.bibleGrouping != 'none') {
                // noSelectLabel = '&nbsp; &nbsp; &nbsp;' + noSelectLabel;
            }

            this.createComponent({
                kind: i18n,
                tag: 'option',
                content: noSelectLabel,
                allowHtml: true,
                attributes: {value: '0'}
            });
        }

        for(i in biblesDisplayed) {
            this._addBibleHelper(biblesDisplayed[i]);
        }

        if(width && width != 0) {
            this.addStyles('width:100%; max-width:' + this.width.toString() + 'px');
            // this.style = 'width:100%; max-width:' + this.width.toString() + 'px';
        }
        else {
            this.addStyles('width:100%');
            // this.style = 'width:100%';
        }

        this.checkShort();
        this.resetValue();
    },
    // rendered: function() {
    //     this.inherited(arguments);
    //     this.resetValue();
    // },
    resetValue: function() {
        // this.log('SINGSEL parallelNumber', this.parallelNumber, this.app.configs.defaultBible);

        if(this.parallelNumber == 0 || this.parallelNumber == 1) {
            this.app.debug && this.log('defaulting', this.app.configs.defaultBible);

            if(this.defaultNull) {
                // this.setSelectedValue('0');
                this.setSelected(0);
                this.setValue('0');
                this.app.debug && this.log('defaulting NULL');
            }
            else {
                this.setSelectedValue(this.app.configs.defaultBible);
            }
        }
    },
    applyDefaultValue: function() {
        var value = this.getValue();

        if(!value || value == 0 || value == '0' || value == '') {
            // this.log('reseting value');
            this.resetValue();
        }
        else {
            // this.log('set selected value - again');
            this.setSelectedByValue(value);
        }
    },
    _addBibleHelper: function(bible) {
        if(bible.lang != this._lastLang) {
            // do something?
        }

        if(this.downloadableOnly) {
            if(!bible.downloadable) {
                return;
            }
        }

        this._lastLang = bible.lang;
        var narrow = this.isShort,
            group = null;

        // this.app.configs.bibleGrouping = null;

        if(this.app.configs.bibleGrouping && this.app.configs.bibleGrouping != 'none') {
            var spacer = '', //&nbsp; &nbsp; &nbsp;',
                contentShort = spacer + bible.shortname,
                contentLong = spacer + bible.name,
                content = narrow ? contentShort : contentLong;

            switch(this.app.configs.bibleGrouping) {
                case 'language': // Language: Endonym
                    group = bible.lang_short || '';
                    var n = bible.lang_native || bible.lang; // Fall back to English name if needed
                    groupContent = n + ' - (' + group.toUpperCase() + ')';
                    break;                
                case 'language_and_english': // Language: Both Endonym and English name
                    group = bible.lang_short || '';
                    // If no Endonym, only display English name once
                    var n = (bible.lang_native && bible.lang_native != bible.lang) ? bible.lang_native + ' / ' + bible.lang : bible.lang;
                    groupContent = n + ' - (' + group.toUpperCase() + ')';
                    break;
                case 'language_english': // Language: English name
                    group = bible.lang_short || '';
                    groupContent = bible.lang + ' - (' + group.toUpperCase() + ')';
                    break;
                default:
                    alert('Invalid bibleGrouping: ' + this.app.configs.bibleGrouping);
            }

            var compName = 'group' + group;

            // if(this._currentGroup != group) {
            //     this.createComponent({
            //         content: groupContent,
            //         value: 0,
            //         contentShort: groupContent,
            //         contentLong: groupContent,
            //         // disabled: true,
            //         attributes: {disabled: true},
            //         classes: 'label'
            //     });

            //     this._currentGroup = group;
            // }

            // this.createComponent({
            //     content: content,
            //     value: bible.module,
            //     contentShort: contentShort,
            //     contentLong: contentLong,
            //     allowHtml: true
            // });

            if(!this.$[compName]) {
                this.createComponent({
                    tag: 'optgroup',
                    // kind: OptionGroup,
                    attributes: {label: groupContent},
                    name: compName,
                });
            }

            var selected = '';

            if((this.parallelNumber == 0 || this.parallelNumber == 1) && this.app.configs.defaultBible == bible.module && !this.defaultNull) {
                selected = 'selected';
            }

            this.$[compName].createComponent({
                // kind: Option,
                tag: 'option',
                content: content,
                value: bible.module,
                attributes: {value: bible.module, selected: selected},
                contentShort: contentShort,
                contentLong: contentLong,
                // owner: this
            });
        }
        else {
            var contentShort = bible.shortname + ' (' + bible.lang + ')',
                contentLong = bible.name + ' (' + bible.lang + ')',
                content = narrow ? contentShort : contentLong;

            this.createComponent({
                content: content,
                value: bible.module,
                contentShort: contentShort,
                contentLong: contentLong
            });
        }
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

        this.set('value', value);

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
        this._isShortChangedHelper(comp, is);

        // this.app.debug && this.log('width', width);

        if(width && width != 0) {
            // this.log('applying max-width', width.toString());
            this.applyStyle('max-width', null);
            this.applyStyle('max-width', width.toString() + 'px' );
            this.render();
        }
    },
    _isShortChangedHelper: function(components, isShort) {
        components.forEach(function(option) {
            if(option.get('tag') == 'optgroup') {
                var comp2 = option.getClientControls();
                this._isShortChangedHelper(comp2, isShort);
                return;
            }

            var content = (isShort) ? option.contentShort : option.contentLong;
            content && option.set('content', content);
        }, this);
    },
    checkShort: function() {
        var isShort = (this.shortWidthThreshold <= window.innerWidth) ? false : true;
        isShort = (this.alwaysShort) ? true : isShort;
        this.set('isShort', isShort);
        // this.log('shortWidthThreshold', this.shortWidthThreshold);
        // this.log('alwaysShort', this.alwaysShort);
        // this.log('isShort', isShort);
    },
    handleResize: function(inSender, inEvent) {
        this.checkShort();
    }
});
