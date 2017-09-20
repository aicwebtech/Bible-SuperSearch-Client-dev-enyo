var kind = require('enyo/kind');
var Sel = require('enyo/Select');

module.exports = kind({
    name: 'Select',
    kind: Sel,

    create: function() {
        this.inherited(arguments);

        if(typeof this.setSelectedByValue == 'undefined') {
            this.log('what on earth?');
            this.setSelectedByValue = function(value) {
                var value = value || 0
                    controls = this.getClientControls();

                for(i in controls) {
                    if(controls[i].get('value') == value) {
                        this.setSelected(i);
                        break;
                    }
                }
            };
        }
    },

    resetValue: function() {
        
    }
});
