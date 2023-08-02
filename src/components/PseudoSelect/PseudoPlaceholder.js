var kind = require('enyo/kind');
var Opt = require('./PseudoOption');
var i18n = require('../Locale/i18nComponent');

module.exports = kind({
	name: 'PseudoPlaceholder',
    kind: i18n,
    allowHtml: true,                                            
    classes: 'bss_pseudo_select_placeholder'
});
