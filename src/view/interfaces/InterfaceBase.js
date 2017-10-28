var kind = require('enyo/kind');
var ViewController = require('enyo/ViewController');
var LoadingDialog = require('../../components/dialogs/Loading');

// Base kind for all Application views
module.exports = kind({
    name: 'InterfaceBase',
    classes: 'biblesupersearch_container',

    published: {
        ajaxLoading: false,
    },

    create: function() {
        this.inherited(arguments);
    },
    ajaxLoadingChanged: function(was, is) {
        this.log(is);

        if(!this.$.LoadingDialog) {
            this.createComponent({
                name: 'LoadingDialog',
                kind: LoadingDialog,
                showing: false
            }).render();
        }

        this.$.LoadingDialog.set('showing', is);
    }
});
