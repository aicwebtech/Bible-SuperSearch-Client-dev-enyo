var kind = require('enyo/kind');

module.exports = kind({
    name: 'FormSection',
    classes: 'form_section',

    create: function() {
        this.inherited(arguments);

        if(!this.parent.subForm) {
            var styles = this.app.configs.formStyles || {};

            if(Object.entries) {            
                Object.entries(styles).forEach(function(item) {
                    this.applyStyle(item[0], item[1]);
                }, this);
            }
            // IE fix, yuck
            else {
                Object.keys(styles).forEach(function(key) {
                    var item = styles[key];
                    this.applyStyle(item[0], item[1]);
                }, this);
            }
        }
    }
});
