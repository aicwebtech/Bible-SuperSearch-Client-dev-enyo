var kind = require('enyo/kind');
var Opt = require('./PseudoOption');

module.exports = kind({
	name: 'PseudoSelect',
	classes: 'bss_pseudo_select bss_pseudo_option_hide',
	toggled: false, // whether full drop down menu is showing.
	selected: null, // Selected Index

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
			isChrome: true,
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
						{tag: 'span', content: "V"}
					]
				},
				{style: 'clear: both'}
			]
		}, 
		{kind: Opt, content: 'select one ...', value: '0'},
		{kind: Opt, content: 'stuff 1', value: '1'},
		{kind: Opt, content: 'stuff 2', value: '2'},
		{kind: Opt, content: 'stuff 3', value: '3'},
	],

	_components: [
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
						{tag: 'span', content: "V"}
					]
				},
				{style: 'clear: both'}
			]
		}, 
		{
			name: 'Toggle',
			classes: 'bss_pseudo_select_toggle',
			showing: false,
			components: [
				{kind: Opt, content: 'select one ...', value: '0'},
				{kind: Opt, content: 'stuff 1', value: '1'},
				{kind: Opt, content: 'stuff 2', value: '2'},
				{kind: Opt, content: 'stuff 3', value: '3'},
			], // your options here
		}
	],

	handleOptionTap: function(inSender, inEvent) {
		this.$.Toggle.set('showing', false);

		this.$.Placeholder.set('content', inSender.content);

		this.log(inEvent);
	},

	handleVisableTap: function() {
		this.log();
		// this.$.Toggle.set('showing', !this.$.Toggle.get('showing'));
		this.set('toggled', !this.get('toggled'));
	}, 
	valueChanged: function(was, is) {

	},
	toggledChanged: function(was, is) {
		this.log(this.toggled);
		this.addRemoveClass('bss_pseudo_option_hide', !this.toggled);
	},
	setSelected: function(index) {
		controls = this.getClientControls();

		for(i in controls) {
			controls[i].addRemoveClass('bss_pseudo_selected', i == index);
			controls[i].addRemoveClass('bss_pseudo_not_selected', i != index);
		}
	},
	setSelectedByValue: function(value, defaultIndex) {
        var value = value || 0,
            controls = this.getClientControls();

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
            controls = this.getClientControls();

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
