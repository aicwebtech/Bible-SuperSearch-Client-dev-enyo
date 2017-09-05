var kind = require('enyo/kind');
var Drawer = require('enyo/Drawer');
var easing = require('layout/easing');
var MenuButton = require('../components/buttons/LeftMenuButton');
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'LeftMenu',
    //style: 'position:absolute;', // Inline needed because Drawer kind is overriding position coming from CSS class
    kind: Drawer,
    orient: 'h',
    //showing: false,
    //animated: false,
    resizeContainer: true,
    classes: 'biblesupersearch_left_menu',
    components: [
        {
            label: 'Simple',
            kind: MenuButton,
            name: 'Simple',
            ontap: 'clickFormMenu'
        },
        {
            label: 'Search',
            kind: MenuButton,
            name: 'Search',
            ontap: 'clickFormMenu'
        },
        {
            label: 'Passage',
            kind: MenuButton,
            name: 'Passage',
            ontap: 'clickFormMenu'
        },
        {
            label: 'Advanced',
            kind: MenuButton,
            name: 'Advanced',
            ontap: 'clickFormMenu'
        },
        {tag: 'hr'},
        {
            label: 'Settings',
            kind: MenuButton,
            name: 'Settings',
            ontap: 'clickMenu'
        }
    ],
    create: function() {
        this.inherited(arguments);
        //this.set('open', false);
        this.animated = true;
        this.$.animator.set('duration', 500);
        this.$.animator.set('easingFunction', easing.cubicOut);
    },
    // Handler for buttons which change the form displayed
    clickFormMenu: function(inSender, inEvent) {
        this.log(inSender.name);
        Signal.send('onContentChange', {content: 'Form', formView: inSender.name});
    },
    // Generic menu click handler
    clickMenu: function(inSender, inEvent) {
        this.log(inSender.name);
        Signal.send('onContentChange', {content: inSender.name});
    }
});
