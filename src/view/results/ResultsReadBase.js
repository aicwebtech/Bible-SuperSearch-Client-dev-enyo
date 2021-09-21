var kind = require('enyo/kind');
var ResultsBase = require('./ResultsBase');

module.exports = kind({
    name: 'ResultsReadBase',
    kind: ResultsBase,
    blankSingleVerse: '<td></td>',
    blankPassageVerse: '<td></td>',
    passageColumnsPerBible: 1,
    singleVerseCount: 0,
    singleVerseBibleHeaderThreshold: 10,
    singleVerseBibleHeaderNext: true,

    // NOTA Single verse, single Bible
    renderSingleVerseSingleBible: function(pd) {
        // this.log();
        this.renderSingleVerseParallelBible(pd);
    },
    // Single verse, multi Bible
    renderSingleVerseParallelBible: function(pd) {
        // this.log();
        var Container = this._createContainer();
        var addBibleHeader = false;

        if(this.multiBibles && (this.singleVerseBibleHeaderNext || this.singleVerseCount >= this.singleVerseBibleHeaderThreshold)) {
            addBibleHeader = true;
            this.singleVerseBibleHeaderNext = false;
            this.singleVerseCount = 0;
        }

        // Container.createComponent({
        //     name: 'ReferenceRow',
        //     tag: 'tr'
        // });

        if(addBibleHeader) {        
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
        this.singleVerseCount ++;

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
                        classes: (this.selectedBible.rtl) ? 'rtl' : 'ltr'
                    });
                }
            }, this);
        }

        if(haveText) {            
            for(i in this.bibles) {
                var module = this.bibles[i];

                if(typeof this.app.statics.bibles[module] == 'undefined') {
                    continue;
                }

                var bible_info = this.app.statics.bibles[module];
                
                // Container.$.ReferenceRow.createComponent({
                //     tag: 'th',
                //     content: pd.book_name + ' ' + pd.chapter_verse
                // });

                if(addBibleHeader) {                
                    Container.$.BibleRow.createComponent({
                        tag: 'th',
                        content: this._getBibleDisplayName(bible_info)
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
        // this.singleVerseCount = 0;
        // this.singleVerseBibleHeaderNext = true;

        var addBibleHeader = false;

        if(this.multiBibles && (this.singleVerseBibleHeaderNext || this.singleVerseCount >= this.singleVerseBibleHeaderThreshold)) {
            addBibleHeader = true;
            this.singleVerseBibleHeaderNext = false;
            this.singleVerseCount = 0;
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
 
        this._addNavButtons(Container, pd);

        if(addBibleHeader) {            
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
                    content: this._getBibleDisplayName(bible_info)
                });
            }
        }

        for(chapter in pd.verse_index) {
            pd.verse_index[chapter].forEach(function(verse) {
                var html = '';
                this.singleVerseCount ++;

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

        // var Row = Container.createComponent({
        //     name: 'BibleCopyrightRow',
        //     tag: 'tr'
        // });

        // this._renderCopyRightBottomHelper(Row);
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
        // return reference + '<br />' + this.processText(verse.text) + verse.linksHtml;
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
        var verseLink = this.linkBuilder.buildReferenceLink('p', this.formData.bible, passage.book_name, verse.chapter, verse.verse);
        var chapterLink = this.linkBuilder.buildReferenceLink('p', this.formData.bible, passage.book_name, verse.chapter);
        var contextLink = this.linkBuilder.buildReferenceLink('context', this.formData.bible, passage.book_name, verse.chapter, verse.verse);

        var html =  '<a href="' + chapterLink + '" title="Show this Chapter" class="std_link">' + passage.book_name + ' ' + verse.chapter + '</a>:';
            html += '<a href="' + contextLink + '" title="Show in Context" class="std_link">' + verse.verse + '</a>';

        // return html; 

        // verse.linksHtml = '<br /><small>'; // future use?

        var chapterTitle = this.app.t("Show full chapter"),
            chapterText = this.app.t('Chapter'),
            verseTitle = this.app.t('Show this verse'),
            contextTitle = this.app.t('Show in context'),
            contextText = this.app.t('Context');

        var html = '';
            html += '<a href="' + verseLink + '" title="' + verseTitle + '" class="std_link">' + passage.book_name + ' ' + verse.chapter + ':' + verse.verse + '</a>';
            html += '&nbsp; <sup>' + '<a href="' + contextLink + '" title="' + contextTitle + '" class="std_link">' + contextText + '</a></sup>';           
            html += '&nbsp; <sup>' + '<a href="' + chapterLink + '" title="' + chapterTitle + '" class="std_link">' + chapterText + '</a></sup>';
            // verse.linksHtml += '<a href="' + chapterLink + '" title="' + chapterTitle + '" class="std_link">' + chapterText + '</a>&nbsp; &nbsp;';
            // verse.linksHtml += '<a href="' + contextLink + '" title="' + contextTitle + '" class="std_link">' + contextText + '</a>';
            // future? 
            // html += '&nbsp;&nbsp;<sup>' + '<a href="' + contextLink + '" title="' + contextTitle + '" class="std_link">' + 'Statistics' + '</a></sup>';

        // verse.linksHtml += '</small>';

        return html;
    },   
    _processSingleVerseLinks: function(passage, verse) {

    },
    _addNavButtons: function(Container, passage) {
        if(typeof passage.nav == 'object') {
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
