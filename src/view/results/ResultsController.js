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
    }
});
