var kind = require('enyo/kind');
var Opt = require('./PseudoOption');

module.exports = kind({
	name: 'PseudoOptGroup',
	classes: 'bss_pseudo_optgroup',
	value: null,
	//defaultKind: Opt,

	handlers: {
		ontap: 'handleTap'
	},

	handleTap: function() {
		this.log();
		this.bubble('onPseudoOptionTap', {value: this.value, content: this.content, type: 'optgroup'});
	}
});
