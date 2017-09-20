// This renders individual passages
var kind = require('enyo/kind');

module.exports = kind({
    name: 'ResultsView',
    passageData: {},
    formData: {},
    bibleCount: 0,
    tag: 'table',

    components: [
        {
            name: 'Container', 
            tag: 'tbody'
            //style: 'margin-bottom: 200px', 
            //classes: 'biblesupersearch_results'
        }, 
        {
            //tag: 'br',
            style: 'height: 15px'
        }
    ],

    //renderResults: function() {
    create: function() {
        this.inherited(arguments);
        // this.log(this.formData);
        if(!Array.isArray(this.formData.bible)) {
            this.formData.bible = JSON.parse(this.formData.bible);
        }
        
        this.bibleCount = this.formData.bible.length;
        //this.log(this.passageData);
        //this.log(this.formData);
        this.$.Container.destroyClientControls();
        var pd = this.passageData;
        // this.log(pd.book_name + ' ' + pd.chapter_verse);
        //this.bibleCount = Object.keys(pd.verses).length;
        var multiBibles = (this.bibleCount > 1) ? true : false;
        //this.log('par', multiBibles);

        if(pd.single_verse && multiBibles) {
            this.createSingleParallel();
        }
        else if(pd.single_verse && !multiBibles) {
            this.createSingleSingle();
        }
        else if(!pd.single_verse && !multiBibles) {
            this.createPassageSingle();
        }
        else {
            this.createPassageParallel();
        }

        this.render();
    },
    // Single verse, single Bible
    createSingleSingle: function() {
        var pd = this.passageData;
        this.$.Container.createComponent({
            name: 'VerseRow',
            tag: 'tr'
        });

        for(chapter in pd.verse_index) {
            pd.verse_index[chapter].forEach(function(verse) {
                //for(module in pd.verses) {
                for(i in this.formData.bible) {
                    var module = this.formData.bible[i];
                    var content = '';

                    if(pd.verses[module] && pd.verses[module][chapter] && pd.verses[module][chapter][verse]) {
                        var content = pd.book_name + ' ' + pd.chapter_verse + ' &nbsp;' + pd.verses[module][chapter][verse].text;
                    }

                    this.$.Container.$.VerseRow.createComponent({
                        tag: 'td',
                        content: content,
                        attributes: {valign: 'top'},
                        allowHtml: true
                    });
                }
            }, this);
        }
    },
    // Single verse, multi Bible
    createSingleParallel: function() {
        this.log();

        this.$.Container.createComponent({
            name: 'ReferenceRow',
            tag: 'tr'
        });

        this.$.Container.createComponent({
            name: 'BibleRow',
            tag: 'tr'
        });

        this.$.Container.createComponent({
            name: 'VerseRow',
            tag: 'tr'
        });

        var pd = this.passageData
            haveText = false;

        for(chapter in pd.verse_index) {
            pd.verse_index[chapter].forEach(function(verse) {
                for(i in this.formData.bible) {
                    var module = this.formData.bible[i];
                    var content = '';

                    if(pd.verses[module] && pd.verses[module][chapter]) {
                        var content = pd.verses[module][chapter][verse].text || '';
                        haveText = (content != '') ? true : haveText;
                    }

                    this.$.Container.$.VerseRow.createComponent({
                        tag: 'td',
                        content: content,
                        attributes: {valign: 'top'},
                        allowHtml: true
                    });
                }
            }, this);
        }

        if(haveText) {            
            for(i in this.formData.bible) {
                var module = this.formData.bible[i];
                // var bible_info = AICWS.BibleSuperSearch.Bibles[module];
                var bible_info = this.app.statics.bibles[module];
                
                this.$.Container.$.ReferenceRow.createComponent({
                    tag: 'th',
                    content: pd.book_name + ' ' + pd.chapter_verse
                });

                this.$.Container.$.BibleRow.createComponent({
                    tag: 'th',
                    content: bible_info.name
                });
            }
        }

    },
    // Multi verse, single Bible
    createPassageSingle: function() {
        this.log();
        var pd = this.passageData;

        this.$.Container.createComponent({
            name: 'ReferenceRow',
            tag: 'tr',
            components: [
                {tag: 'th', content: pd.book_name + ' ' + pd.chapter_verse}
            ]
        });

        for(chapter in pd.verse_index) {
            this.log(pd.verse_index[chapter]);

            pd.verse_index[chapter].forEach(function(verse) {
                var components = [];

                for(i in this.formData.bible) {
                    var module = this.formData.bible[i];
                    var content = '';

                    if(pd.verses[module][chapter][verse]) {
                        var content = verse + '. ' + pd.verses[module][chapter][verse].text;
                    }

                    components.push({
                        tag: 'td',
                        content: content,
                        attributes: {valign: 'top'},
                        allowHtml: true
                    });
                }

                this.$.Container.createComponent({
                    tag: 'tr',
                    components: components
                });
            }, this);
        }
    },
    // Multi verse, single Bible
    createPassageParallel: function() {
        this.log();
        var pd = this.passageData;

        this.$.Container.createComponent({
            name: 'ReferenceRow',
            tag: 'tr',
            components: [
                {tag: 'th', attributes: {colspan: this.bibleCount}, content: pd.book_name + ' ' + pd.chapter_verse}
            ]
        });

        this.$.Container.createComponent({
            name: 'BibleRow',
            tag: 'tr'
        });


        for(i in this.formData.bible) {
            var module = this.formData.bible[i];
            // var bible_info = AICWS.BibleSuperSearch.Bibles[module];
            var bible_info = this.app.statics.bibles[module];
            this.log(this.app.statics.bibles);

            this.$.Container.$.BibleRow.createComponent({
                tag: 'th',
                content: bible_info.name
            });
        }

        for(chapter in pd.verse_index) {
            pd.verse_index[chapter].forEach(function(verse) {
                var components = [];

                for(i in this.formData.bible) {
                    var module = this.formData.bible[i];
                    var content = '';

                    if(pd.verses[module] && pd.verses[module][chapter] && pd.verses[module][chapter][verse]) {
                        var content = verse + '. ' + pd.verses[module][chapter][verse].text;
                    }

                    components.push({
                        tag: 'td',
                        content: content,
                        attributes: {valign: 'top'},
                        allowHtml: true
                    });
                }

                this.$.Container.createComponent({
                    tag: 'tr',
                    components: components
                });
            }, this);
        }
    }
});
