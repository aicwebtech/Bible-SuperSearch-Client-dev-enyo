var kind = require('enyo/kind');
var ResultsBase = require('./ResultsBase');

module.exports = kind({
    name: 'ResultsReadBase',
    kind: ResultsBase,

    // Single verse, single Bible
    renderSingleVerseSingleBible: function(pd) {
        this.log();
        var Container = this._createContainer();

        Container.createComponent({
            name: 'VerseRow',
            tag: 'tr'
        });

        for(chapter in pd.verse_index) {
            pd.verse_index[chapter].forEach(function(verse) {
                for(i in this.bibles) {
                    var module = this.bibles[i];
                    var content = '';

                    if(pd.verses[module] && pd.verses[module][chapter] && pd.verses[module][chapter][verse]) {
                        var content = pd.book_name + ' ' + pd.chapter_verse + ' &nbsp;' + pd.verses[module][chapter][verse].text;
                    }

                    Container.$.VerseRow.createComponent({
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
    renderSingleVerseParallelBible: function(pd) {
        this.log();
        var Container = this._createContainer();

        Container.createComponent({
            name: 'ReferenceRow',
            tag: 'tr'
        });

        Container.createComponent({
            name: 'BibleRow',
            tag: 'tr'
        });

        Container.createComponent({
            name: 'VerseRow',
            tag: 'tr'
        });

        var haveText = false;

        for(chapter in pd.verse_index) {
            pd.verse_index[chapter].forEach(function(verse) {
                for(i in this.bibles) {
                    var module = this.bibles[i];
                    var content = '';

                    if(pd.verses[module] && pd.verses[module][chapter]) {
                        var content = pd.verses[module][chapter][verse].text || '';
                        haveText = (content != '') ? true : haveText;
                    }

                    Container.$.VerseRow.createComponent({
                        tag: 'td',
                        content: content,
                        attributes: {valign: 'top'},
                        allowHtml: true
                    });
                }
            }, this);
        }

        if(haveText) {            
            for(i in this.bibles) {
                var module = this.bibles[i];
                var bible_info = this.app.statics.bibles[module];
                
                Container.$.ReferenceRow.createComponent({
                    tag: 'th',
                    content: pd.book_name + ' ' + pd.chapter_verse
                });

                Container.$.BibleRow.createComponent({
                    tag: 'th',
                    content: bible_info.name
                });
            }
        }

    },
    // Multi verse, single Bible
    renderPassageSingleBible: function(pd) {
        this.log();
        var Container = this._createContainer();

        Container.createComponent({
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

                for(i in this.bibles) {
                    var module = this.bibles[i];
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

                Container.createComponent({
                    tag: 'tr',
                    components: components
                });
            }, this);
        }
    },
    // Multi verse, single Bible
    renderPassageParallelBible: function(pd) {
        this.log();
        var Container = this._createContainer();

        Container.createComponent({
            name: 'ReferenceRow',
            tag: 'tr',
            components: [
                {tag: 'th', attributes: {colspan: this.bibleCount}, content: pd.book_name + ' ' + pd.chapter_verse}
            ]
        });

        Container.createComponent({
            name: 'BibleRow',
            tag: 'tr'
        });


        for(i in this.bibles) {
            var module = this.bibles[i];
            // var bible_info = AICWS.BibleSuperSearch.Bibles[module];

            if(typeof this.app.statics.bibles[module] == 'undefined') {
                continue;
            }
            
            var bible_info = this.app.statics.bibles[module];
            this.log(this.app.statics.bibles);

            Container.$.BibleRow.createComponent({
                tag: 'th',
                content: bible_info.name
            });
        }

        for(chapter in pd.verse_index) {
            pd.verse_index[chapter].forEach(function(verse) {
                var components = [];

                for(i in this.bibles) {
                    var module = this.bibles[i];
                    var content = '';

                    if(typeof this.app.statics.bibles[module] == 'undefined') {
                        continue;
                    }

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

                Container.createComponent({
                    tag: 'tr',
                    components: components
                });
            }, this);
        }
    }
});
