var Select = require('./Select');
var kind = require('enyo/kind');

module.exports = kind({
    name: 'RangeSelect',
    kind: Select,
    rangeOptions: [1,2,5,10,15,20],
    rangeUnit: 'verse',
    rangeUnitPlural: 'verses',
    postOptions: [],

    handlers: {
        onLocaleChange: 'localeChanged',
    },

    create: function() {
        this.inherited(arguments);
        this._buildOptions();
    },
    _buildOptions: function() {
        this.destroyClientControls();
        var rangeUnit = this.app.t(this.rangeUnit),
            rangeUnitPlural = this.app.t(this.rangeUnitPlural);

        this.rangeOptions.forEach(function(item) {
            var unit = (item == 1) ? rangeUnit : rangeUnitPlural;
            var label = '± ' + item.toString() + ' ' + unit;

            this.createComponent({
                allowHtml: true,
                content: label,
                value: item
            });
        }, this);        

        this.postOptions.forEach(function(item) {
            this.createComponent({
                allowHtml: true,
                content: item.label,
                value: item.value
            });
        }, this);
    },
    localeChanged: function(inSender, inEvent) {
        this._buildOptions();
        this.render();
    }
});
