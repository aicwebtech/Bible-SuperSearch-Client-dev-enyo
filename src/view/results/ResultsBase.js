var kind = require('enyo/kind');
var GridView = require('./GridView');
var Signal = require('../../components/Signal');
var Pager = require('../../components/Pagers/ClassicPager');
var LinkBuilder = require('../../components/Link/LinkBuilder');
var Nav = require('../../components/NavButtons/NavClassic');
var HoverDialog = require('../../components/dialogs/Hover');

module.exports = kind({
    name: 'ResultsBase',
    classes: 'results',
    bibles: [],
    multiBibles: false,
    bibleCount: 1,
    isParagraphView: false,  // Indicates if render is a parargraph view
    newLine: '<br />',
    hasPaging: false,
    paging: null,
    linkBuilder: LinkBuilder,
    selectedBible: null, // Bible we're currently processing
    lastHoverTarget: null,

    published: {
        resultsData: null,
        formData: null
    },

    handlers: {
        onFormResponseSuccess: 'handleFormResponse',
        onFormResponseError: 'handleFormError',
        onmouseover: 'handleHover'
    },

    components: [
        // {content: 'formatting buttons go here'},
        // {name: 'ResultsContainer'},
        {kind: Signal, onFormResponseSuccess: 'handleFormResponse', onFormResponseError: 'handleFormError', isChrome: true},
        {name: 'DialogsContainer', components: [
            {name: 'StrongsHover', kind: HoverDialog}
        ]}
    ],

    // observers: [
    //     // {method: 'watchRenderable', path: ['app.UserConfig.copy', 'app.UserConfig.paragraph']}
    //     {method: 'watchRenderable', path: ['app.UserConfig.copy']}
    // ],

    // // observers not working?  why?
    // bindings: [
    //     {from: 'app.UserConfig.copy', to: 'uc.copy', transform: function(value, dir) {
    //         console.log('the here');
    //         this.renderResults();
    //     }},
    //     {from: 'app.UserConfig.paragraph', to: 'uc.paragraph', transform: function(value, dir) {
    //         console.log('the par');
    //         this.renderResults();
    //     }}
    // ],

    create: function() {
        this.inherited(arguments);
        // this.formViewProcess(this.formView);
    },
    formDataChanged: function(was, is) {
        this.bibles = [];

        for(i in this.formData.bible) {
            var module = this.formData.bible[i];

            if(typeof this.app.statics.bibles[module] == 'undefined') {
                continue;
            }

            this.bibles.push(module);
        }

        // this.log(this.bibles);
        this.bibleCount = this.bibles.length;
        this.multiBibles = (this.bibleCount > 1) ? true : false;
    },
    resultsDataChanged: function(was, is) {
        this.hasPaging = false;
        this.paging = null;

        // if(is && is.paging && is.paging.last_page && is.paging.last_page > 1) {
        if(is && is.paging && is.paging.last_page) {
            this.hasPaging = true;
            this.paging = is.paging;
        }
    },
    renderResults: function() {
        this.destroyClientControls();

        var resultsData = this.get('resultsData'),
            formData = this.get('formData');

        if(!resultsData) {
            return;
        }

        if(!Array.isArray(resultsData.results)) {
            this.log('Error: results are not an array');
            return;
        }
        
        this.log('Rendering Results!');
        this.renderPager(true);
        this.renderHeader();

        resultsData.results.forEach(function(passage) {
            this.renderPassage(passage);
        }, this);

        this.renderFooter();
        this.renderPager(false);
        // this.$.ResultsContainer.render();
        this.render();
    },
    renderPassage: function(passage) {        
        if(passage.single_verse && this.multiBibles) {
            this.renderSingleVerseParallelBible(passage);
        }
        else if(passage.single_verse && !this.multiBibles) {
            this.renderSingleVerseSingleBible(passage);
        }
        else if(!passage.single_verse && !this.multiBibles) {
            this.renderPassageSingleBible(passage);
        }
        else {
            this.renderPassageParallelBible(passage);
        }
    },

    renderSingleVerseSingleBible: function(passage) {},     // Must implement on child kind!
    renderSingleVerseParallelBible: function(passage) {},   // Must implement on child kind!
    renderPassageParallelBible: function(passage) {},       // Must implement on child kind!
    renderPassageSingleBible: function(passage) {},         // Must implement on child kind!

    renderHeader: function() {}, // Called before results are rendered, not required
    renderFooter: function() {}, // Called after results are rendered, not required
    
    processText: function(verse) {
        return verse.text;
    },
    processPassageReference: function(passage) {

    },
    processVerseReference: function(verse) {
        // Is this needed??
    },
    processVerseVerse: function(verse) {
        return verse.verse;
    },
    processSingleVerseContent: function(passage, verse) {
        // passage.book_name + ' ' + passage.chapter_verse + '  ' + verse.text;
        var ref = this.proccessSingleVerseReference(passage, verse);
        return this.processAssembleSingleVerse(ref, verse);
    },
    proccessSingleVerseReference: function(passage, verse) {
        var book = this.app.getBook(passage.book_id);
        return book.name + ' ' + verse.chapter + ':' + verse.verse;
    },    
    processPassageVerseContent: function(passage, verse) {
        var ref = this.proccessPassageVerseReference(passage, verse);
        return this.processAssemblePassageVerse(ref, verse);
    },
    proccessPassageVerseReference: function(passage, verse) {
        return verse.verse;
    },
    processAssembleSingleVerse: function(reference, verse) {
        return this.processAssembleVerse(reference, verse);
    },
    processAssemblePassageVerse: function(reference, verse) {
        return this.processAssembleVerse(reference, verse);
    },
    processAssembleVerse: function(reference, verse) {
        return reference + ' ' + this.processText(verse.text);
    },
    // Adds highlighting / strongs / italics / red letter when nessessary
    processText: function(text) {
        // strongs
        text = text.replace(/\{/g, "<sup class='strongs'>");
        text = text.replace(/\}/g, "</sup>");

        return text;
    },
    isNewParagraph: function(verse) {
        if(!this.isParagraphView) {
            return false;
        }

        if(verse.italics && verse.italics.indexOf('#') === 0) {
            return true; // Ugly 3.0 format, should be changed in 4.0
        }

        return false;
    },
    _createContainer: function() {
        return this.createComponent({
            tag: 'table',
            // attributes:{border: 1},
            classes: 'biblesupersearch_render_table'
        });
    },

    watchRenderable: function(pre, cur, prop) {
        this.log(pre, cur, prop);
        this.renderResults();
    },
    watchFormatable: function(pre, cur, prop) {

    },
    renderPager: function(includeTotals) {
        if(!this.hasPaging) {
            return;
        }

        includeTotals = includeTotals || false;

        this.createComponent({
            kind: Pager,
            currentPage: this.paging.current_page,
            lastPage: this.paging.last_page,
            perPage: this.paging.per_page,
            totalResults: this.paging.total,
            cacheHash: this.resultsData.hash,
            includeTotals: includeTotals
        });
    },
    selectBible: function(module) {
        this.selectedBible = (typeof this.app.statics.bibles[module] == 'undefined') ? null : this.app.statics.bibles[module];
        return this.selectedBible;
    },
    handleHover: function(inSender, inEvent) {
        var target = inEvent.target;

        if(target != this.lastHoverTarget) {
            this.$.StrongsHover.set('showing', false);
            this.lastHoverTarget = target;
            // this.log('inSender', inSender);

            var top  = inEvent.y; //inEvent.screenY + inEvent.offsetY;
            var left = inEvent.x; //inEvent.screenX + inEvent.offsetX;

            // this.log(inEvent.target);

            if(target.tagName == 'SUP' && target.className == 'strongs') {
                this.log('inEvent', inEvent);
                // this.log('SUPP', target.innerHTML);
                this.$.StrongsHover.displayPosition(top, left, target.innerHTML);
            }

        }
    }

});
