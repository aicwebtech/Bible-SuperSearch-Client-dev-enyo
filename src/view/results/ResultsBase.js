var kind = require('enyo/kind');
var GridView = require('./GridView');
var Signal = require('../../components/Signal');

module.exports = kind({
    name: 'ResultsBase',
    classes: '',

    published: {
        resultsData: null,
        formData: null
    },

    handlers: {
        onFormResponseSuccess: 'handleFormResponse',
        onFormResponseError: 'handleFormError'
    },

    components: [
        {content: 'formatting buttons go here'},
        {name: 'ResultsContainer'},
        {kind: Signal, onFormResponseSuccess: 'handleFormResponse', onFormResponseError: 'handleFormError'}
    ],

    create: function() {
        this.inherited(arguments);
        // this.formViewProcess(this.formView);
    },
    formDataChanged: function(was, is) {

    },
    resultsDataChanged: function(was, is) {

    },
    renderResults: function() {
        this.log(inEvent);
        //return;
        this.$.ResultsContainer.destroyComponents();
        //this.log(results);
        this.renderHeader();

        is.forEach(function(passage) {
            this.$.ResultsContainer.createComponent({
                kind: GridView,
                passageData: passage,
                bibleCount: 1,
                formData: inEvent.formData,
            });
        }, this);

        this.renderFooter();
        //this.$.ResultsContainer.setShowing(true);
        this.$.ResultsContainer.render();
    },
    renderPassage: function(passage) {

    },

    renderHeader: function() {

    },
    renderFooter: function() {

    },
    processText: function(verse) {
        return verse.text;
    },
    processPassageReference: function(passage) {

    },
    processVerseReference: function(verse) {

    },
    processVerseVerse: function(verse) {
        return verse.verse;
    }
});
