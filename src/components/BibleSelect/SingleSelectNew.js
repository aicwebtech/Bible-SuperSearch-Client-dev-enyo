var kind = require('enyo/kind');
var utils = require('enyo/utils');
var Sel = require('../PseudoSelect/PseudoSelect');
var OptGroup = require('../PseudoSelect/PseudoOptGroup');
var Opt = require('../PseudoSelect/PseudoOption');
var i18n = require('../Locale/i18nContent');

// NOTICE: As of 23 Feb 2023, do not use this directly.  Use the MultiSelect even if only one Bible can be selected!

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
    renderNeeded: false,

    handlers: {
        resize: 'handleResize',
        bibleSelectReset: 'nullValue'
    },

    create: function() {
        this.inherited(arguments);
        // this.isShort = (this.shortWidthThreshold <= window.innerWidth) ? false : true;
        // this.isShort = (this.alwaysShort) ? true : this.isShort;

        var statics = this.app.get('statics'),
            bibles = statics.bibles,
            biblesDisplayed = this.app.get('biblesDisplayed'),
            singleBibleMode = this.app.get('singleBibleEnabled'),
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

        if(this.app.singleBibleEnabled() && biblesDisplayed[0].module == configs.defaultBible) {
            this.set('showing', false);
            window.console && console.log('Note: Only ONE Bible is enabled, therefore the Bible selector has been hidden.');
        }
        else {        
            if(this.app.configs.bibleGrouping && this.app.configs.bibleGrouping != 'none') {
                // noSelectLabel = '&nbsp; &nbsp; &nbsp;' + noSelectLabel;
            }

            this.$.Toggle.createComponent({
                //kind: i18n,
                kind: Opt,
                content: noSelectLabel,
                allowHtml: true,
                value: 0,
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

        this.initOptions();
        this.checkShort();
        //this.resetValue(); // redundant
    },
    nullValue: function() {
        this.setSelected(0);
        this.setValue('0');
    },

    _resetValue: function() {
        // this.log('SINGSEL parallelNumber', this.parallelNumber, this.app.configs.defaultBible);
        return; //multidefault haha

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
        return; //multidefault haha

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

            if(!this.$.Toggle.$[compName]) {
                this.$.Toggle.createComponent({
                    // tag: 'optgroup',
                    kind: OptGroup,
                    label: groupContent,
                    attributes: {label: groupContent},
                    name: compName,
                });
            }

            var selected = '';

            if((this.parallelNumber == 0 || this.parallelNumber == 1) && this.app.configs.defaultBible == bible.module && !this.defaultNull) {
                selected = 'selected';
            }

            // flat optgroup
            // this.$.Toggle.$[compName].createComponent({
            //     kind: Opt,
            //     //tag: 'option',
            //     content: content, /// ?? short/long NOT working!
            //     value: bible.module,
            //     attributes: {value: bible.module, selected: selected},
            //     contentShort: contentShort,
            //     contentLong: contentLong,
            //     // owner: this
            // });            

            this.$.Toggle.createComponent({
                kind: Opt,
                //tag: 'option',
                content: content, /// ?? short/long NOT working!
                value: bible.module,
                attributes: {value: bible.module, selected: selected},
                titleString: content,
                contentShort: contentShort,
                contentLong: contentLong,
                grouped: true
                // owner: this
            });
        }
        else {
            var contentShort = bible.shortname + ' (' + bible.lang + ')',
                contentLong = bible.name + ' (' + bible.lang + ')',
                content = narrow ? contentShort : contentLong;

            this.$.Toggle.createComponent({
                kind: Opt,
                content: content,
                titleString: content,
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
        this.renderNeeded = true;

        if(width && width != 0) {
            this.applyStyle('max-width', null);
            this.applyStyle('max-width', width.toString() + 'px' );
        }
    },
    _isShortChangedHelper: function(components, isShort) {
        components.forEach(function(option) {
            
            console.log('option', option);

            // flat optgroup
            // if(option.get('classes') == 'bss_pseudo_optgroup') {
            //     var comp2 = option.getClientControls();
            //     this._isShortChangedHelper(comp2, isShort);
            //     return;
            // }

            var content = (isShort) ? option.contentShort : option.contentLong;
            content && option.set('content', content);
        }, this);
    },
    checkShort: function() {
        var isShort = (this.shortWidthThreshold <= window.innerWidth) ? false : true;
        isShort = (this.alwaysShort) ? true : isShort;
        this.set('isShort', isShort);
    },
    handleResize: function(inSender, inEvent) {
        this.checkShort();
        this.renderIfNeeded();
    }, 
    renderIfNeeded: function() {
        if(this.renderNeeded) {
            this.render();
            this.renderNeeded = false;
        }
    }
});
