var kind = require('enyo/kind');
var ResultsBase = require('./ResultsBase');

module.exports = kind({
    name: 'ResultsReadBase',
    kind: ResultsBase,
    blankSingleVerse: '<td></td>',
    blankPassageVerse: '<td></td>',
    passageColumnsPerBible: 1,

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
                        // var content = pd.book_name + ' ' + pd.chapter_verse + ' &nbsp;' + pd.verses[module][chapter][verse].text;
                        var content = this.processSingleVerseContent(pd, pd.verses[module][chapter][verse]);
                    }
                    else {

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

                    if(pd.verses[module] && pd.verses[module][chapter] && pd.verses[module][chapter][verse]) {
                        content = pd.verses[module][chapter][verse].text || '';
                        haveText = (content != '') ? true : haveText;
                        content = this.processSingleVerseContent(pd, pd.verses[module][chapter][verse]);
                    }
                    else {

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
                {tag: 'th', content: pd.book_name + ' ' + pd.chapter_verse, attributes: {colspan: this.passageColumnsPerBible}}
            ]
        });

        for(chapter in pd.verse_index) {
            // this.log(pd.verse_index[chapter]);

            pd.verse_index[chapter].forEach(function(verse) {
                // var components = [];
                var html = '';

                for(i in this.bibles) {
                    var module = this.bibles[i];
                    var content = '';

                    if(pd.verses[module][chapter][verse]) {
                        // var content = verse + '. ' + pd.verses[module][chapter][verse].text;
                        var processed = this.processPassageVerseContent(pd, pd.verses[module][chapter][verse]);
                        html += processed;
                    }
                    else {
                        html += this.blankPassageVerse;
                    }

                    /*
                    components.push({
                        tag: 'td',
                        content: content,
                        attributes: {valign: 'top'},
                        allowHtml: true
                    });
                    */
                }

                Container.createComponent({
                    tag: 'tr',
                    // components: components,
                    content: html,
                    allowHtml: true
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
                {
                    tag: 'th', 
                    attributes: {colspan: this.bibleCount * this.passageColumnsPerBible}, 
                    content: pd.book_name + ' ' + pd.chapter_verse
                }
            ]
        });

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

        for(chapter in pd.verse_index) {
            pd.verse_index[chapter].forEach(function(verse) {
                var components = [];
                var html = '';

                for(i in this.bibles) {
                    var module = this.bibles[i];
                    var content = '';

                    if(typeof this.app.statics.bibles[module] == 'undefined') {
                        continue;
                    }

                    if(pd.verses[module] && pd.verses[module][chapter] && pd.verses[module][chapter][verse]) {
                        // var content = verse + '. ' + pd.verses[module][chapter][verse].text;
                        var processed = this.processPassageVerseContent(pd, pd.verses[module][chapter][verse]);
                        html += processed;
                    }
                    else {
                        html += this.blankPassageVerse;
                    }

                    /*
                    components.push({
                        tag: 'td',
                        content: content,
                        attributes: {valign: 'top'},
                        allowHtml: true
                    });
                    */
                }

                Container.createComponent({
                    tag: 'tr',
                    // components: components,
                    allowHtml: true,
                    content: html
                });
            }, this);
        }
    },
    processAssembleVerse: function(reference, verse) {
        return reference + '  ' + this.processText(verse.text);
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
});
