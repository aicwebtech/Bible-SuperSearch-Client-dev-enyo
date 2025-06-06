var kind = require('enyo/kind');
var ResultsBase = require('./ResultsBase');
var Link = require('../../components/Link/Link');
var Signal = require('enyo/Signals');

module.exports = kind({
    name: 'ResultsReadBase',
    kind: ResultsBase,
    blankSingleVerse: '<td></td>',
    blankPassageVerse: '<td></td>',
    passageColumnsPerBible: 1,
    singleVerseCount: 0,
    singleVerseBibleHeaderThreshold: 10,
    singleVerseBibleHeaderNext: true,

    beforeRender: function() {
        this.inherited(arguments);
        this.singleVerseCount = 0;
    },
    renderTopPlaceholder: function() {
        var Container = this._createContainer(null, 'TopPlaceholder');
        Container.set('showing', false);
        Container.set('type', 'top_placeholder');
    },
    populateTopPlaceholder: function() {
        var r = this.app.get('altResponseData') || null;

        if(!r) {
            return;
        }

        var Container = this.$['TopPlaceholder'];
        Container.destroyClientControls();

        // if(e.type == 'resultsListVerse') {
            var pd = r.results[0];
            this.renderSingleVerseParallelBible(pd, Container);
        // }

        Container.createComponent({
            components: [
                {tag: 'br'},
                {
                    kind: Link, 
                    classes: 'bss_top_placeholder_hide', 
                    content: 'Resume Search', 
                    href: 'javascript:void(0)'
                }
            ]
        });

        Container.render();
        Container.set('showing', true);
        this.waterfall('onResultsComponentShowingChange', {type: 'normal', showing: false})
    },

    hideTopPlaceholder: function() {
        this.app.set('altResponseData', null);
        Signal.send('onShowingReset');
        this.waterfall('onResultsComponentShowingChange', {type: 'top_placeholder', showing: false});
        this.waterfall('onResultsComponentShowingChange', {type: 'normal', showing: true});
    },

    // Single verse, single Bible
    renderSingleVerseSingleBible: function(pd) {
        this.renderSingleVerseParallelBible(pd);
    },
    // Single verse, multi Bible
    renderSingleVerseParallelBible: function(pd, Container) {
        var Container = Container || this._createContainer(pd);
        var addBibleHeader = false,
            addReferenceRow = false,
            renderStyle = this.renderStyle;

        Container.set('singleVerse', true);

        if(renderStyle == 'verse_passage') {
            addBibleHeader = true;
            addReferenceRow = true;
        }

        if(this.multiBibles && (this.singleVerseBibleHeaderNext || this.singleVerseCount >= this.singleVerseBibleHeaderThreshold)) {
            addBibleHeader = true;
            this.singleVerseBibleHeaderNext = false;
            this.singleVerseCount = 0;
        }

        if(addReferenceRow) {        
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
                tag: 'tr'
            });
        }

        if(addBibleHeader) {        
            Container.createComponent({
                name: 'BibleRow',
                class: 'bss_render_bible_row bss_bacon',
                tag: 'tr'
            });
        }

        Container.createComponent({
            name: 'VerseRow',
            class: 'bss_render_verse_row',
            tag: 'tr'
        });

        var haveText = false;
        this.singleVerseCount ++;

        for(chapter in pd.verse_index) {
            pd.verse_index[chapter].forEach(function(verse) {
                for(i in this.bibles) {
                    var mod = this.bibles[i];
                    var content = '';
                    var bible_info = this.selectBible(mod);

                    if(!bible_info) {
                        continue;
                    }

                    if(pd.verses[mod] && pd.verses[mod][chapter] && pd.verses[mod][chapter][verse]) {
                        content = pd.verses[mod][chapter][verse].text || '';
                        haveText = (content != '') ? true : haveText;
                        content = this.processSingleVerseContent(pd, pd.verses[mod][chapter][verse]);
                        // this.signalVerseShowing(pd.book_id, chapter, verse);
                    }

                    Container.$.VerseRow.createComponent({
                        tag: 'td',
                        content: content,
                        attributes: {valign: 'top'},
                        allowHtml: true,
                        classes: this.getSelectedBibleClasses()
                    });
                }
            }, this);
        }

        if(haveText) {            
            for(i in this.bibles) {
                var mod = this.bibles[i];

                if(typeof this.app.statics.bibles[mod] == 'undefined') {
                    continue;
                }

                var bible_info = this.app.statics.bibles[mod];
                
                if(addBibleHeader) {                
                    Container.$.BibleRow.createComponent({
                        tag: 'th',
                        content: this._getBibleDisplayName(bible_info)
                    });
                }
            }

            if(addReferenceRow) {                
                var bookName = this.app.getLocaleBookName(pd.book_id, pd.book_name);

                Container.$.ReferenceRow.createComponent({
                    tag: 'th',
                    allowHtml: true,
                    attributes: {colspan: this.bibleCount * this.passageColumnsPerBible}, 
                    content: bookName + ' ' + pd.chapter_verse
                });
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
        var Container = this._createContainer(pd);
        // this.singleVerseCount = 0;
        // this.singleVerseBibleHeaderNext = true;

        var addBibleHeader = false,
            renderStyle = this.renderStyle;

        if(this.renderStyle == 'verse_passage') {
            addBibleHeader = true;
        }

        if(this.multiBibles && (this.singleVerseBibleHeaderNext || this.singleVerseCount >= this.singleVerseBibleHeaderThreshold)) {
            addBibleHeader = true;
            this.singleVerseBibleHeaderNext = false;
            this.singleVerseCount = 0;
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

        var bookName = this.app.getLocaleBookName(pd.book_id, pd.book_name);
        var refContent = bookName + ' ' + pd.chapter_verse;

        if(this.app.statics.access.statistics) {
            var sl = this.linkBuilder.buildSignalLink('onStatistics', this.formData.bible, bookName, pd.chapter_verse);
            refContent += '&nbsp; <sup>' + '<a href="' + sl + '" title="' + refContent + '" class="bss_std_link">' + this.app.t('Statistics') + '</a></sup>';
        }

        Container.createComponent({
            name: 'ReferenceRow',
            classes: 'bss_render_reference_row',
            tag: 'tr',
            components: [
                {
                    tag: 'th', 
                    attributes: {colspan: this.bibleCount * this.passageColumnsPerBible}, 
                    content: refContent,
                    allowHtml: true
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
                var mod = this.bibles[i];

                if(typeof this.app.statics.bibles[mod] == 'undefined') {
                    continue;
                }
                
                var bible_info = this.app.statics.bibles[mod];

                Container.$.BibleRow.createComponent({
                    tag: 'th',
                    attributes: {colspan: this.passageColumnsPerBible},
                    content: this._getBibleDisplayName(bible_info)
                });
            }
        }

        var VerseContainer = Container.createComponent({
            tag: 'tbody',
            name: 'VerseContainer'
        });

        for(chapter in pd.verse_index) {
            pd.verse_index[chapter].forEach(function(verse) {
                var html = '';
                this.singleVerseCount ++;

                var addBibleHeader = (this.singleVerseCount > 1 && this.singleVerseCount % 10 == 1);
                var verseShowing = false;

                if(addBibleHeader && renderStyle == 'verse_passage') {
                    this._addBibleHeader(VerseContainer);
                }

                for(i in this.bibles) {
                    var mod = this.bibles[i];
                    var content = '';
                    var bible_info = this.selectBible(mod);

                    if(!bible_info) {
                        continue;
                    }

                    if(pd.verses[mod] && pd.verses[mod][chapter] && pd.verses[mod][chapter][verse]) {
                        if(renderStyle == 'verse_passage') {
                            var classes = this.getSelectedBibleClasses();
                            var processed = '<td class="' + classes + '">' + this.processSingleVerseContent(pd, pd.verses[mod][chapter][verse]) + '</td>';
                        } else {
                            var processed = this.processPassageVerseContent(pd, pd.verses[mod][chapter][verse]);
                        }

                        html += processed;
                        verseShowing = true;
                    }
                    else {
                        html += this.blankPassageVerse;
                    }
                }
                
                verseShowing && this.signalVerseShowing(pd.book_id, chapter, verse);

                VerseContainer.createComponent({
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
        if(!this.selectedBible) {
            return '';
        }
        
        if(this.selectedBible.rtl) {
            return this.processText(verse.text) + ' ' + reference;
        }
        else {
            return reference + '  ' + this.processText(verse.text);
        }
    },
    processAssembleSingleVerse: function(reference, verse) {
        return '<div class="bss_ver">' + reference + '</div><div class="bss_txt">' + this.processText(verse.text) + '</div>';



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
        var bookName = this.app.getLocaleBookName(passage.book_id, passage.book_name);
        var verseLink = this.linkBuilder.buildReferenceLink('p', this.formData.bible, bookName, verse.chapter, verse.verse);
        var chapterLink = this.linkBuilder.buildReferenceLink('p', this.formData.bible, bookName, verse.chapter);
        var contextLink = this.linkBuilder.buildReferenceLink('context', this.formData.bible, bookName, verse.chapter, verse.verse);

        var includeContextLinks = true;

        if(!passage.single_verse && (passage.nav && !passage.nav.ccc || passage.chapter_verse.indexOf(':') == -1)) {
            includeContextLinks = false;
        }

        var html =  '<a href="' + chapterLink + '" title="Show this Chapter" class="std_link">' + bookName + ' ' + verse.chapter + '</a>:';
            html += '<a href="' + contextLink + '" title="Show in Context" class="std_link">' + verse.verse + '</a>';

        // verse.linksHtml = '<br /><small>'; // future use?

        var chapterTitle = this.app.t("Show full chapter"),
            chapterText = this.app.t('Chapter'),
            verseTitle = this.app.t('Show this verse'),
            contextTitle = this.app.t('Show in context'),
            contextText = this.app.t('Context');

        var html = '';
            html += '<a href="' + verseLink + '" title="' + verseTitle + '" class="bss_std_link">' + bookName + ' ' + verse.chapter + ':' + verse.verse + '</a>';
            
            if(includeContextLinks) {            
                html += '&nbsp; <sup>' + '<a href="' + contextLink + '" title="' + contextTitle + '" class="bss_std_link">' + contextText + '</a></sup>';           
                html += '&nbsp; <sup>' + '<a href="' + chapterLink + '" title="' + chapterTitle + '" class="bss_std_link">' + chapterText + '</a></sup>';


                if(this.app.statics.access.statistics) {
                    var sl = this.linkBuilder.buildSignalLink('onStatistics', this.formData.bible, bookName, verse.chapter, verse.verse);
                    html += '&nbsp; <sup>' + '<a href="' + sl + '" title="' + chapterTitle + '" class="bss_std_link">' + this.app.t('Statistics') + '</a></sup>';
                }

                // verse.linksHtml += '<a href="' + chapterLink + '" title="' + chapterTitle + '" class="std_link">' + chapterText + '</a>&nbsp; &nbsp;';
                // verse.linksHtml += '<a href="' + contextLink + '" title="' + contextTitle + '" class="std_link">' + contextText + '</a>';
                // future? 
                // html += '&nbsp;&nbsp;<sup>' + '<a href="' + contextLink + '" title="' + contextTitle + '" class="std_link">' + 'Statistics' + '</a></sup>';
            }

        // verse.linksHtml += '</small>';

        return html;
    },   
    _processSingleVerseLinks: function(passage, verse) {

    },
    _addNavButtons: function(Container, passage) {
        if(typeof passage.nav == 'object') {
            var NavButtons = this.app.getSubControl('NavButtons')
                NavName = 'NavButtons_' + Math.floor(Math.random() * 10000);

            if(NavButtons) {
                var comp = Container.createComponent({
                    tag: 'tr', 
                    components: [
                        {tag: 'td', attributes: {colspan: this.bibleCount * this.passageColumnsPerBible}, 
                        components: [
                            {name: NavName, nav: passage.nav, kind: NavButtons, bibles: this.bibles }
                        ]}
                    ]
                });

                Container._pushNavButtons(comp);
                // Container._pushNavButtons(comp.$[NavName]);
                //Container._pushNavButtons(comp.components[0].components[0]);
            }
        }
    },
    _addBibleHeader: function(Container, name) {
        if(name) {
            var BibleRow = Container.createComponent({
                name: name,
                tag: 'tr'
            });
        } else {
            var BibleRow = Container.createComponent({
                tag: 'tr'
            });
        }

        for(i in this.bibles) {
            var mod = this.bibles[i];

            if(typeof this.app.statics.bibles[mod] == 'undefined') {
                continue;
            }
            
            var bible_info = this.app.statics.bibles[mod];

            BibleRow.createComponent({
                tag: 'th',
                attributes: {colspan: this.passageColumnsPerBible},
                content: this._getBibleDisplayName(bible_info)
            });
        }
    }
});
