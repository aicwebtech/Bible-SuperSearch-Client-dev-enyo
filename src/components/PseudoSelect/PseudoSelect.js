var kind = require('enyo/kind');
var Opt = require('./PseudoOption');
var Placeholder = require('./PseudoPlaceholder');
var i18n = require('../Locale/i18nComponent');
var Signal = require('../../components/Signal');

module.exports = kind({
	name: 'PseudoSelect',
	classes: 'bss_pseudo_select',
	toggled: false, // whether full drop down menu is showing.
	selected: null, // Selected Index
    keyboardSelected: null, // Keyboard selected Index
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
        onLocaleChange: 'localeChanged'
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
			classes: 'bss_pseudo_select_visible',
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
		}, 
        {
            kind: Signal,
            onkeyup: 'handleKeyUp',
            onkeydown: 'handleKeyDown'
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
        // this.log('franken baken');

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
    handleKeyUp: function(inSender, inEvent) {
        if(!this.get('toggled')) {
            return;
        }

        this.log(inSender, inEvent);

        var code = inEvent.keyCode || null;

        if(code != 13 && code != 38 && code != 40) {
            // var value = this.$.Input.get('value');
            // this.autocomplete(value);
            // do something?
        }
    },
	handleKeyDown: function(inSender, inEvent) {
        if(!this.get('toggled')) {
            return;
        }

        this.log(inSender, inEvent);

        var code = inEvent.keyCode || null;

        if(code == 38 || code == 40) {
            inEvent.preventDefault();
            var dir = code == 38 ? -1 : 1;
            this.moveSelection(dir); // define me
        } 
        else if(code == 13) {
            // item has been selected, set it as value
            this.setSelected(this.keyboardSelected);
            this.set('toggled', false);
            this.bubble('onchange');
        }
    },

    moveSelection: function(dir) {
        if(!this.get('toggled')) {
            return;
        }

        var controls = this.$.Toggle.getClientControls(),
            sel = this.get('keyboardSelected');

        sel = (sel == null) ? -1 : sel;

        var selNew = sel + dir;

        if(controls[selNew] && !controls[selNew].hasClass('bss_pseudo_option')) {
            selNew += dir;
        } 

        selNew = selNew >= 0 ? selNew : -1;

        this.log(dir, sel, selNew);

        this.setKeyboardSelected(selNew);
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
		this._clearKeyboardSelected();
        this.addRemoveClass('bss_pseudo_option_show', !!this.toggled);
		this.$.Toggle.set('showing', !!this.toggled);

        this.waterfall('onToggleChanged', {toggled: this.toggled});

        if(this.toggled) {
            var idx = this.valueIdxMap[ this.get('value') ];
            this.set('keyboardSelected', this.get('selected'));

            this._toggleScrollHelper(idx);

            // var controls = this.$.Toggle.getClientControls();
            // var top = 0;
            // var margin = 5;
            // var client = this.app.get('client');
            // var optGroups = 0;
            // var isOptGroup = false;


            // for(var i = 0; i < idx; i++) {
            //     if(controls[i].hasNode()) {
            //         if(controls[i].hasClass('bss_pseudo_optgroup')) {
            //             isOptGroup = true;
            //             optGroups ++;
            //         }

            //         styles = window.getComputedStyle(controls[i].hasNode());
            //         margin =    parseFloat(styles['marginTop']) +
            //                     parseFloat(styles['marginBottom']);
            //         height = controls[i].hasNode().offsetHeight;

            //         // this.log(controls[i].get('content'));
            //         // this.log('height', height);
            //         // this.log('margin', margin);
            //         // this.log('total', height + margin);

            //         if(client.isMobile) {
            //             if(isOptGroup && optGroups > 1) {
            //                 height += 0.35;
            //             }

            //             if(!isOptGroup) {                        
            //                 if(height > 15) {
            //                     mult = Math.floor(height / 15);
            //                     height -= mult * 2;
            //                 } else {
            //                     //height -= 2;
            //                 }
            //             }
            //         }

            //         //this.log('node', controls[i].hasNode().offsetHeight, height, margin);

            //         top += height + margin;
            //     }
            // } 


            // // if(client.isMobile) {
            // //     top += 4;
            // // }

            // this.app.debug && this.log(idx, top);

            // this.$.Toggle.hasNode() && this.$.Toggle.hasNode().scrollTo({
            //     // top: 1300, 
            //     top: top, 
            //     left: 0, 
            //     behavior: 'instant' // intentionally hardcoded
            // });
        }
	},
    _toggleScrollHelper: function(idx) {
        var controls = this.$.Toggle.getClientControls();
        var top = 0;
        var margin = 5;
        var client = this.app.get('client');
        var optGroups = 0;
        var isOptGroup = false;

        for(var i = 0; i < idx; i++) {
            if(controls[i].hasNode()) {
                if(controls[i].hasClass('bss_pseudo_optgroup')) {
                    isOptGroup = true;
                    optGroups ++;
                }

                styles = window.getComputedStyle(controls[i].hasNode());
                margin =    parseFloat(styles['marginTop']) +
                            parseFloat(styles['marginBottom']);
                height = controls[i].hasNode().offsetHeight;

                // this.log(controls[i].get('content'));
                // this.log('height', height);
                // this.log('margin', margin);
                // this.log('total', height + margin);

                if(client.isMobile) {
                    if(isOptGroup && optGroups > 1) {
                        height += 0.35;
                    }

                    if(!isOptGroup) {                        
                        if(height > 15) {
                            mult = Math.floor(height / 15);
                            height -= mult * 2;
                        } else {
                            //height -= 2;
                        }
                    }
                }

                //this.log('node', controls[i].hasNode().offsetHeight, height, margin);

                top += height + margin;
            }
        } 


        // if(client.isMobile) {
        //     top += 4;
        // }

        this.app.debug && this.log(idx, top);

        this.$.Toggle.hasNode() && this.$.Toggle.hasNode().scrollTo({
            // top: 1300, 
            top: top, 
            left: 0, 
            behavior: 'instant' // intentionally hardcoded
        });
    },
	_clearSelected: function() {
		/* private */
		this.waterfall('onClearSelections');
	}, 
    _clearKeyboardSelected: function() {
        /* private */
        this.keyboardSelected = null;
        this.waterfall('onClearKeyboardSelections');
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
    setKeyboardSelected: function(index) {
        this._clearKeyboardSelected();
        this.keyboardSelected = index;

        controls = this.$.Toggle.getClientControls();

        if(index && controls[index]) {
            controls[index].set('keyboardSelected', true);
            this._toggleScrollHelper(index);

            // this.log('has option', index);

        } else if(index == null || !this.hasOptions) {
            // this.log('null option', index);
        }

    },
	setSelectedByValue: function(value, defaultIndex) {
        var value = value || 0,
            controls = this.$.Toggle.getClientControls();

        for(i in controls) {
            // IE hack fix :P  make sure it has get()
            if(controls[i].get && controls[i].get('value') == value) {
                this.setSelected(i);
                this.setValue(value);
                return true;
                break;
            }
        }

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
