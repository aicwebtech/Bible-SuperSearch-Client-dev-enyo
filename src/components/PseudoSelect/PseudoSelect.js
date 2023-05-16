var kind = require('enyo/kind');
var Opt = require('./PseudoOption');

module.exports = kind({
	name: 'PseudoSelect',
	classes: 'bss_pseudo_select',
	toggled: false, // whether full drop down menu is showing.
	selected: null, // Selected Index
	optionComponents: [],

	published: {
		value: null,
	},

	handlers: {
		onPseudoOptionTap: 'handleOptionTap',
		//ontap: 'handleVisableTap'
	},

	components: [
		{
			name: 'Visible', 
			ontap: 'handleVisableTap',
			classes: 'bss_pseudo_select_visable',
			components: [
				{
					name: 'Placeholder',
					classes: 'bss_pseudo_select_placeholder',
					content: '(value)'
				}, 
				{
					name: 'Button',
					classes: 'bss_pseudo_select_button',
					components: [
						{tag: 'span', content: "▼"}
					]
				},
				{style: 'clear: both'}
			]
		}, 
		{
			name: 'Toggle',
			classes: 'bss_pseudo_select_toggle',
			showing: false,
			defaultKind: Opt
		}
	],

	create: function() {
		this.inherited(arguments);
		this.createOptionComponents(this.optionComponents);
		this.initOptions();
	},
	initOptions: function() {
		controls = this.$.Toggle.getClientControls();

		if(controls[0]) {
			this.$.Placeholder.set('content', controls[0].get('content'));
		}
	},
	createOptionComponent: function(component) {
		this.$.Toggle.createComponent(component);
	},	
	createOptionComponents: function(components) {
		this.$.Toggle.createComponents(components);
	},
	renderOptionComponents: function() {
		this.initOptions();
		this.$.Toggle.render();
	},
	handleOptionTap: function(inSender, inEvent) {
		if(inEvent.type == 'option') {		
			this.set('toggled', false);
			this.$.Placeholder.set('content', inEvent.content);
		}


		this.log(inEvent);
	},
	handleVisableTap: function() {
		this.log();
		// this.$.Toggle.set('showing', !this.$.Toggle.get('showing'));
		this.set('toggled', !this.get('toggled'));
	}, 
	valueChanged: function(was, is) {

	},
	resetValue: function() {
		// to do
	},
	toggledChanged: function(was, is) {
		this.log(this.toggled);
		this.addRemoveClass('bss_pseudo_option_show', !!this.toggled);
		this.$.Toggle.set('showing', !!this.toggled);
	},
	setSelected: function(index) {
		controls = this.$.Toggle.getClientControls();

		for(i in controls) {
			controls[i].addRemoveClass('bss_pseudo_selected', i == index);
			controls[i].addRemoveClass('bss_pseudo_not_selected', i != index);
		}
	},
	setSelectedByValue: function(value, defaultIndex) {
        var value = value || 0,
            controls = this.$.Toggle.getClientControls();

        // this.log('select: attempting to set to', value);

        for(i in controls) {
            // IE hack fix :P  make sure it has get()
            if(controls[i].get && controls[i].get('value') == value) {
                this.setSelected(i);
                this.setValue(value);
                return true;
                break;
            }
        }

        // this.log('select: value not found', value);

        if(typeof defaultIndex != 'undefined') {
            this.setSelected(defaultIndex);
        }

        return false;
	}, 
	setSelectedByContent: function(content, defaultIndex) {
        var content = content || 0,
            controls = this.$.Toggle.getClientControls();

        for(i in controls) {
            // IE hack fix :P  make sure it has get()
            if(controls[i].get && controls[i].get('content') == content) {
                this.setSelected(i);
                this.setValue(controls[i].get('value'));
                return true;
                break;
            }
        }

        if(typeof defaultIndex != 'undefined') {
            this.setSelected(defaultIndex);
        }

        return false;
	}
});
