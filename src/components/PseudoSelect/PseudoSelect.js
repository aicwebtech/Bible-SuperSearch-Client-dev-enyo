var kind = require('enyo/kind');
var Opt = require('./PseudoOption');
var Placeholder = require('./PseudoPlaceholder');
var i18n = require('../Locale/i18nComponent');

module.exports = kind({
	name: 'PseudoSelect',
	classes: 'bss_pseudo_select',
	toggled: false, // whether full drop down menu is showing.
	selected: null, // Selected Index
	optionComponents: [],
	hasOptions: false,
	defaultPlaceholder: '&nbsp;',

	published: {
		value: null,
	},

	handlers: {
		onPseudoOptionTap: 'handleOptionTap',
		onGlobalTap: 'handleGlobalTap',
		onblur: 'handleBlur',
		onfocusout: 'handleBlur',
		onmouseout: 'handleMouseOut',
        onLocaleChange: 'localeChanged',
		//ontap: 'handleVisableTap'
	},

	bindings: [
        {from: 'app.hasMouse', to: 'hasMouse'}
    ],

	observers: [
        {method: 'watchMouse', path: ['hasMouse']}
    ],

	components: [
		{
			name: 'Visible', 
			ontap: 'handleVisableTap',
			classes: 'bss_pseudo_select_visable',
			components: [
				{
					name: 'Placeholder',
					kind: Placeholder,          
                    // kind: i18n,          
					allowHtml: true,                                            
					classes: 'bss_pseudo_select_placeholder',
					content: ''
				}, 
				{
					name: 'Button',
					classes: 'bss_pseudo_select_button',
					ontap: 'handleVisableTap',
					components: [
						{
							name: 'ButtonLabel',
							tag: 'span', 
							ontap: 'handleVisableTap',
							content: "▼"
						}
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
		this.valueIdxMap = {};
		this.contentIdxMap = {};
		this.hasOptions = false;
		
		for(i in controls) {
			value = controls[i].get('value') || null;
			content = controls[i].get('content');

			if(value) {
				this.valueIdxMap[value] = i;
				this.contentIdxMap[content] = i;
				this.hasOptions = true;
			}
		}

		this.resetValue();
	},
	createOptionComponent: function(component) {
		return this.$.Toggle.createComponent(component);
	},	
	createOptionComponents: function(components) {
		return this.$.Toggle.createComponents(components);
	},
	renderOptionComponents: function() {
		this.initOptions();
		this.$.Toggle.render();
	},
	destroyOptionControls: function() {
		this.$.Toggle.destroyClientControls();
		this.$.Placeholder.set('string', this.defaultPlaceholder);
	},
	handleGlobalTap: function(inSender, inEvent) {
		this.log();
        // this.log(inSender);
		// this.log(inEvent);

		//this.log(inSender.id); // nope
		
		// this.log('e target', inEvent.e);
		//this.log('e e.target', inEvent.e.target); // YES?
		//this.log('e sender', inEvent.sender);
		//this.log('S target.id', inSender.target.id);

		if(
			inEvent.e.target != this.$.Placeholder.hasNode() &&
			inEvent.e.target != this.$.Button.hasNode() &&
			inEvent.e.target != this.$.ButtonLabel.hasNode() &&
			inEvent.e.target != this.$.Visible.hasNode() &&
			inEvent.e.target != this.$.Toggle.hasNode()
		) {
			this.set('toggled', false);
		}
	},

	handleBlur: function() {
		//this.log();
		this.set('toggled', false);
	},
	handleMouseOut: function() {
		//this.log();
		//this.set('toggled', false);
	},
	watchMouse: function(pre, cur, prop) {
		//this.log(cur, prop);
	},
	handleOptionTap: function(inSender, inEvent) {
		if(inEvent.type == 'option') {		
			this.set('toggled', false);
			this.$.Placeholder.set('string', inEvent.string);
			this.set('value', inEvent.value);
			this.bubble('onchange');
		}
	},
	handleVisableTap: function() {
		this.log();
		this.set('toggled', !this.get('toggled'));
	}, 
	valueChanged: function(was, is) {
		var controls = this.$.Toggle.getClientControls(),
			control = controls[this.valueIdxMap[is]] || null;

		if(!control || control == null) {
			this.resetValue();
			return;
		}

		this._afterValueChanged(control);
	},
	resetValue: function() {

		if(this.hasOptions) {
			controls = this.$.Toggle.getClientControls();
			control =  controls[0];
			this.value = control.get('value');
		} else {
			control = null;
			this.value = null;
		}

		this._afterValueChanged(control);

		// if(controls[0]) {
		// 	this.$.Placeholder.set('string', controls[0].get('content'));
		// 	this.setSelected(0);
		// 	this.set('value', controls[0].get('value'));
		// } else {
		// 	this.$.Placeholder.set('string', '');
		// 	this.setSelected(null);
		// 	this.set('value', null);
		// }
	},
	_afterValueChanged: function(optionControl) {

		if(optionControl) {
			this.$.Placeholder.set('string', optionControl.get('string'));
		} else {
			this.$.Placeholder.set('string', this.defaultPlaceholder);
		}

		this.waterfall('onSetValue', {value: this.get('value')});
	},
	toggledChanged: function(was, is) {
		this.addRemoveClass('bss_pseudo_option_show', !!this.toggled);
		this.$.Toggle.set('showing', !!this.toggled);

        this.waterfall('onToggleChanged', {toggled: this.toggled});

        if(this.toggled) {
            var idx = this.valueIdxMap[ this.get('value') ];
            var controls = this.$.Toggle.getClientControls();
            var top = 0;
            var margin = 2;

            for(var i = 0; i < idx; i++) {
                if(controls[i].hasNode()) {
                    this.log('node', controls[i].hasNode().offsetHeight);
                    styles = window.getComputedStyle(controls[i].hasNode());
                    margin =    parseFloat(styles['marginTop']) +
                                parseFloat(styles['marginBottom']);

                    top += controls[i].hasNode().offsetHeight + margin;
                }
            }

            this.log(idx, top);

            this.$.Toggle.hasNode() && this.$.Toggle.hasNode().scrollTo({
                top: top, 
                left: 0, 
                behavior: 'instant'
            });
        }
	},
	_clearSelected: function() {
		/* private */
		this.waterfall('onClearSelections');
	},
	setSelected: function(index) {
		this._clearSelected();

		controls = this.$.Toggle.getClientControls();

		if(index && controls[index]) {
			// this.log('has option', index);
			this.set('value', controls[index].get('value'));
			// controls[index].set('selected', true);
			// this.value = controls[index].get('value');
			// this.$.Placeholder.set('string', controls[index].get('content'));
		} else if(index == null || !this.hasOptions) {
			// this.log('null option', index);
			this.$.Placeholder.set('string', '');
			this.value = null;
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
