var kind = require('enyo/kind');
var Sel = require('enyo/Select');

module.exports = kind({
    name: 'Select',
    kind: Sel,

    create: function() {
        this.inherited(arguments);

        if(typeof this.setSelectedByValue == 'undefined') {
            this.setSelectedByValue = function(value, defaultIndex) {
                var value = value || 0,
                    controls = this.getClientControls();

                // this.log('select: attempting to set to', value);

                for(i in controls) {
                    if(controls[i].get('value') == value) {
                        this.setSelected(i);
                        // this.log('select: set successfully to', value);
                        return true;
                        break;
                    }
                }

                // this.log('select: value not found', value);

                if(typeof defaultIndex != 'undefined') {
                    // this.log('select: setting default index', defaultIndex);
                    this.setSelected(defaultIndex);
                }

                return false;
            };
        }
    },

    resetValue: function() {
        
    }
});
