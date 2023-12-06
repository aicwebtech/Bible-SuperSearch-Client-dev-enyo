var kind = require('enyo/kind');
var Opt = require('./PseudoOption');
var Placeholder = require('./PseudoPlaceholder');
var i18n = require('../Locale/i18nComponent');
var PseudoSelect = require('./PseudoSelect');
var Input = require('enyo/Input');

module.exports = kind({
	name: 'PseudoAutocomplete',
	classes: 'bss_pseudo_autocomplete',
	toggled: false, // whether full drop down menu is showing.
	value: null, // Selected Index
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
        {from: 'app.hasMouse', to: 'hasMouse'},
        {from: 'value', to: '$.Input.value', oneWay: false, transform: function(value, dir) {
            console.log(value, dir);

            if(dir == 2) {
                this.showAutocomplete(value);
            }

            return value;
        }}
    ],

	observers: [
        {method: 'watchMouse', path: ['hasMouse']}
    ],

	components: [
		{
			name: 'Visible', 
			classes: 'bss_pseudo_autocomplete_visible',
			components: [
				{
					name: 'Input',
					kind: Input,          
					classes: 'bss_pseudo_autocomplete_input',
				},
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
		// this.createOptionComponents(this.optionComponents);
		// this.initOptions();
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
        this.log(value);
        this.set('toggled', false);
        this.destroyOptionControls();

        if(!value || value == '' || 
            value.length < this.app.configs.autocompleteThreshold || 
            !this.app.configs.autocompleteEnable || 
            this.app.configs.autocompleteEnable == 'false'
        ) {
            return;
        }
        
        var opts = this.generateAutocompleteOptions(value);

        if(opts && opts.length > 0) {
            this.createOptionComponents(opts);
            this.$.Toggle.render();
            this.set('toggled', true);
        }
    },
    generateAutocompleteOptions: function(value) {
        var opts = [],
            lastComma = value.lastIndexOf(','),
            lastSemiColon = value.lastIndexOf(';'),
            split = Math.max(lastComma, lastSemiColon),
            valuePrefix = value.substring(0, split + 1),
            valueBook = value.substring(split + 1).trim(),
            contentPrefix = valuePrefix ? '... ' : '';
        
        valuePrefix += valuePrefix ? ' ' : '';

        this.log('value', value);
        this.log('valuePrefix', valuePrefix);
        this.log('valueBook', valueBook);

        if(!valueBook || valueBook == '' || valueBook.length < this.app.configs.autocompleteThreshold) {
            return [];
        }

        var books = this.getBooksByName(valueBook);

        if(!books || books.length == 0) {
            return [];
        }

        books.forEach(function(item) {
            opts.push({content: contentPrefix + item.name, value: valuePrefix + item.name});
        });

        // this.log('sof', sof);
        this.log('opts', opts);

        return opts;
    },    
    generateAutocompleteOptionsTest: function(value) {
        var opts = [];

        var superopts = ['ham', 'bacon', 'pepperoni', 'cheese', 'chicken', 'sausage'];

        var sof = superopts.filter(function(item) {
            return item.includes(value);
        });

        sof.forEach(function(item) {
            opts.push({content: item, value: item});
        });

        this.log('sof', sof);
        this.log('opts', opts);

        return opts;
    },
    getBooksByName: function(bookName) {
        bookName = this.app._fmtBookNameMatch(bookName);
        var locale = this.app.get('locale');
        var BookList = this.app.localeBibleBooks[locale] || this.app.statics.books;

        // Pass 1: Exact match
        var books = BookList.filter(function(bookItem) {
            if(bookName == bookItem.fn || bookName == bookItem.sn) {
                return true;
            }

            if(bookItem.matching && bookItem.matching.includes && bookItem.matching.includes(bookName)) {
                return true;
            }

            var namePeriodToSpace = bookItem.fn.replace(/\./g,' ');

            if(bookName == namePeriodToSpace) {
                return true;
            }

            return false;
        });

        if(!this.app.configs.autocompleteMatchAnywhere || this.app.configs.autocompleteMatchAnywhere == 'false') {
            return books;
        }

        // Pass 2: Partial match
        if(!books || books.length == 0) {
            books = BookList.filter(function(bookItem) {
                if(bookItem.fn.indexOf(bookName) == 0) {
                    return true;
                }                

                if(bookItem.sn.indexOf(bookName) == 0) {
                    return true;
                }

                return false;
            });
        }

        // Pass 3: (Experimental) Partial match, ignoring pumctuation
        if(!books || books.length == 0) {
            var bookNameNoPunc = bookName.replace(/[ .;:]/g, ' ');

            books = BookList.filter(function(bookItem) {
                var biNameNoPunc = bookItem.fn.replace(/[ .;:]/g, ' ');
                var biShortameNoPunc = bookItem.sn.replace(/[ .;:]/g, ' ');

                if(biNameNoPunc.indexOf(bookNameNoPunc) == 0) {
                    return true;
                }                

                if(biShortameNoPunc.indexOf(bookNameNoPunc) == 0) {
                    return true;
                }

                return false;
            });
        }

        return books;
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
	},
	handleGlobalTap: function(inSender, inEvent) {
		this.log();

        if(
			inEvent.e.target != this.$.Input.hasNode() &&
			inEvent.e.target != this.$.Visible.hasNode() &&
			inEvent.e.target != this.$.Toggle.hasNode()
		) {
			this.set('toggled', false);
		}
	},

	handleBlur: function() {
		this.log();
        //this.set('toggled', false);
	},
	handleMouseOut: function() {
		//this.log();
		//this.set('toggled', false);
	},
	watchMouse: function(pre, cur, prop) {
		//this.log(cur, prop);
	},
	handleOptionTap: function(inSender, inEvent) {
		this.log(inSender, inEvent);

        if(inEvent.type == 'option') {		
			this.set('toggled', false);
			//this.$.Input.set('value', inEvent.value);
            this.$.Input.hasNode().focus();
			this.set('value', inEvent.value);
			this.bubble('onchange');
		}
	},
	valueChanged: function(was, is) {
		// var controls = this.$.Toggle.getClientControls(),
		// 	control = controls[this.valueIdxMap[is]] || null;

		// if(!control || control == null) {
		// 	this.resetValue();
		// 	return;
		// }

		// this._afterValueChanged(control);
	},
	resetValue: function() {
        this.set('value', null);

		// if(this.hasOptions) {
		// 	controls = this.$.Toggle.getClientControls();
		// 	control =  controls[0];
		// 	this.value = control.get('value');
		// } else {
		// 	control = null;
		// 	this.value = null;
		// }

		// this._afterValueChanged(control);

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
        return;

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
});
