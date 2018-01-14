var kind = require('enyo/kind');
var Advanced = require('../../../forms/advanced/AdvancedClassic');
var Form = require('../../../forms/Minimal');
var ContentBase = require('../ContentPaneBase');
// var FormatButtons = require('./FormatButtons');
var FormatButtons = require('../../../components/FormatButtons/classic/FormatButtonsClassic');

var forms = {
    Form: Form,
    Advanced: Advanced
};

module.exports = kind({
    name: 'Content',
    kind: ContentBase,
    classes: 'biblesupersearch_content',
    formatButtonsView: FormatButtons,
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
