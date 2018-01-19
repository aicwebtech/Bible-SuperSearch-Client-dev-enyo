var kind = require('enyo/kind');
var ResultsBase = require('./ResultsBase');

module.exports = kind({
    name: 'ResultsReadBase',
    kind: ResultsBase,
    blankSingleVerse: '<td></td>',
    blankPassageVerse: '<td></td>',
    passageColumnsPerBible: 1,

    // NOTA Single verse, single Bible
    renderSingleVerseSingleBible: function(pd) {
        // this.log();
        this.renderSingleVerseParallelBible(pd);
    },
    // Single verse, multi Bible
    renderSingleVerseParallelBible: function(pd) {
        // this.log();
        var Container = this._createContainer();

        // Container.createComponent({
        //     name: 'ReferenceRow',
        //     tag: 'tr'
        // });

        if(this.multiBibles) {        
            Container.createComponent({
                name: 'BibleRow',
                tag: 'tr'
            });
        }

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
                    var bible_info = this.selectBible(module);

                    if(!bible_info) {
                        continue;
                    }

                    if(pd.verses[module] && pd.verses[module][chapter] && pd.verses[module][chapter][verse]) {
                        content = pd.verses[module][chapter][verse].text || '';
                        haveText = (content != '') ? true : haveText;
                        content = this.processSingleVerseContent(pd, pd.verses[module][chapter][verse]);
                    }

                    Container.$.VerseRow.createComponent({
                        tag: 'td',
                        content: content,
                        attributes: {valign: 'top'},
                        allowHtml: true,
                        classes: (this.selectedBible.rtl) ? 'rtl' : null
                    });
                }
            }, this);
        }

        if(haveText) {            
            for(i in this.bibles) {
                var module = this.bibles[i];
                var bible_info = this.app.statics.bibles[module];
                
                // Container.$.ReferenceRow.createComponent({
                //     tag: 'th',
                //     content: pd.book_name + ' ' + pd.chapter_verse
                // });

                if(this.multiBibles) {                
                    Container.$.BibleRow.createComponent({
                        tag: 'th',
                        content: bible_info.name
                    });
                }
            }
        }

    },
    // NOTA Multi verse, single Bible
    renderPassageSingleBible: function(pd) {
        // this.log();
        this.renderPassageParallelBible(pd);
    },
    // Multi verse, single Bible
    renderPassageParallelBible: function(pd) {
        // this.log();
        var Container = this._createContainer();

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

        this._addNavButtons(Container, pd);

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
            pd.verse_index[chapter].forEach(function(verse) {
                var html = '';

                for(i in this.bibles) {
                    var module = this.bibles[i];
                    var content = '';
                    var bible_info = this.selectBible(module);

                    if(!bible_info) {
                        continue;
                    }

                    if(pd.verses[module] && pd.verses[module][chapter] && pd.verses[module][chapter][verse]) {
                        var processed = this.processPassageVerseContent(pd, pd.verses[module][chapter][verse]);
                        html += processed;
                    }
                    else {
                        html += this.blankPassageVerse;
                    }
                }

                Container.createComponent({
                    tag: 'tr',
                    allowHtml: true,
                    content: html
                });
            }, this);
        }

        this._addNavButtons(Container, pd);
    },
    processAssembleVerse: function(reference, verse) {
        if(this.selectedBible.rtl) {
            return this.processText(verse.text) + ' ' + reference;
        }
        else {
            return reference + '  ' + this.processText(verse.text);
        }
    },
    processAssembleSingleVerse: function(reference, verse) {
        return reference + '<br />' + this.processText(verse.text);
    },
    processAssemblePassageVerse: function(reference, verse) {
        var processed = this.processAssembleVerse(reference, verse);

        if(this.isParagraphView) {
            processed += '  ';

            if(this.isNewParagraph(verse)) {
                processed = this.newLine + this.newLine + processed;
            }
        }
        else {
            processed += this.newLine;
        }

        return processed;
    },
    proccessSingleVerseReference: function(passage, verse) {
        var book = this.app.getBook(passage.book_id);
        var chapterLink = this.linkBuilder.buildReferenceLink('p', this.formData.bible, book.name, verse.chapter);
        var contextLink = this.linkBuilder.buildReferenceLink('context', this.formData.bible, book.name, verse.chapter, verse.verse);
        return '<a href="' + chapterLink + '" title="Show this Chapter">' + book.name + ' ' + verse.chapter + '</a>:<a href="' + contextLink + '" title="Show in Context">' + verse.verse + '</a>';
    },   
    _addNavButtons: function(Container, passage) {
        if(typeof passage.nav == 'object') {
            // Todo - add browsing buttons!
            var NavButtons = this.app.getSubControl('NavButtons');

            if(NavButtons) {
                Container.createComponent({
                    tag: 'tr', 
                    components: [
                        {tag: 'td', attributes: {colspan: this.bibleCount * this.passageColumnsPerBible}, 
                        components: [
                            { nav: passage.nav, kind: NavButtons, bibles: this.bibles }
                        ]}
                    ]
                });
            }
        }
    }
});
