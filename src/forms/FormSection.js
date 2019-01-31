var kind = require('enyo/kind');

module.exports = kind({
    name: 'FormSection',

    create: function() {
        this.inherited(arguments);

        var styles = this.app.configs.formStyles || {};

        Object.entries(styles).forEach(function(item) {
            this.applyStyle(item[0], item[1]);
        }, this);
    }
});
