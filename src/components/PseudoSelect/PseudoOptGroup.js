var kind = require('enyo/kind');
var Opt = require('./PseudoOption');
var i18n = require('../Locale/i18nComponent');

module.exports = kind({
	name: 'PseudoOptGroup',
	classes: 'bss_pseudo_optgroup',
	value: null,
	label: null,
	//defaultKind: Opt,

	components: [
		{
			name: 'Label', 
			kind: i18n,
			isChrome: true, 
			classes: 'bss_pseudo_optgroup_label'
		}
	],

	bindings: [
		{from: 'label', to: '$.Label.content'}
	],

	handlers: {
		ontap: 'handleTap'
	},

	handleTap: function() {
		this.log();
		this.bubble('onPseudoOptionTap', {value: this.value, content: this.content, type: 'optgroup'});
	}
});
