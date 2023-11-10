var kind = require('enyo/kind');
var utils = require('enyo/utils');
var Button = require('enyo/Button');

var SingleOld = require('./SingleSelect');
var SingleNew = require('./SingleSelectNew');
var i18n = require('../Locale/i18nContent');

module.exports = kind({
    name: 'MultiSelect',
    classes: 'biblesupersearch_multiselect',
    parallelNumber: 0,  // Number of currently showing parallel Bibles
    parallelLimit: 6,   // Maximum number of parallel Bibles that can be displayed
    parallelLimitInterface: 6,   // Maximum number of parallel Bibles per the interface.  
    parallelMinimum: 1,   // Minimum number of parallel Bibles that can be displayed
    parallelStart: 1,   // Number of parallel Bibles to display initially
    selectorWidth: 0,   // Pixels, 0 means automatic
    selectorShortWidth: 0,
    selectorShortWidthThreshold: 250,
    selectorAlwaysShort: false,
    selectorClasses: '',
    valueUnfiltered: [],
    downloadableOnly: false,
    defaultNull: false, // Use NULL as the default value, ignoring the configured default

    events: {
        onValueChanged: '',
        onAddSelectorTapped: '',
        onRemoveSelectorTapped: '',
        onSelectorAdded: '',
        onSelectorRemoved: '',
    },

    // components: [
    //     {name: 'Container', tag: 'div'},
    //     {name: 'Add', kind: Button, content: 'Add Bible', ontap: 'addSelector', components: [{kind: i18n, content: 'Add Bible'}]}
    // ],

    handlers: {
        onClearFormWaterfall: 'resetValue',
        resize: 'handleResize'
    },

    published: {
        value: [],
        disabled: false
    },

    create: function() {
        this.inherited(arguments);
        var num = (this.parallelStart >= 1) ? this.parallelStart : 1;
        var bibleCount = this.app.getNumberOfEnabledBibles();
        this.parallelLimit = (bibleCount < this.parallelLimit) ? bibleCount : this.parallelLimit;
        this.parallelLimitInterface = this.parallelLimit;

        this.Single = this.app.get('useNewSelectors') ? SingleNew : SingleOld;

        var conTag = (this.tag == 'span') ? 'span' : 'div';

        this.createComponent({name: 'Container', tag: conTag});

        this.createComponent({
            name: 'Add', 
            kind: Button, 
            ontap: 'addSelector', 
            components: [{kind: i18n, content: 'Add Bible'}]
        });
        
        this.createComponent({
            name: 'Remove', 
            kind: Button, 
            ontap: 'removeSelector', 
            showing: !!(num > this.parallelMinimum),
            components: [{kind: i18n, content: 'Remove Bible'}]
        });


        for(var i = 1; i <= num; i++) {
            this._addSelectorHelper();
        }

        this.resetValue();
    },
    rendered: function() {
        this.inherited(arguments);
        this.handleResize();
        this.resetValue();
    },
    resetValue: function() {
        this.setValue([]);
        // this.parallelCleanup();
        this._resetSelectors();

        var defaultBibles = utils.clone(this.app.defaultBiblesRaw);

        if(this.app.configs.parallelBibleStartSuperceedsDefaultBibles && defaultBibles.length > this.parallelStart) {
            defaultBibles = defaultBibles.slice(0, this.parallelStart);
        }

        this.app.defaultBibles = defaultBibles;
        this.app.debug && this.log('default', defaultBibles);
        this.bubble('onSpecialBibleChange', {value: defaultBibles});
        this.setValue(defaultBibles);        

        // this.app.debug && this.log('default', this.app.defaultBibles);
        // this.bubble('onSpecialBibleChange', {value: this.app.defaultBibles});
        // this.setValue(this.app.defaultBibles);
    },
    addSelector: function() {
        this.doAddSelectorTapped();
        this._addSelectorHelper();
        this.$.Container.render();
    },
    _addSelectorHelper: function() {
        if(this.parallelNumber >= this.parallelLimit) {  
            return false;
        }

        this.parallelNumber ++;
        var width = (this.selectorWidth) ? this.selectorWidth : 270;
        var shortWidth = (this.selectorShortWidth) ? this.selectorShortWidth : 160;
        var classes = (this.selectorClasses && typeof this.selectorClasses == 'string') ? this.selectorClasses : '';
        var style = '';

        this.app.debug && this.log('parallelNumber', this.parallelNumber);
        this.app.debug && this.log('parallelLimit', this.parallelLimit);

        if(this.parallelNumber >= this.parallelLimit) {
            this.$.Add && this.$.Add.set('showing', false);
        }
        
        if(this.parallelNumber > this.parallelMinimum) {
            this.$.Remove && this.$.Remove.set('showing', true);
        }

        if(width != 0) {
            style += 'max-width:' + width.toString() + 'px;';
        }

        if(this.parallelNumber <= this.parallelLimit) {        
            var comp = this.$.Container.createComponent({
                kind: this.Single,
                name: 'Select_' + this.parallelNumber,
                parallelNumber: this.parallelNumber,
                onchange: 'selectorChanged',
                classes: 'biblesupersearch_bible_selector_multi ' + classes,
                width: width,
                shortWidthWidth: shortWidth,
                shortWidthThreshold: this.selectorShortWidthThreshold,
                alwaysShort: this.selectorAlwaysShort,
                downloadableOnly: this.downloadableOnly,
                defaultNull: this.defaultNull,

                // value: (this.parallelNumber == 1) ? this.app.configs.defaultBible : null,
                owner: this
            });

            // if(width && width != 0) {
            //     comp.set('width', width);
            // }
            
            // if(shortWidth && shortWidth != 0) {
            //     comp.set('shortWidthWidth', shortWidth);
            // }

            // if(this.parallelNumber == 1) {
            //     this.log('setting first default');
            //     this.log(this.app.configs);
            //     var defaultBible = this.app.configs.defaultBible;
            //     this.log('def', defaultBible);
            //     this.$.Select_1 && this.$.Select_1.set('value', defaultBible);
            // }

            this.doSelectorAdded();
            return comp;
        }

        return false;
    },
    checkAddRemoveButtons: function() {
        var addShowing = (this.parallelNumber < this.parallelLimit),
            remShowing = (this.parallelNumber > this.parallelMinimum);
        
        this.$.Add && this.$.Add.set('showing', addShowing);
        this.$.Remove && this.$.Remove.set('showing', remShowing);
    },
    removeSelector: function() {
        this.doRemoveSelectorTapped();
        this._removeSelectorHelper();
        this.$.Container.render();
    },
    _removeSelectorHelper: function() {
        if(this.parallelNumber <= this.parallelMinimum) {  
            return false;
        }

        var curParNum = this.parallelNumber,
            sel = 'Select_' + curParNum,
            freshValue = utils.clone(this.value);

        if(freshValue.length == curParNum) {
            freshValue.pop();
        }

        this.parallelNumber --;
        this.$[sel] && this.$[sel].destroy();

        this.set('value', freshValue);

        if(this.parallelNumber < this.parallelLimit) {
            this.$.Add && this.$.Add.set('showing', true);
        }
        
        if(this.parallelNumber <= this.parallelMinimum) {
            this.$.Remove && this.$.Remove.set('showing', false);
        }
    },
    _resetSelectors: function() {
        this.$.Container.destroyClientControls();
        this.parallelNumber = 0;

        var num = (this.parallelStart >= 1) ? this.parallelStart : 1;

        for(var i = 1; i <= num; i++) {
            this._addSelectorHelper();
        }

        this.$.Container.render();
    },
    selectorChanged: function(inSender, inEvent) {
        var components = this.$.Container.getClientControls(),
            value = [];

        for(i in components) {
            value.push(components[i].get && components[i].get('value'));
        }

        this.set('value', value);
        this.doValueChanged();
    },
    valueChanged: function(was, is) {
        this.valueUnfiltered = is;
        this.populateValue(is);
    },
    populateValue: function() {
        this._populateValueHelper(this.valueUnfiltered);
    },
    _populateValueHelper: function(is) {
        var valueFiltered = [];
        var selectorAdded = false;
        this.waterfall('bibleSelectReset');

        if(!Array.isArray(is)) {
            is = [is];
        }

        for(i in is) {
            var p = Number(i) + 1,
                name = 'Select_' + p.toString(),
                value = is[i],
                isNull = (!value || value == '0') ? true : false;

            if(isNaN(p)) {
                // Fix weird IE bug - yuck!
                this.log('IE NaN error');
                continue;
            }
            
            if(!isNull && !this.$[name]) {
                this.app.debug && this.log('adding selector for', value, name);
                var added = this._addSelectorHelper();
                selectorAdded = (added) ? true : selectorAdded;

                this.app.debug && this.log('selectorAdded', selectorAdded);
                
                if(added) {
                    added.render();
                    added.set('value', value); // Why isn't this automatically selecting?
                    this.app.debug && this.log('setting new selector value', value, name);
                    // added.setSelectedValue(value); 
                    valueFiltered.push(value);
                }
                else {
                    this.app.debug && this.log('Error: no selector added!');
                }
            }
            else if(this.$[name]) {
                this.app.debug && this.log('setting single value', value, name);
                this.$[name].set('value', value); // This one IS automatically selecting?
                valueFiltered.push(value);
            }
        }

        this.app.debug && this.log('valueUnfiltered', this.valueUnfiltered);
        this.app.debug && this.log('valueFiltered', valueFiltered);

        this.app.debug && this.log('selectorAdded', selectorAdded);

        if(selectorAdded) {
            this.$.Container.render();
        }

        this.value = valueFiltered;
    },
    parallelLimitChanged: function(was, is) {
        if(is < this.parallelNumber) {
            this.parallelLimit = this.parallelNumber;
        }
        else {
            this.populateValue();
        }

        var showAdd  = (this.parallelNumber >= this.parallelLimit) ? false : true;
        this.$.Add && this.$.Add.set('showing', showAdd);
    },
    // parallelLimitForceSet: function(value, skipCLeanup) {
    //     var curParLim = this.get('parallelLimit'),
    //         skipCLeanup = typeof skipCLeanup == 'undefinded' ? false : skipCLeanup;

    //     if(!skipCLeanup) {
    //         this.parallelCleanup();
    //     }
    // },
    parallelStartChanged: function(was, is) {
        this.parallelStartBuild();
    },
    parallelStartBuild: function() {
        if(this.parallelStart > this.parallelNumber) {
            var num = (this.parallelStart >= 1) ? this.parallelStart : 1;

            for(var i = this.parallelNumber + 1; i <= num; i++) {
                var s = this._addSelectorHelper();
            }

            this.$.Container.render();
        }
    },
    // removes some unused Bible selectors to attempt to only display between min and max
    parallelCleanup: function(parallelLimit) {
        parallelLimit = (typeof parallelLimit != 'undefined') ? parallelLimit : this.parallelLimit;
        var parallelMinimum = this.parallelStart || this.parallelMinimum; // We treat parallelstart as the enforced minimum

        if(parallelMinimum == this.parallelNumber) {
            return;  // displaying the minimum, definity nothing to do
        }

        if(this.parallelNumber >= parallelMinimum && this.parallelNumber <= parallelLimit) {
            // return; // displaying within acceptible range, nothing to do
        }

        var components = this.$.Container.getClientControls(),
            valueFiltered = [],
            changed = false,
            force = this.app.configs.parallelBibleCleanUpForce || false,
            bCount = 0;

        components.forEach(function(item) {
            var val = item.get('value');

            if((!val || val == '' || val == 0) && this.parallelNumber > parallelMinimum) {
                changed = true;
            }
            else {
                bCount ++;
                // this.log('bCount', bCount, parallelLimit, force);

                if(force && bCount > parallelLimit) {
                    changed = true;
                } else {
                    valueFiltered.push(val);
                }
            }
        }, this);

        this.debug && this.log('valueFiltered', valueFiltered);

        if(changed) {
            this.$.Container.destroyClientControls();
            this.parallelNumber = 0;
            this.set('parallelLimit', parallelLimit);
            this.setValue(valueFiltered);
            this.parallelStartBuild();
            this.checkAddRemoveButtons();
        }
    },
    // removes some unused Bible selectors to attempt to only display between min and max
    // but ONLY if the currently displayed number of selectors is outside min and max
    parallelCleanupIfNeeded: function(parallelLimit) {
        parallelLimit = (typeof parallelLimit != 'undefined') ? parallelLimit : this.parallelLimit;

        if(this.parallelNumber >= this.parallelMinimum || this.parallelNumber <= parallelLimit) {
            return;
        }

        this.parallelCleanup(parallelLimit);
    },
    disabledChanged: function(was, is) {
        var disabled = (is) ? true : false;

        this.$.Add && this.$.Add.set('disabled', disabled);
        
        var components = this.$.Container.getClientControls();

        for(i in components) {
            components[i].set('disabled', disabled);
        }
    },
    handleResize: function(inSender, inEvent) {
        var pLimCurrent = this.get('parallelLimit');

        var thr = this.app.configs.parallelBibleLimitByWidth,
            force = this.app.configs.parallelBibleCleanUpForce || false;

        if(thr != false) {
            // var width = window.innerWidth,
            var width = document.documentElement.clientWidth,
                pLim = thr[0].maxBibles || 1;
                pMin = thr[0].minBibles || 1;
                pStart = thr[0].startBibles || 1;

            for(i in thr) {
                if(thr[i].minWidth > width) {
                    break;
                } else {
                    pLim = thr[i].maxBibles || pLim;
                    pMin = thr[i].minBibles || pMin;
                    pStart = thr[i].startBibles || pStart;
                }
            }

            //pLim = (pLim == 'max' || pLim > this.parallelLimitInterface) ? this.parallelLimitInterface : pLim;
            pLim = (pLim == 'max') ? this.parallelLimitInterface : pLim;

            if(pLim != pLimCurrent || pStart != this.parallelStart || pMin != this.parallelMinimum) {
                
                this.app.debug && this.log('new parallelMax', pLim);
                this.app.debug && this.log('new parallelMin', pMin);
                this.app.debug && this.log('new parallelStart', pStart);
                
                // if(force) {
                //     this.parallelNumber = 0;
                // }

                this.set('parallelLimit', pLim);
                this.set('parallelStart', pStart);
                this.set('parallelMinimum', pMin);
                this.parallelCleanup(pLim);
            }
        }
    },
});
