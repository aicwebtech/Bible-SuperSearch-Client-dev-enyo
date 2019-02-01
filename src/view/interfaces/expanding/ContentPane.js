var kind = require('enyo/kind');
var Advanced = require('../../../forms/advanced/AdvancedClassic');
var Form = require('../../../forms/expanding/Expanding');
var ContentBase = require('../ContentPaneBase');
// var FormatButtons = require('./FormatButtons');
var FormatButtons = require('../../../components/FormatButtons/classic/FormatButtonsClassic');
var Pager = require('../../../components/Pagers/CleanPager');

var forms = {
    Form: Form,
    Advanced: Advanced
};

module.exports = kind({
    name: 'Content_Expanding',
    kind: ContentBase,
    classes: 'biblesupersearch_content',
    formatButtonsView: FormatButtons,
    pagerView: Pager,
    formatButtonsToggle: true,
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
