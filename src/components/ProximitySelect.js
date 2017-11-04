var Select = require('./RangeSelect');
var kind = require('enyo/kind');

module.exports = kind({
    name: 'ProximitySelect',
    kind: Select,
    rangeOptions: [1,2,5,10,15,20],
    rangeUnit: 'verses',
    postOptions: [
        {label: 'Chapter', value: 999}
    ]
});
