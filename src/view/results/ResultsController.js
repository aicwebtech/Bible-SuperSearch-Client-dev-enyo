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
    pagerView: null,
    navigationButtonsView: null,
    renderStyleCache: null,
    copyChanged: true,
    // views: views,

    published: {
        resultsData: null,
        formData: null
    },

    observers: [
        // {method: 'watchRenderable', path: ['app.UserConfig.copy', 'app.UserConfig.paragraph']}
        {method: 'watchRenderable', path: ['uc.copy', 'uc.paragraph', 'uc.strongs', 'uc.italics', 'uc.red_letter', 'uc.highlight']},
        //{method: 'watchRenderable', path: ['uc.copy', 'uc.render_style', 'uc.strongs', 'uc.italics', 'uc.red_letter', 'uc.highlight']},
        {method: 'watchCopyRenderable', path: [
            'uc.copy_separate_line', 'uc.copy_omit_extra_br', 'uc.copy_abbr_book', 'uc.copy_text_format', 'uc.copy_passage_format', 
            'uc.copy_passage_verse_number', 'uc.copy_testament'
        ]},
        {method: 'watchTextSize', path: ['uc.text_size']},
        {method: 'watchFont', path: ['uc.font']},
        {method: 'debugRenderStyle', path: ['uc.render_style', 'uc.read_render_style', 'uc.copy_render_style']},
    ],

    // observers not working?  why? Shouldn't have tu use bindings for this
    bindings: [
        {from: 'app.UserConfig', to: 'uc', transform: function(value, dir) {
            this.app.debug && this.log('results controller user config', value, dir);
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

        this.renderStyleCache = this.app.UserConfig.get('render_style');

        // this.pagerView = this.app.getSubControl('Pager');
        // this.pagerView = this.app.getSubControl('Pager');
    },
    renderResults: function() {
        if(this.renderPending) {
            return;
        }

        this.renderPending = true;

        var copy = this.app.UserConfig.get('copy'),
            view = ReadVerse,
            renderStyle = this.app.UserConfig.get('render_style'),
            paragraph = renderStyle == 'paragraph';

        // paragraph = this.app.UserConfig.get('paragraph');

        if(this.copyChanged) {
            this.copyChanged = false;
            this.app.debug && this.log('render_style prev', this.app.UserConfig.get('render_style'), this.app.UserConfig.get('read_render_style'), this.app.UserConfig.get('copy_render_style'));
            // var cacheSwap = this.renderStyleCache;

            // this.renderStyleCache = renderStyle;
            // this.app.UserConfig.set('render_style', cacheSwap);
            // renderStyle = cacheSwap;

            if(copy) {
                // this.app.UserConfig.set('read_render_style', renderStyle);
                renderStyle = this.app.UserConfig.get('copy_render_style');
            } else {
                // this.app.UserConfig.set('copy_render_style', renderStyle);
                renderStyle = this.app.UserConfig.get('read_render_style');
            }

            //this.log('render_style mid', this.app.UserConfig.get('render_style'), this.app.UserConfig.get('read_render_style'), this.app.UserConfig.get('copy_render_style'));

            this.app.UserConfig.set('render_style', renderStyle);

            // this.app.debug && this.log('render_style cur', this.app.UserConfig.get('render_style'), this.app.UserConfig.get('read_render_style'), this.app.UserConfig.get('copy_render_style'));

            // if(copy) {
            //     this.renderStyleCache = this.app.UserConfig.get('render_style');
            // } else {
            //     this.app.UserConfig.set('render_style', this.renderStyleCache);
            // }
        }

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
        this.view.set('renderStyle', renderStyle);

        this.app.debug && this.log('view renderStyle', renderStyle);

        if(this.navigationButtonsView) {
            this.view.set('navigationButtonsView', this.navigationButtonsView);
        }        

        if(this.pagerView) {
            this.view.set('pagerView', this.pagerView);
        }

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
        this.app.debug && this.log('renderStyle', prop, cur, pre);
        // this.view && this.view.set('_configChangeRender', true);
        
        if(prop == 'uc.copy') {
            this.copyChanged = true;
        }

        this.renderResults();
    },
    debugRenderStyle: function(pre, cur, prop) {
        this.app.debug && this.log(prop, cur, pre);
        this.app.set('_blockAutoScroll', true);
        // this.view && this.view.set('_configChangeRender', true);
    },
    watchCopyRenderable: function() {
        if(this.app.UserConfig.get('copy')) {
            this.renderResults();
        }
    },
    watchTextSize: function(pre, cur, prop) {
        this.applyViewTextSize();
    },    
    watchFont: function(pre, cur, prop) {
        this.applyViewFont();
    }
});
