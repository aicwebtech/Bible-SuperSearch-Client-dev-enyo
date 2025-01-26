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
        // No special RTL formatting needed - direction: rtl will display it correctly!
        return reference + '  ' + this.processText(verse.text);
    },
    processAssemblePassageVerse: function(reference, verse) {
        // No special RTL formatting needed - direction: rtl will display it correctly!
        var processed = '<sup class="bss_ver">' + reference + '</sup><span class="bss_txt">' + this.processText(verse.text) + '</span>  ';

        if(this.isNewParagraph(verse)) {
            processed = this.newLine + this.newLine + processed;
        }

        return processed;
    },

    // Multi verse, multi Bible
    renderPassageParallelBible: function(pd) {
        var Container = this._createContainer();
        var bibleHtml = [];

        for(i in this.bibles) {
            bibleHtml[i] = '';
        }

        if(this.app.configs.includeTestament) {        
            Container.createComponent({
                name: 'TestamentRow',
                classes: 'bss_render_testament_row',
                tag: 'tr',
                components: [
                    {
                        tag: 'th', 
                        attributes: {colspan: this.bibleCount * this.passageColumnsPerBible}, 
                        components: [
                            {tag: 'h3', content: this.app.t( this.app.getTestamentByBookId(pd.book_id))}
                        ]
                    }
                ]
            });        
        }

        Container.createComponent({
            name: 'ReferenceRow',
            classes: 'bss_render_reference_row',
            tag: 'tr',
            components: [
                {
                    tag: 'th', 
                    attributes: {colspan: this.bibleCount * this.passageColumnsPerBible}, 
                    content: this.app.getLocaleBookName(pd.book_id, pd.book_name) + ' ' + pd.chapter_verse
                }
            ]
        });

        this._addNavButtons(Container, pd);

        if(this.multiBibles) {        
            Container.createComponent({
                name: 'BibleRow',
                classes: 'bss_render_bible_row',
                tag: 'tr'
            });

            for(i in this.bibles) {
                var module = this.bibles[i];
                var bible_info = this.selectBible(module);

                if(!bible_info) {
                    continue;
                }

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
                    var bible_info = this.selectBible(module);

                    if(!bible_info) {
                        continue;
                    }

                    if(pd.verses[module] && pd.verses[module][chapter] && pd.verses[module][chapter][verse]) {
                        var processed = this.processPassageVerseContent(pd, pd.verses[module][chapter][verse]);
                        bibleHtml[i] += processed;
                    }
                }

            }, this);
        }

        var html = '';

        bibleHtml.forEach(function(bhtml, idx) {
            var module = this.bibles[idx];
            var bible_info = this.selectBible(module);
            var dc = this.selectedBible.rtl ? 'bss_rtl' : 'bss_ltr';
            var classes = this.getSelectedBibleClasses();
            html += '<td class=\' txt ' + classes + '\'>' + bhtml + '</td>';
        }, this);

        Container.createComponent({
            tag: 'tr',
            content: html,
            allowHtml: true
        });

        this._addNavButtons(Container, pd);
    },
    // Multi verse, single Bible
    renderPassageSingleBible: function(pd) {
        this.renderPassageParallelBible(pd);
    }
});
