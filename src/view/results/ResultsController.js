var kind = require('enyo/kind');
var ViewController  = require('enyo/ViewController');
// The four possible views used by this view controller extension
var CopyParagraph   = require('./ResultsCopyParagraph');
var CopyVerse       = require('./ResultsCopyVerse');
var ReadParagraph   = require('./ResultsReadParagraph');
var ReadVerse       = require('./ResultsReadVerse');

module.exports = kind({
    name: 'ResultsController',
    kind: ViewController,
    view: null, // View will be chosen based on form / format settings
    resetView: true,

    published: {
        resultsData: null,
        formData: null
    },

    create: function() {
        this.inherited(arguments);
    },
    renderResults: function() {
        var paragraph = this.app.UserConfig.get('paragraph'),
            copy = this.app.UserConfig.get('copy'),
            view = ReadVerse;

        if(paragraph && copy) {
            view = CopyParagraph;
        }
        else if(copy) {
            view = CopyVerse;
        }
        else if(paragraph) {
            view = ReadParagraph;
        }

        this.set('view', view);
        this.view.set('formData', this.get('formData'));
        this.view.set('resultsData', this.get('resultsData'));
        this.view.renderResults();
    }
});
