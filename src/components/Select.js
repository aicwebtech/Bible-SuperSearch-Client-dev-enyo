var kind = require('enyo/kind');
var Sel = require('enyo/Select');
var i18nOption = require('./Locale/i18nSelectOption');

module.exports = kind({
    name: 'Select',
    kind: Sel,
    autoTranslate: true,

    create: function() {
        this.inherited(arguments);

        if(this.autoTranslate) {
            this.defaultKind = i18nOption;
        }

        if(typeof this.setSelectedByValue == 'undefined') {
            this.setSelectedByValue = function(value, defaultIndex) {
                var value = value || 0,
                    controls = this.getClientControls();

                // this.log('select: attempting to set to', value);

                for(i in controls) {
                    // IE hack fix :P  make sure it has get()
                    if(controls[i].get && controls[i].get('value') == value) {
                        this.setSelected(i);
                        this.setValue(value);
                        return true;
                        break;
                    }
                }

                // this.log('select: value not found', value);

                if(typeof defaultIndex != 'undefined') {
                    this.setSelected(defaultIndex);
                }

                return false;
            };
        }
    },

    getIndexByValue: function(value) {
        var value = value || 0,
            controls = this.getClientControls();

        for(i in controls) {
            if(controls[i].get('value') == value) {
                return i;
            }
        }

        return -1;
    },

    resetValue: function() {
        
    }
});
