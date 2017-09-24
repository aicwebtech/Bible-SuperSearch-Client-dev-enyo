var kind = require('enyo/kind');
var GridView = require('./GridView');
var Signal = require('../../components/Signal');

module.exports = kind({
    name: 'Results',
    classes: 'biblesupersearch_content',

    published: {
        formView: null
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
    handleFormResponse: function(inSender, inEvent) {
        this.log(inEvent);
        //return;
        this.$.ResultsContainer.destroyComponents();
        //this.log(results);

        if(inEvent.results.error_level == 4) {
            alert(inEvent.results.errors.join('<br><br>'));
            return;
        }

        inEvent.results.forEach(function(passage) {
            this.$.ResultsContainer.createComponent({
                kind: GridView,
                passageData: passage,
                bibleCount: 1,
                formData: inEvent.formData,
            });
        }, this);

        //this.$.ResultsContainer.setShowing(true);
        //this.$.Errors.setShowing(false);
        this.$.ResultsContainer.render();


/*        this.$.ResultsContainer.set('formData', inEvent.formData);
        this.$.ResultsContainer.set('passageData', inEvent.results);
        this.$.ResultsContainer.renderResults();*/
    },
    handleFormError: function(inSender, inEvent) {

    }
});
