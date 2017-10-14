var kind = require('enyo/kind');
var ResultsBase = require('./ResultsBase');
var CopyPane = require('./CopyPane');

module.exports = kind({
    name: 'ResultsCopyBase',
    kind: ResultsBase,
    container: null,
    newLine: '\n',

    renderHeader: function() {
        this.container = this._createContainer();
        var headerComponents = [];
        var copyComponents = [];

        for(i in this.bibles) {
            var module = this.bibles[i];
            var bible_info = this.app.statics.bibles[module];
            var name = this._getBibleComponentName(i);

            headerComponents.push({
                tag: 'th',
                content: bible_info.name
            });

            copyComponents.push({
                kind: CopyPane,
                owner: this.container,
                name: name
            });
        }

        this.container.createComponent({tag: 'tr', components: headerComponents});
        this.container.createComponent({tag: 'tr', components: copyComponents});
    },
    renderFooter: function() {

    },
    renderSingleVerseSingleBible: function(passage) {
        this.log();
        this.renderSingleVerseParallelBible(passage);
    },    
    renderSingleVerseParallelBible: function(passage) {
        this.log();

        for(chapter in passage.verse_index) {
            passage.verse_index[chapter].forEach(function(verse) {
                for(i in this.bibles) {
                    var module = this.bibles[i];
                    var content = '';

                    if(passage.verses[module] && passage.verses[module][chapter] && passage.verses[module][chapter][verse]) {
                        var content  = this.processSingleVerseContent(passage, passage.verses[module][chapter][verse]);
                        // var content = passage.book_name + ' ' + passage.chapter_verse + '  ' + passage.verses[module][chapter][verse].text + this.newLine + this.newLine;
                        this._appendBibleComponent(content, i);
                    }
                }
            }, this);
        }
    },
    renderPassageParallelBible: function(passage) {
        this.log();
        
        for(i in this.bibles) {
            this._appendBibleComponent(passage.book_name + ' ' + passage.chapter_verse + this.newLine + this.newLine, i);
        }

        for(chapter in passage.verse_index) {
            passage.verse_index[chapter].forEach(function(verse) {
                var components = [];

                for(i in this.bibles) {
                    var bible_info = this.app.statics.bibles[module];
                    var module = this.bibles[i];
                    var content = '';

                    if(passage.verses[module] && passage.verses[module][chapter] && passage.verses[module][chapter][verse]) {
                        var content = this.processPassageVerseContent(passage, passage.verses[module][chapter][verse]);
                        // var content = verse + '. ' + passage.verses[module][chapter][verse].text + this.newLine;
                        this._appendBibleComponent(content, i);
                    }
                }
            }, this);
        }

        for(i in this.bibles) {
            this._appendBibleComponent(this.newLine, i);
        }
    },    
    renderPassageSingleBible: function(passage) {
        this.log();
        this.renderPassageParallelBible(passage);
    },
    _getBibleComponentName: function(index) {
        return 'Bible_' + index.toString();
    },
    _appendBibleComponent: function(content, index) {
        var compName = this._getBibleComponentName(index);
        this.container.$[compName].appendText(content);    
    },
    processAssembleVerse: function(reference, verse) {
        return reference + '  ' + this.processText(verse.text);
    },
    processAssembleSingleVerse: function(reference, verse) {
        return this.processAssembleVerse(reference, verse)  + this.newLine + this.newLine;
    },
    processAssemblePassageVerse: function(reference, verse) {
        var processed = this.processAssembleVerse(reference, verse);

        if(this.isParagraphView) {
            processed += '  ';

            if(this.isNewParagraph(verse)) {
                processed = this.newLine + processed;
            }
        }
        else {
            processed += this.newLine;
        }

        return processed;
    },
});
