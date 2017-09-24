var kind = require('enyo/kind');
var Advanced = require('../../../forms/ClassicAdvanced');
var Form = require('../../../forms/ClassicUserFriendly2');
var ContentBase = require('../ContentPaneBase');

var forms = {
    Form: Form,
    Advanced: Advanced
};

module.exports = kind({
    name: 'Content',
    kind: ContentBase,
    classes: 'biblesupersearch_content',
    forms: forms,

    create: function() {
        if(this.formView != null) {
            this.log('overriding default classic form');
            this.forms.Form = this.formView;
            // Formview is expecting a string representing an index in this.forms so we set it to that
            this.formView = 'Form'; 
        }

        this.inherited(arguments);
    }
});
