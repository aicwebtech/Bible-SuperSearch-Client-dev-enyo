var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Single = require('./SingleSelect');
var i18n = require('../Locale/i18nContent');

module.exports = kind({
    name: 'MultiSelect',
    parallelNumber: 0,  // Number of currently showing parallel Bibles
    parallelLimit: 6,   // Maximum number of parallel Bibles that can be displayed
    parallelStart: 1,   // Number of parallel Bibles to display initially
    selectorWidth: 0,   // Pixels, 0 means automatic
    selectorShortWidth: 0,
    selectorShortWidthThreshold: 250,
    selectorClasses: '',
    valueUnfiltered: [],
    downloadableOnly: false,
    defaultNull: false, // Use NULL as the default value, ignoring the configured default

    events: {
        onValueChanged: '',
        onAddSelectorTapped: '',
        onSelectorAdded: '',
    },

    components: [
        {name: 'Container', tag: 'div'},
        {name: 'Add', kind: Button, content: 'Add Bible', ontap: 'addSelector', components: [{kind: i18n, content: 'Add Bible'}]}
    ],

    published: {
        value: [],
        disabled: false
    },

    create: function() {
        this.inherited(arguments);
        var num = (this.parallelStart >= 1) ? this.parallelStart : 1;
        var bibleCount = this.app.getNumberOfEnabledBibles();
        this.parallelLimit = (bibleCount < this.parallelLimit) ? bibleCount : this.parallelLimit;

        for(var i = 1; i <= num; i++) {
            this._addSelectorHelper();
        }
    },
    resetValue: function() {
        this.setValue([]);
        // this.parallelCleanup();
        this.$.Container.destroyClientControls();
        this.parallelNumber = 0;

        var num = (this.parallelStart >= 1) ? this.parallelStart : 1;

        for(var i = 1; i <= num; i++) {
            this._addSelectorHelper();
        }

        this.$.Container.render();
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
            this.$.Add.set('showing', false);
        }
        else if(this.parallelNumber < this.parallelLimit) {
            // this.$.Add.set('showing', true);
        }

        if(width != 0) {
            style += 'max-width:' + width.toString() + 'px;';
        }

        if(this.parallelNumber <= this.parallelLimit) {        
            var comp = this.$.Container.createComponent({
                kind: Single,
                name: 'Select_' + this.parallelNumber,
                parallelNumber: this.parallelNumber,
                onchange: 'selectorChanged',
                classes: 'biblesupersearch_bible_selector_multi ' + classes,
                width: width,
                shortWidthWidth: shortWidth,
                shortWidthThreshold: this.selectorShortWidthThreshold,
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
                    added.set('value', value); // Why isn't this automatically selecting?
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

        // this.$.Select_0 && this.log('Select_0 exists');
        // this.$.Select_1 && this.log('Select_1 exists');
        // this.$.Select_2 && this.log('Select_2 exists');
        // this.$.Select_3 && this.log('Select_3 exists');
        // this.log('parallelNumber', this.parallelNumber);

        this.$.Select_0 && this.$.Select_0.applyDefaultValue();
        this.$.Select_1 && this.$.Select_1.applyDefaultValue();

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
        this.$.Add.set('showing', showAdd);
    },
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
    parallelCleanup: function() {
        if(this.parallelStart == this.parallelNumber) {
            return;  // displaying the minimum, definity nothing to do
        }

        if(this.parallelNumber >= this.parallelStart && this.parallelNumber <= this.parallelLimit) {
            // return; // displaying within acceptible range, nothing to do
        }

        var components = this.$.Container.getClientControls(),
            valueFiltered = [],
            changed = false;

        components.forEach(function(item) {
            var val = item.get('value');

            if((!val || val == '' || val == 0) && this.parallelNumber > this.parallelStart) {
                changed = true;
            }
            else {
                valueFiltered.push(val);
            }
        }, this);

        if(changed) {
            this.$.Container.destroyClientControls();
            this.parallelNumber = 0;
            this.setValue(valueFiltered);
            this.parallelStartBuild();
        }
    },
    disabledChanged: function(was, is) {
        var disabled = (is) ? true : false;

        this.$.Add.set('disabled', disabled);
        
        var components = this.$.Container.getClientControls();

        for(i in components) {
            components[i].set('disabled', disabled);
        }

    }
});
