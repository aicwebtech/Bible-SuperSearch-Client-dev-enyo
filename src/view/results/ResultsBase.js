var kind = require('enyo/kind');
var GridView = require('./GridView');
var Signal = require('../../components/Signal');

module.exports = kind({
    name: 'ResultsBase',
    classes: '',
    bibles: [],
    multiBibles: false,
    bibleCount: 1,

    published: {
        resultsData: null,
        formData: null
    },

    handlers: {
        onFormResponseSuccess: 'handleFormResponse',
        onFormResponseError: 'handleFormError'
    },

    components: [
        // {content: 'formatting buttons go here'},
        // {name: 'ResultsContainer'},
        {kind: Signal, onFormResponseSuccess: 'handleFormResponse', onFormResponseError: 'handleFormError', isChrome: true}
    ],

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

    },
    renderResults: function() {
        // this.$.ResultsContainer.destroyComponents();
        this.destroyClientControls();
        //this.log(results);
        this.renderHeader();

        var resultsData = this.get('resultsData'),
            formData = this.get('formData');

        if(!Array.isArray(resultsData)) {
            this.log('Error: results are not an array');
            return;
        }

        resultsData.forEach(function(passage) {
            this.renderPassage(passage);
        }, this);

        this.renderFooter();
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

    renderSingleVerseSingleBible: function(passage) {},     // Must implement on child kind
    renderSingleVerseParallelBible: function(passage) {},   // Must implement on child kind
    renderPassageParallelBible: function(passage) {},       // Must implement on child kind
    renderPassageSingleBible: function(passage) {},        // Must implement on child kind

    renderHeader: function() {}, // Called before results are rendered, not required
    renderFooter: function() {}, // Called after results are rendered, not required
    
    processText: function(verse) {
        return verse.text;
    },
    processPassageReference: function(passage) {

    },
    processVerseReference: function(verse) {

    },
    processVerseVerse: function(verse) {
        return verse.verse;
    },
    _createContainer: function() {
        return this.createComponent({
            tag: 'table',
            classes: 'biblesupersearch_render_table'
        });
    }
});
