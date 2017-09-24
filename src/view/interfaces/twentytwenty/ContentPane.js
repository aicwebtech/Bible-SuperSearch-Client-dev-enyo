var kind = require('enyo/kind');
var Simple = require('../../../forms/Simple');
var Advanced = require('../../../forms/Advanced');
var Search = require('../../../forms/Search');
var Passage = require('../../../forms/Passage');
var ContentBase = require('../ContentPaneBase');
var FormatButtons = require('./FormatButtons');

var forms = {
    Simple: Simple,
    Search: Search,
    Advanced: Advanced,
    Passage: Passage
};

module.exports = kind({
    name: 'Content',
    kind: ContentBase,
    classes: 'biblesupersearch_content',
    forms: forms,
    formatButtonsView: FormatButtons,

    create: function() {
        this.inherited(arguments);
        // this.formViewProcess(this.formView);
    }
});
