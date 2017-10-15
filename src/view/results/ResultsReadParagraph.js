var kind = require('enyo/kind');
var ResultsBase = require('./ResultsReadBase');

module.exports = kind({
    name: 'ResultsReadParagraph',
    kind: ResultsBase,
    isParagraphView: true,
    blankPassageVerse: '',
    passageColumnsPerBible: 1,

    processAssembleVerse: function(reference, verse) {
        return '<td>' + reference + '</td><td>' + this.processText(verse.text) + '</td>';
    },
    processAssembleVerse: function(reference, verse) {
        return reference + '  ' + this.processText(verse.text);
    },
    processAssemblePassageVerse: function(reference, verse) {
        var processed = '<sup>' + reference + '</sup>' + this.processText(verse.text) + '  ';

        if(this.isNewParagraph(verse)) {
            processed = this.newLine + this.newLine + processed;
        }

        return processed;
    },

    // Multi verse, multi Bible
    renderPassageParallelBible: function(pd) {
        this.log();
        var Container = this._createContainer();
        var bibleHtml = [];

        for(i in this.bibles) {
            bibleHtml[i] = '';
        }

        Container.createComponent({
            name: 'ReferenceRow',
            tag: 'tr',
            components: [
                {
                    tag: 'th', 
                    attributes: {colspan: this.bibleCount * this.passageColumnsPerBible}, 
                    content: pd.book_name + ' ' + pd.chapter_verse
                }
            ]
        });

        if(this.multiBibles) {        
            Container.createComponent({
                name: 'BibleRow',
                tag: 'tr'
            });

            for(i in this.bibles) {
                var module = this.bibles[i];

                if(typeof this.app.statics.bibles[module] == 'undefined') {
                    continue;
                }
                
                var bible_info = this.app.statics.bibles[module];

                Container.$.BibleRow.createComponent({
                    tag: 'th',
                    attributes: {colspan: this.passageColumnsPerBible},
                    content: bible_info.name
                });
            }
        }

        for(chapter in pd.verse_index) {
            // this.log(pd.verse_index[chapter]);

            pd.verse_index[chapter].forEach(function(verse) {
                for(i in this.bibles) {
                    var module = this.bibles[i];
                    var content = '';

                    if(pd.verses[module][chapter][verse]) {
                        var processed = this.processPassageVerseContent(pd, pd.verses[module][chapter][verse]);
                        bibleHtml[i] += processed;
                    }
                }

            }, this);
        }

        var html = '<td class=\'txt\'>' + bibleHtml.join('</td><td class=\'txt\'>') + '</td>';

        Container.createComponent({
            tag: 'tr',
            content: html,
            allowHtml: true
        });
    },
    // Multi verse, single Bible
    renderPassageSingleBible: function(pd) {
        this.log();
        this.renderPassageParallelBible(pd);
    }
});
