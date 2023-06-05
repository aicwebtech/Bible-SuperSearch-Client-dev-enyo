var kind = require('enyo/kind');
var i18n = require('../Locale/i18nComponent');

module.exports = kind({
	name: 'PseudoOption',
	kind: i18n,
	classes: 'bss_pseudo_option',
	value: null,
	selected: false,
	grouped: false, // whether part of an optgroup
    valueTranslate: false, // whether the value needs to be translated
    valueVerses: false, // For translation, whether the value has verses
    valueUntranslated: null,
    _internalSet: false,

	handlers: {
		ontap: 'handleTap',
		onClearSelections: 'clearSelection',
		onSetValue: 'handleSetValue',
        onToggledChanged: 'handleToggledChanged'
	},
	create: function() {
		this.inherited(arguments);
		this.groupedChanged();

        this.valueUntranslated = this.value;

		//this.setAttribute('title', this.get('content'));
	},
	handleTap: function() {
		this.bubble('onPseudoOptionTap', {value: this.value, content: this.content, type: 'option'});
	},
	clearSelection: function() {
		this.set('selection', false);
	},
	selectedChanged: function(was, is) {
		this.addRemoveClass('bss_pseudo_selected', !!this.selected);
		this.addRemoveClass('bss_pseudo_not_selected', !this.selected);
	},
	groupedChanged: function() {
		this.addRemoveClass('bss_pseudo_option_grouped', !!this.grouped);
	},
	handleSetValue: function(inSender, inEvent) {
		this.set('selected', inEvent.value == this.value);
	},
    handleToggledChanged: function(inSender, inEvent) {
        // if(inEvent.toggled && this.selected) {
        //     this.hasNode() && this.hasNode().scrollTo({
        //         top: 0, 
        //         left: 0, 
        //         behavior: 'smooth'
        //     });
        // }
    },
    valueChanged: function(was, is) {
        if(!this._internalSet) {
            this.valueUntranslated = is;
        }
    },
    translate: function() {
        this.inherited(arguments);
        this._internalSet = true;

        // Experimental - translating values
        if(!this.valueUntranslated) {
            this.valueUntranslated = this.value;
        }

        if(this.valueTranslate) {
            // this.log('value untranslated', this.valueUntranslated);
            // this.log('value untranslated current', this.value);

            if(this.valueVerses) {
                this.set('value', this.app.vt(this.valueUntranslated));
            } else {
                this.set('value', this.app.t(this.valueUntranslated));
            }

            // this.log('value translated', this.value);
        }

        this._internalSet = false;
    }
});
