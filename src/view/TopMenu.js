var kind = require('enyo/kind');
var FittableColumns = require('layout/FittableColumns');
var MenuButton = require('../components/buttons/MenuButton');

module.exports = kind({
    name: 'TopMenu',
    kind: FittableColumns,
    classes: 'biblesupersearch_top_menu',
    components: [
        {kind: MenuButton, label: 'Menu', ontap: 'tapMenu'},
        {tag: 'span', content: 'Bible SuperSearch', fit: true, classes: 'biblesupersearch_top_label'},
        {kind: MenuButton, label: 'Search', ontap: 'tapSearch'}
    ],
    tapMenu: function() {
        this.bubble('onTapMenu');
    },
    tapSearch: function() {
        //this.bubble('onTapMenu');
    }
});
