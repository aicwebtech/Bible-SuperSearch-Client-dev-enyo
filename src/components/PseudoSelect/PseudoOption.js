var kind = require('enyo/kind');
var i18n = require('../Locale/i18nComponent');

module.exports = kind({
	name: 'PseudoOption',
	kind: i18n,
	classes: 'bss_pseudo_option',
	value: null,
	selected: false,

	handlers: {
		ontap: 'handleTap',
		onClearSelections: 'clearSelection',
		onSetValue: 'setValue'
	},

	handleTap: function() {
		this.log();
		this.bubble('onPseudoOptionTap', {value: this.value, content: this.content, type: 'option'});
	},
	clearSelection: function() {
		this.set('selection', false);
	},
	selectedChanged: function(was, is) {
		this.addRemoveClass('bss_pseudo_selected', !!this.selected);
		this.addRemoveClass('bss_pseudo_not_selected', !this.selected);
	},
	setValue: function(inSender, inEvent) {
		this.set('selected', inEvent.value == this.value);
	}
});
