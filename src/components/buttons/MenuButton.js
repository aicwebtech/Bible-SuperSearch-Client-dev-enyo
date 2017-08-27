var kind = require('enyo/kind');
var image = require('enyo/Image');

// Generic menu button.
// Used for top menu, extended for left menu
module.exports = kind({
    tag: 'span',
    name: 'MenuButton',
    classes: 'biblesupersearch_layout_button',
    label: '',
    image: '',

    create: function() {
        this.inherited(arguments);

        if(this.image && this.image != '') {
            this.createComponent({
                kind: 'image',
                name: 'img',
                src: this.image
            });
        }        

        if(this.label && this.label != '') {
            this.createComponent({
                tag: 'span',
                name: 'label',
                content: this.label
            });
        }
    }
});
