var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Single = require('./SingleSelect');

module.exports = kind({
    name: 'MultiSelect',
    parallelNumber: 0,  // Number of currently showing parallel Bibles
    parallelLimit: 6,   // Maximum number of parallel Bibles that can be displayed
    parallelStart: 1,   // Number of parallel Bibles to display initially
    selectorWidth: 0,   // Pixels, 0 means automatic

    components: [
        {name: 'Container', tag: 'span'},
        {name: 'Add', kind: Button, content: 'Add Bible', ontap: 'addSelector'}
    ],

    published: {
        value: []
    },

    create: function() {
        this.inherited(arguments);
        var num = (this.parallelStart >= 1) ? this.parallelStart : 1;

        for(var i = 1; i <= num; i++) {
            this._addSelectorHelper();
        }
    },
    addSelector: function() {
        this._addSelectorHelper();
        this.$.Container.render();
    },
    _addSelectorHelper: function() {
        this.parallelNumber ++;
        var width = (this.selectorWidth) ? this.selectorWidth : 0;
        
        if(this.parallelNumber >= this.parallelLimit) {
            this.$.Add.set('showing', false);
        }

        if(this.selectorWidth != 0) {
            style += 'width:' + this.selectorWidth.toString() + ';';
        }

        if(this.parallelNumber <= this.parallelLimit) {        
            this.$.Container.createComponent({
                kind: Single,
                name: 'Select_' + this.parallelNumber,
                parallelNumber: this.parallelNumber,
                onchange: 'selectorChanged',
                classes: 'biblesupersearch_bible_selector_multi',
                width: width,
                // value: (this.parallelNumber == 1) ? this.app.configs.defaultBible : null,
                owner: this
            });

            // if(this.parallelNumber == 1) {
            //     this.log('setting first default');
            //     this.log(this.app.configs);
            //     var defaultBible = this.app.configs.defaultBible;
            //     this.log('def', defaultBible);
            //     this.$.Select_1 && this.$.Select_1.set('value', defaultBible);
            // }
        }
    },
    selectorChanged: function(inSender, inEvent) {
        var components = this.$.Container.getClientControls(),
            value = [];

        for(i in components) {
            value.push(components[i].get('value'));
        }

        this.set('value', value);
    },
    valueChanged: function(was, is) {
        this.log(was, is);
        return;

        if(!Array.isArray(is)) {
            this.value = [is];
        }

        for(i in this.value) {
            var p = Number(i) + 1,
                name = 'Select_' + p.toString(),
                value = this.value[i];

            this.log('single value', value);
            if(!this.$[name]) {
                this.log('does not exist', name);
            }

            this.$[name] && this.$[name].set('value', value);
        }
    }
});
