var kind = require('enyo/kind');

module.exports = kind({
    name: 'FormSection',
    classes: 'form_section',

    create: function() {
        this.inherited(arguments);

        if(!this.parent.subForm) {
            var styles = this.app.configs.formStyles || {};

            Object.entries(styles).forEach(function(item) {
                this.applyStyle(item[0], item[1]);
            }, this);
        }
    }
});
