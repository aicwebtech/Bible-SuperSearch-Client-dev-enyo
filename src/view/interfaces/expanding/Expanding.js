var kind = require('enyo/kind');
var Base = require('./ExpandingBase');

module.exports = kind({
    name: 'Expanding',
    kind: Base,
    // formView: formView,
    advancedFormView: null //advancedFormView,
    // classes: 'interface_expanding',

    // create: function() {
    //     this.inherited(arguments);
    //     this.log();

    //     this.createComponent({
    //         name: 'Content',
    //         kind: ContentPane,
    //         formView: this.formView,
    //         displayFormOnCreate: true
    //     });        
    // }
});