var kind = require('enyo/kind');

module.exports = kind({
	name: 'PseudoOption',
	classes: 'bss_pseudo_option',
	value: null,

	handlers: {
		ontap: 'handleTap'
	},

	handleTap: function() {
		this.log();
		this.bubble('onPseudoOptionTap', {value: this.value});
	}
});
