var kind = require('enyo/kind');
var LeftMenu = require('./LeftMenu');
var Content = require('./Content');
//var FittableColumns = require('layout/FittableColumns');
//var GridList =        require('moonstone/DataList');

var Middle = kind({
    name: 'Middle',
    //kind: FittableColumns,
    //fit: true,

    components: [
        {name: 'LeftMenu', kind: LeftMenu},
        {name: 'Content', kind: Content, fit: true}
    ],
    toggleMenu: function() {
        this.$.LeftMenu.setShowing(!this.$.LeftMenu.get('showing'));
    }
});

module.exports = Middle;