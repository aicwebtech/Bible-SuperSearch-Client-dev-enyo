var kind = require('enyo/kind');
var Image = require('./Image');

module.exports = kind({
    name: 'Toggle',
    tag: 'span',
    trueImage: null,  // Image that displays when value = true
    falseImage: null, // Image that displays when value = false,
    trueAlt: '',
    falseAlt: '',
    // ontap: 'toggleValue',

    published: {
        value: false,
    },

    handlers: {
        ontap: 'toggleValue'
    },

    create: function() {
        this.inherited(arguments);

        this.createComponent({
            name: 'ImgFalse',
            kind: Image,
            relSrc: this.falseImage,
            // attributes: {title: this.falseAlt},
            alt: this.falseAlt,
            // ontap: this.toggleValue,
            showing: !this.value
        });        

        this.createComponent({
            name: 'ImgTrue',
            kind: Image,
            relSrc: this.trueImage,
            // attributes: {title: this.trueAlt},
            alt: this.trueAlt,
            // ontap: this.toggleValue,
            showing: this.value
        });
    },

    valueChanged: function(was, is) {
        if(is) {
            this.$.ImgTrue.set('showing', true);
            this.$.ImgFalse.set('showing', false);
        }
        else {
            this.$.ImgFalse.set('showing', true);
            this.$.ImgTrue.set('showing', false);
        }
    },
    toggleValue: function() {
        this.set('value', !this.get('value'));
    }

});
