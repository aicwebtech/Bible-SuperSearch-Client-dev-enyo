var kind = require('enyo/kind');
var LeftMenu = require('./LeftMenu');
var Content = require('./Content');
var ContentController = require('./ContentController');
var FittableColumns = require('layout/FittableColumns');
//var GridList =        require('moonstone/DataList');

module.exports = kind({
    name: 'Middle',
    kind: FittableColumns,
    fit: true,
    classes: 'biblesupersearch_results_overflow',

    components: [
        {name: 'LeftMenu', kind: LeftMenu},
        {fit: true, classes: 'biblesupersearch_results_overflow', components: [
            {name: 'ContentController', kind: ContentController}
        ]}
    ],
    toggleMenu: function() {
        //this.$.LeftMenu.setShowing(!this.$.LeftMenu.get('showing'));
        this.$.LeftMenu.setOpen(!this.$.LeftMenu.get('open')); // Use 'open' with drawer
    }
});
