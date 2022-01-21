var kind = require('enyo/kind');
var Base = require('./ExpandingBase');
var formView = require('../../../forms/expanding/ExpandingLargeInput');

module.exports = kind({
    name: 'ExpandingLargeInput',
    kind: Base,
    formView: formView,
    advancedFormView: null //advancedFormView,
});
