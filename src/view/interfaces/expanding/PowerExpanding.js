var kind = require('enyo/kind');
var Base = require('./ExpandingBase');
// var formView = require('../../../forms/expanding/ExpandingPower');
var formView = require('../../../forms/expanding/ExpandingLargeInput');

module.exports = kind({
    name: 'PowerExpanding',
    kind: Base,
    formView: formView,
    advancedFormView: null //advancedFormView,
});
