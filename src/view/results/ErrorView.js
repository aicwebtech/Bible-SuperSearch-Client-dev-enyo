// This renders individual passages
var kind = require('enyo/kind');
var i18n = require('../../components/Locale/i18nComponent');

module.exports = kind({
    name: 'ErrorView',
    kind: i18n,
    classes: 'biblesupersearch_error_view',
    allowHtml: true
});
