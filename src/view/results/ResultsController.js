var kind = require('enyo/kind');
var ViewController  = require('enyo/ViewController');
// The four possible views used by this view controller extension
var CopyParagraph   = require('./ResultsCopyParagraph');
var CopyVerse       = require('./ResultsCopyVerse');
var ReadParagraph   = require('./ResultsReadParagraph');
var ReadVerse       = require('./ResultsReadVerse');
var TestView        = require('./TestView');

// var views = {
//     CopyParagraph: CopyParagraph,
//     ReadVerse: ReadVerse
// };

module.exports = kind({
    name: 'ResultsController',
    kind: ViewController,
    view: null, // View will be chosen based on form / format settings
    resetView: true,
    renderPending: false,
    // views: views,

    published: {
        resultsData: null,
        formData: null
    },

    observers: [
        // {method: 'watchRenderable', path: ['app.UserConfig.copy', 'app.UserConfig.paragraph']}
        {method: 'watchRenderable', path: ['uc.copy', 'uc.paragraph', 'uc.strongs', 'uc.italics', 'uc.red_letter']},
        {method: 'watchTextSize', path: ['uc.text_size']},
        {method: 'watchFont', path: ['uc.font']}
    ],

    // observers not working?  why? Shouldn't have tu use bindings for this
    bindings: [
        {from: 'app.UserConfig', to: 'uc', transform: function(value, dir) {
            this.log('results controller user config', value, dir);
            return value;
        }}
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
        this.applyViewFont();
        this.applyViewTextSize();
        this.view.renderResults();
        this.renderPending = false;
    },
    applyViewFont: function() {
        var font = this.app.UserConfig.get('font');

        if(this.view) {        
            this.view.addRemoveClass('font_serif', !!(font == 'serif'));
            this.view.addRemoveClass('font_sans_serif', !!(font == 'sans_serif'));
            this.view.addRemoveClass('font_monospace', !!(font == 'monospace'));
        }
    },
    applyViewTextSize: function() {
        var size = this.app.UserConfig.get('text_size') || 0;

        if(this.view) {
            var styleSize = size * .05 + 1;
            this.view.applyStyle('font-size', styleSize.toString() + 'em');
        }
    },
    watchRenderable: function(pre, cur, prop) {
        // this.log(pre, cur, prop);

        // debugging code
        // var attr = ['text_size', 'font'];
        // attr.forEach(function(item) {
        //     this.log('watchRenderable', item, this.app.UserConfig.get(item));
        // }, this);

        this.renderResults();
    },
    watchTextSize: function(pre, cur, prop) {
        // this.log(pre, cur, prop);
        this.applyViewTextSize();
    },    
    watchFont: function(pre, cur, prop) {
        // this.log(pre, cur, prop);
        this.applyViewFont();
    }
});
