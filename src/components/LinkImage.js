var kind = require('enyo/kind');
var Image = require('./Image');
var Anchor = require('enyo/Anchor');

module.exports = kind({
    name: 'LinkImage',
    tag: 'span',
    src: null,          // Image that displays when disabled = false,
    disabledSrc: null,  // Image that displays when disabled = true
    trueAlt: '',
    falseAlt: '',
    // ontap: 'toggleValue',

    published: {
        disabled: false,
    },

    handlers: {
        ontap: 'handleTap'
    },

    create: function() {
        this.inherited(arguments);

        this.createComponent({
            name: 'Img',
            kind: Image,
            relSrc: this.src,
            // attributes: {title: this.falseAlt},
            alt: this.falseAlt,
            showing: !this.disabled
        });        

        this.createComponent({
            name: 'ImgDisabled',
            kind: Image,
            relSrc: this.disabledSrc,
            // attributes: {title: this.trueAlt},
            alt: this.trueAlt,
            showing: this.disabled
        });
    },

    disabledChanged: function(was, is) {
        if(is) {
            this.$.ImgDisabled.set('showing', true);
            this.$.Img.set('showing', false);
        }
        else {
            this.$.Img.set('showing', true);
            this.$.ImgDisabled.set('showing', false);
        }
    },
    handleTap: function(inSender, inEvent) {
        if(this.get('disabled')) {
            return true;
        }
    }

});
