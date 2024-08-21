var kind = require('enyo/kind');
var Base = require('./ExpandingBase');

module.exports = kind({
    name: 'Expanding',
    kind: Base,
    // formView: formView,
    advancedFormView: null,
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
    create: function() {
        // this.app.set('useNewSelectors', true);
        this.inherited(arguments);
    }
});