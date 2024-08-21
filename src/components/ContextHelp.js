var kind = require('enyo/kind');
var Dialog = require('./dialogs/Dialog');

module.exports = kind({
	name: 'ContextHelp',
	classes: 'biblesupersearch_context_help',
	helpShowing: false,
	helpComponents: [],

	handlers: {
		onhover: 'handleHover',
		ontap: 'handleTap'
	},

	components: [
		{name: 'Placeholder', content: '?'},
		{name: 'Container', classes: 'biblesupersearch_context_help_container', showing: false}
	],

	create: function() {
		this.inherited(arguments);
		this.$.Container.createComponents(this.helpComponents);
	},

	handleTap: function(inSender, inEvent) {
		this.toggleHelpShowing();
	},	

	toggleHelpShowing: function() {
		this.set('helpShowing', !this.get('helpShowing'));
	}, 
	helpShowingChanged: function(was, is) {
		this.$.Container && this.$.Container.set('showing', is);
	}
});
