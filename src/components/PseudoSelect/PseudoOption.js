var kind = require('enyo/kind');
var i18n = require('../Locale/i18nComponent');
var Signal = require('../../components/Signal');

module.exports = kind({
	name: 'PseudoOption',
	kind: i18n,
	classes: 'bss_pseudo_option',
	value: null,
	selected: false,
    keyboardSelected: false,
	grouped: false, // whether part of an optgroup
    valueTranslate: false, // whether the value needs to be translated
    valueVerses: false, // For translation, whether the value has verses
    valueUntranslated: null,
    _internalSet: false,

	handlers: {
		ontap: 'handleTap',
		onClearSelections: 'clearSelection',
        onClearKeyboardSelections: 'clearKeyboardSelection',
		onSetValue: 'handleSetValue',
        onToggledChanged: 'handleToggledChanged', 
        keydown: 'handleKeyDown',
        keyup: 'handleKeyUp',
        keypress: 'handleKeyPress'
	},
	create: function() {
		this.inherited(arguments);
		this.groupedChanged();

        if(this.valueTranslate && !this.valueUntranslated) {
            // this.log('init valueUntranslated', this.value);
            this.valueUntranslated = this.value;
        }

		//this.setAttribute('title', this.get('content'));
	},
	handleTap: function() {
		this.log();
        this.bubble('onPseudoOptionTap', {value: this.value, content: this.content, string: this.string, type: 'option'});
	},
    handleKeyDown: function(inSender, inEvent) {
        this.log(inSender, inEvent);

        if(this.keyboardSelected && inEvent.keyCode == 13) {
            this.handleTap();  // Treat return as a click/tap
        }
    },
    handleKeyUp: function(inSender, inEvent) {
        this.log(inSender, inEvent);
    },    
    handleKeyPress: function(inSender, inEvent) {
        this.log(inSender, inEvent);
    },
	clearSelection: function() {
		this.set('selection', false);
	}, 
    clearKeyboardSelection: function() {
        this.set('keyboardSelected', false);
    },
	selectedChanged: function(was, is) {
		this.addRemoveClass('bss_pseudo_selected', !!this.selected);
		this.addRemoveClass('bss_pseudo_not_selected', !this.selected);
	},
    keyboardSelectedChanged: function(was, is) {
        this.addRemoveClass('bss_pseudo_keyboard_selected', !!this.keyboardSelected);

        if(this.keyboardSelected) {
            this.removeClass('bss_pseudo_selected');
            this.removeClass('bss_pseudo_not_selected');
        } else {
            this.selectedChanged();
        }
    },
	groupedChanged: function() {
		this.addRemoveClass('bss_pseudo_option_grouped', !!this.grouped);
	},
	handleSetValue: function(inSender, inEvent) {
		this.set('selected', inEvent.value == this.value);
	},
    handleToggledChanged: function(inSender, inEvent) {
        // 
    },
    valueChanged: function(was, is) {
        if(!this._internalSet) {
            // this.valueUntranslated = is;
        }
    },
    translate: function() {
        this.inherited(arguments);
        this._internalSet = true;

        if(this.valueTranslate) {
            // Experimental - translating values
            if(!this.valueUntranslated) {
                // this.log('init valueUntranslated', this.value);
                this.valueUntranslated = this.value;
            }
            
            // this.log('value untranslated', this.valueUntranslated);
            // this.log('value - current', this.value);

            if(this.valueVerses) {
                this.set('value', this.app.vt(this.valueUntranslated));
            } else {
                this.set('value', this.app.t(this.valueUntranslated));
            }

            // this.log('value - translated', this.value);
        }

        this._internalSet = false;
    }
});
