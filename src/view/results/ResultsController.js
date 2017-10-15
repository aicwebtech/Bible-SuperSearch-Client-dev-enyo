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
    renderPending: false,

    published: {
        resultsData: null,
        formData: null
    },

    observers: [
        // {method: 'watchRenderable', path: ['app.UserConfig.copy', 'app.UserConfig.paragraph']}
        {method: 'watchRenderable', path: ['uc.copy', 'uc.paragraph']}
    ],

    // observers not working?  why? Shouldn't have tu use bindings for this
    bindings: [
        {from: 'app.UserConfig', to: 'uc'}
        // {from: 'app.UserConfig.copy', to: 'uc.copy', transform: function(value, dir) {
        //     console.log('other copy', value, dir);
        //     this.renderResults(); // RENDERING TWICE!!
        //     return value;
        // }},
        // {from: 'app.UserConfig.paragraph', to: 'uc.paragraph', transform: function(value, dir) {
        //     console.log('the par', value, dir);
        //     this.renderResults(); // RENDERING TWICE!!
        //     return value;
        // }}
    ],

    create: function() {
        this.inherited(arguments);
    },
    renderResults: function() {
        if(this.renderPending) {
            return;
        }

        this.renderPending = true;
        this.log();

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
        this.renderPending = false;
    },
    watchRenderable: function(pre, cur, prop) {
        this.log(pre, cur, prop);
        this.renderResults();
    }
});
