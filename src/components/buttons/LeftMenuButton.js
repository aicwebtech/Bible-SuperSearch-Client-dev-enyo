var kind = require('enyo/kind');
var image = require('enyo/Image');
var MenuButton = require('./MenuButton');

module.exports = kind({
    tag: 'div',
    name: 'LeftMenuButton',
    kind: MenuButton,
    classes: 'biblesupersearch_layout_button',
    label: '',
    image: '',

    create: function() {
        this.inherited(arguments);
    }
});
