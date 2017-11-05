var Select = require('./RangeSelect');
var kind = require('enyo/kind');

module.exports = kind({
    name: 'ProximitySelect',
    kind: Select,
    rangeOptions: [1,2,3,4,5,10,15,20],
    rangeUnit: 'verse',
    rangeUnitPlural: 'verses',
    postOptions: [
        {label: 'A Chapter', value: 999}
    ]
});
