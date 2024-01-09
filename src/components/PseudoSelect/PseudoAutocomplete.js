var kind = require('enyo/kind');
var Opt = require('./PseudoOption');
var i18n = require('../Locale/i18nComponent');
// var PseudoSelect = require('./PseudoSelect');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Signal = require('../../components/Signal');

module.exports = kind({
	name: 'PseudoAutocomplete',
	classes: 'bss_pseudo_autocomplete',
	toggled: false, // whether full drop down menu is showing.
	value: null, // Selected Index
    keyboardSelected: null, // Keyboard selected Index
    keyboardSelectedInit: null,
    keyboardScrollIdx: null,
	optionComponents: [],
	hasOptions: false,
	defaultPlaceholder: '&nbsp;',
    forceDisableAutocomplete: false,
    placeholder: null,
    isComponent: false,
    useTextArea: false,
    inputStyle: null,

	published: {
		value: null,
	},

	handlers: {
		onPseudoOptionTap: 'handleOptionTap',
		onGlobalTap: 'handleGlobalTap',
        onGlobalEscape: 'handleGlobalEscape',
		onblur: 'handleBlur',
		onfocusout: 'handleBlur',
		onmouseout: 'handleMouseOut',
        onLocaleChange: 'localeChanged'
	},

	bindings: [
        // {from: 'app.hasMouse', to: 'hasMouse'},
        {from: 'placeholder', to: '$.Input.placeholder'},
        {from: 'value', to: '$.Input.value', oneWay: false, transform: function(value, dir) {
            if(dir == 2) {
                this.showAutocomplete(value);
            }

            return value;
        }}
    ],

	// observers: [
    //     {method: 'watchMouse', path: ['hasMouse']}
    // ],

	componentsTemplate: [
		{
			name: 'Visible', 
			classes: 'bss_pseudo_autocomplete_visible',
			components: [
				{
					name: 'Input',
					kind: Input,          
					classes: 'bss_pseudo_autocomplete_input',
                    enterSubmitPrevent: false
				},
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

		if(this.useTextArea) {
            this.componentsTemplate[0].components[0].kind = TextArea;
        }

        if(this.inputStyle) {
            this.componentsTemplate[0].components[0].style = this.inputStyle;
        }

        this.createComponents(this.componentsTemplate);

		// this.createOptionComponents(this.optionComponents);
        this.isComponentChanged();
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
    showAutocomplete: function(value) {
        this.set('toggled', false);
        this.destroyOptionControls();
        this._clearKeyboardSelected();

        if(!value || value == '' || 
            value.length < this.app.configs.autocompleteThreshold || 
            !this.app.configs.autocompleteEnable || 
            this.app.configs.autocompleteEnable == 'false' ||
            this.get('forceDisableAutocomplete')
        ) {
            return;
        }
        
        var opts = this.generateAutocompleteOptions(value);

        if(opts && opts.length > 0) {
            this.createOptionComponents(opts);
            this.$.Toggle.render();
            this.set('toggled', true);
        } else {
            this.$.Input.set('enterSubmitPrevent', false);
        }
    },
    generateAutocompleteOptions: function(value) {
        // Extend this kind and replace this method to generate actual options
        // These are just testing options

        var opts = [];

        var superopts = ['ham', 'bacon', 'pepperoni', 'cheese', 'chicken', 'sausage'];

        var sof = superopts.filter(function(item) {
            return item.includes(value);
        });

        sof.forEach(function(item) {
            opts.push({content: item, value: item});
        });

        return opts;
    },
	createOptionComponent: function(component) {
		return this.$.Toggle.createComponent(component);
	},	
	createOptionComponents: function(components) {
		return this.$.Toggle.createComponents(components);
	},
	renderOptionComponents: function() {
		this.$.Toggle.render();
	},
	destroyOptionControls: function() {
		this.$.Toggle.destroyClientControls();
	},
	handleGlobalTap: function(inSender, inEvent) {
        if(
			inEvent.e.target != this.$.Input.hasNode() &&
			inEvent.e.target != this.$.Visible.hasNode() &&
			inEvent.e.target != this.$.Toggle.hasNode()
		) {
			this.set('toggled', false);
            //this.$.Input.set('enterSubmitPrevent', false);
		}
	},
    handleGlobalEscape: function(inSender, inEvent) {
        this.set('toggled', false);
    },
	handleOptionTap: function(inSender, inEvent) {
        if(inEvent.type == 'option') {		
			this.set('toggled', false);
            this.$.Input.hasNode().focus();
			this.set('value', inEvent.value);
            this.cursorAtEnd();
			this.bubble('onchange');
		}
	},
    cursorAtEnd: function() {
        var end = this.$.Input.hasNode(),
            value = this.$.Input.get('value'),
            len = value.length;

            if (end.setSelectionRange) {
                end.focus();
                end.setSelectionRange(len, len);
            } else if (end.createTextRange) {
                var t = end.createTextRange();
                t.collapse(true);
                t.moveEnd('character', len);
                t.moveStart('character', len);
                t.select();
            }
    },
	handleKeyUp: function(inSender, inEvent) {
        if(!this.get('toggled')) {
            return;
        }

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

        var code = inEvent.keyCode || null,
            t = this;

        if(code == 38 || code == 40) {
            inEvent.preventDefault();
            var dir = code == 38 ? -1 : 1;
            this.moveSelection(dir); // define me
        } 
        else if(code == 13) {
            inEvent.preventDefault();
            // item has been selected, set it as value
            // this.setSelected(this.keyboardSelected);

            var controls = this.$.Toggle.getClientControls(),
                sel = this.get('keyboardSelected');

            controls[sel] && this.set('value', controls[sel].get('value'));
            this.cursorAtEnd();
            this.bubble('onchange');
            this.set('toggled', false);
            //this.$.Input.set('enterSubmitPrevent', false);

            // Ugly but idk what else to do ... 
            setTimeout(function() {
                t.$.Input.set('enterSubmitPrevent', false);
            }, 500);
            
            return true;
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

        this.setKeyboardSelected(selNew);

        // if(this.keyboardSelectedInit == null || selNew < this.keyboardSelectedInit || selNew > this.keyboardSelectedInit + 10) {
        //     var scrollNew = this.get('keyboardScrollIdx') + dir;

        //     if(selNew > this.get('keyboardScrollIdx') + 10) {
        //         scrolNew = this.get('keyboardScrollIdx') + 1;
        //     }


        //     this.keyboardSelectedInit = null;
        //     this._toggleScrollHelper(scrollNew);
        // }
    },

    setKeyboardSelected: function(index) {
        this._clearKeyboardSelected();
        this.keyboardSelected = index;
        controls = this.$.Toggle.getClientControls();

        if(controls && controls[index]) {
            controls[index].set('keyboardSelected', true);
            this.$.Input.set('enterSubmitPrevent', true);
        } else  {
            this.$.Input.set('enterSubmitPrevent', false);
        }
    },
    _clearKeyboardSelected: function() {
        /* private */
        this.keyboardSelected = null;
        this.waterfall('onClearKeyboardSelections');
    },
    valueChanged: function(was, is) {
        // do something?
	},
	resetValue: function() {
        this.set('value', null);
	},
	toggledChanged: function(was, is) {
		this.addRemoveClass('bss_pseudo_option_show', !!this.toggled);
		this.$.Toggle.set('showing', !!this.toggled);

        this.waterfall('onToggleChanged', {toggled: this.toggled});

        if(this.toggled) {
            var controls = this.$.Toggle.getClientControls();
            var top = 0;
            var margin = 5;
            var client = this.app.get('client');
            var optGroups = 0;
            var isOptGroup = false;

            // if(client.isMobile) {
            //     top += 4;
            // }

            this.$.Toggle.hasNode() && this.$.Toggle.hasNode().scrollTo({
                // top: 1300, 
                top: top, 
                left: 0, 
                behavior: 'instant' // intentionally hardcoded
            });
        }
	},
    isComponentChanged: function() {
        this.addRemoveClass('bss_pseudo_input', !this.isComponent);
    }
});
