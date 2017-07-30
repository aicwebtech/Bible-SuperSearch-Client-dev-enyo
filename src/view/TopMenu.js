var kind = require('enyo/kind');
var MenuButton = require('../components/buttons/MenuButton');

var TopMenu = kind({
    name: 'TopMenu',
    classes: 'biblesupersearch_top_menu',
    components: [
        {kind: MenuButton, ontap: 'tapMenu'},
        {tag: 'span', content: 'other stuff'}
    ],
    tapMenu: function() {
        this.log();
        this.bubble('onTapMenu');
    }
});

module.exports = TopMenu;