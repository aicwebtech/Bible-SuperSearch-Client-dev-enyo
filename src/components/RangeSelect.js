var Select = require('./Select');
var kind = require('enyo/kind');

module.exports = kind({
    name: 'RangeSelect',
    kind: Select,
    rangeOptions: [1,2,5,10,15,20],
    rangeUnit: 'verse',
    rangeUnitPlural: 'verses',
    postOptions: [],

    create: function() {
        this.inherited(arguments);

        this.rangeOptions.forEach(function(item) {
            var unit = (item == 1) ? this.rangeUnit : this.rangeUnitPlural;
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
    }
});
