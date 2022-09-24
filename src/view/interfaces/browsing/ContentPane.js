var kind = require('enyo/kind');
var Advanced = require('../../../forms/advanced/AdvancedClassic');
var Form = require('../../../forms/ClassicUserFriendly2');
var ContentBase = require('../ContentPaneBase');
// var FormatButtons = require('./FormatButtons');
var FormatButtons = require('../../../components/FormatButtons/FormatButtonsHtml');

var forms = {
    Form: Form,
    Advanced: Advanced
};

module.exports = kind({
    name: 'Content_Browsing',
    kind: ContentBase,
    classes: 'biblesupersearch_content',
    formatButtonsView: FormatButtons,
    FormatButtonsHideExtras: false,
    forms: forms,

    create: function() {
        if(this.formView != null) {
            this.forms.Form = this.formView;
            // Formview is expecting a string representing an index in this.forms so we set it to that
            this.formView = 'Form'; 
        }

        this.inherited(arguments);
    }
});
