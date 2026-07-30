var kind = require('enyo/kind');
var ResultsBase = require('./ResultsReadBase');
var AudioContainer = require('./AudioContainer');

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
    processAssemblePassageVerse: function(reference, verse, passage) {
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
        var buttonContainer = this._contextLinkWrapperTag();

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

        var bookName = this.app.getLocaleBookName(pd.book_id, pd.book_name);
        var refContent = '';
        var addLink;
        // 'Add to List' does the same thing regardless of Bible, so it belongs with the reference, not the Bible headers
        var addToListWithReference = this.multiBibles && !pd.single_verse && pd.verses_count > 1;

        if(!this.multiBibles) {
            var shareLink = this.linkBuilder.buildPassageSignalLink('onShare', this.formData.bible, pd);
            refContent += this._buildContextLinkHtml(shareLink, 'Share') + ' &nbsp;';
            var copyLink = this.linkBuilder.buildPassageSignalLink('onCopy', this.formData.bible, pd);
            refContent += this._buildContextLinkHtml(copyLink, 'Copy') + ' &nbsp; ';
            addLink = this.linkBuilder.buildPassageSignalLink('onSessionVerseListAdd', this.formData.bible, pd);
            refContent += this._buildContextLinkHtml(addLink, 'Add to List') + ' &nbsp; ';

            if(this.audioBibleEnabled(this.firstBible, pd)) {
                var listenLink = this.linkBuilder.buildPassageSignalLink('onListen', this.formData.bible, pd);
                refContent += this._buildContextLinkHtml(listenLink, 'Listen') + ' &nbsp;';
            }
        }

        if(addToListWithReference) {
            addLink = this.linkBuilder.buildPassageSignalLink('onSessionVerseListAdd', this.formData.bible, pd);
            refContent += this._buildContextLinkHtml(addLink, 'Add to List') + ' &nbsp; ';
        }

        if(this.app.statics.access.statistics) {
            var sl = this.linkBuilder.buildSignalLink('onStatistics', this.formData.bible, bookName, pd.chapter_verse);
            refContent += this._buildContextLinkHtml(sl, 'Statistics') + ' &nbsp;';
        }

        var crFootnoteHtml = '';

        crFootnoteHtml = this._buildPassageCrossReferencesFootnote(pd);

        if(crFootnoteHtml) {
            var crMode = this.app.normalizeCrossReferencesShow(this.app.UserConfig.get('crossReferencesShow'));

            if(crMode == 'toggle') {
                var crLinkHref = this.linkBuilder.buildPassageSignalLink('onCrossReferences', this.formData.bible, pd);
                refContent += this._buildContextLinkHtml(crLinkHref, 'Cross References') + ' &nbsp;';
            }
        }

        Container.createComponent({
            name: 'ReferenceRow',
            classes: 'bss_render_reference_row',
            tag: 'tr',
            components: [
                {
                    tag: 'th', 
                    attributes: {colspan: this.bibleCount * this.passageColumnsPerBible}, 
                    components: [
                        {content: bookName + ' ' + pd.chapter_verse},
                        {components: [
                            {tag: buttonContainer, content: refContent, allowHtml: true},
                        ]},
                        {
                            kind: AudioContainer,
                            enabled: !this.multiBibles && this.audioBibleEnabledNarrow(this.firstBible, pd),
                            bible: this.firstBible,
                            passage: pd
                        }
                    ]
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

            var bibleContent = '';

            for(i in this.bibles) {
                var module = this.bibles[i];
                var bible_info = this.selectBible(module);

                if(!bible_info) {
                    continue;
                }

                bibleContent = '';              
                
                shareLink = this.linkBuilder.buildPassageSignalLink('onShare', [module], pd);
                bibleContent += this._buildContextLinkHtml(shareLink, 'Share') + ' &nbsp;';
                copyLink = this.linkBuilder.buildPassageSignalLink('onCopy', [module], pd);
                bibleContent += this._buildContextLinkHtml(copyLink, 'Copy') + ' &nbsp;';
                if(!addToListWithReference) {
                    addLink = this.linkBuilder.buildPassageSignalLink('onSessionVerseListAdd', [module], pd);
                    bibleContent += this._buildContextLinkHtml(addLink, 'Add to List') + ' &nbsp;';
                }

                if(this.audioBibleEnabled(module, pd)) {
                    listenLink = this.linkBuilder.buildPassageSignalLink('onListen', [module], pd);
                    bibleContent += this._buildContextLinkHtml(listenLink, 'Listen') + ' &nbsp;';
                }
                
                Container.$.BibleRow.createComponent({
                    tag: 'th',
                    classes: 'bss_top_align',
                    attributes: {colspan: this.passageColumnsPerBible},
                    components: [
                        {content: this._getBibleDisplayName(bible_info)},
                        {components: [
                            {tag: buttonContainer, content: bibleContent, allowHtml: true}
                        ]},
                        {
                            kind: AudioContainer, 
                            enabled: this.audioBibleEnabledNarrow(module, pd),
                            bible:  module, 
                            passage: pd
                        }
                    ]
                });
            }
        }

        this._addWideAudioContainer(Container, pd);

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
                        var verseData = this._withVerseMeta(pd.verses[module][chapter][verse], chapter, verse);
                        var processed = this.processPassageVerseContent(pd, verseData);
                        bibleHtml[i] += processed;
                    }
                }

            }, this);
        }

        var html = '';

        bibleHtml.forEach(function(bhtml, idx) {
            var module = this.bibles[idx];
            var bible_info = this.selectBible(module);

            if(!bible_info) {
                return;
            }

            var classes = this.getSelectedBibleClasses();
            html += '<td class=\' bss_txt ' + classes + '\'>' + bhtml + '</td>';
        }, this);

        Container.createComponent({
            tag: 'tr',
            content: html,
            allowHtml: true
        });

        if(crFootnoteHtml) {
            Container.createComponent({
                tag: 'tr',
                classes: 'bss_cross_references_row',
                components: [{
                    tag: 'td',
                    attributes: {colspan: this.bibleCount * this.passageColumnsPerBible},
                    allowHtml: true,
                    content: crFootnoteHtml
                }]
            });
        }

        this._addNavButtons(Container, pd);
    },
    // Multi verse, single Bible
    renderPassageSingleBible: function(pd) {
        this.renderPassageParallelBible(pd);
    }
});
