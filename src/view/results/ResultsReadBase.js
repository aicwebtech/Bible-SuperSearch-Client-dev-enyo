var kind = require('enyo/kind');
var ResultsBase = require('./ResultsBase');
var Link = require('../../components/Link/Link');
var Signal = require('enyo/Signals');
var AudioContainer = require('./AudioContainer');
var bssUtils = require('../../lib/Utils');

module.exports = kind({
    name: 'ResultsReadBase',
    kind: ResultsBase,
    blankSingleVerse: '<td></td>',
    blankPassageVerse: '<td></td>',
    passageColumnsPerBible: 1,
    singleVerseCount: 0,
    singleVerseBibleHeaderThreshold: 10,
    singleVerseBibleHeaderNext: true,
    crossReferencesToggleMap: null,
    crossReferencesPassageToggleMap: null,

    handlers: {
        onCrossReferences: 'handleCrossReferencesSignal'
    },

    beforeRender: function() {
        this.inherited(arguments);
        this.singleVerseCount = 0;
        this.crossReferencesToggleMap = {};
        this.crossReferencesPassageToggleMap = {};
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

        Signal.send('onSilence'); // stop any audio playing

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
        Signal.send('onSilence'); // stop any audio playing
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
            // With only one Bible selected, the Bible header is redundant
            addBibleHeader = this.multiBibles;
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
                classes: 'bss_render_bible_row',
                tag: 'tr'
            });
        }

        Container.createComponent({
            name: 'VerseRow',
            classes: 'bss_render_verse_row',
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
                        var verseData = this._withVerseMeta(pd.verses[mod][chapter][verse], chapter, verse);
                        content = verseData.text || '';
                        haveText = (content != '') ? true : haveText;
                        content = this.processSingleVerseContent(pd, verseData);
                        // this.signalVerseShowing(pd.book_id, chapter, verse);
                    }

                    Container.$.VerseRow.createComponent({
                        tag: 'td',
                        classes: 'bss_top_align ' + this.getSelectedBibleClasses(),
                        components: [
                            {allowHtml: true, content: content},
                            {
                                kind: AudioContainer, 
                                enabled: this.audioBibleEnabledNarrow(mod, pd),
                                bible: mod, 
                                passage: pd
                            }
                        ]
                    });
                }

                this._addCrossReferencesRow(Container, pd, chapter, verse);
            }, this);
        }

        this._addWideAudioContainer(Container, pd);

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
        this.renderPassageParallelBible(pd);
    },
    // Multi verse, single Bible
    renderPassageParallelBible: function(pd) {
        var Container = this._createContainer(pd);
        var buttonContainer = this._contextLinkWrapperTag();

        var addBibleHeader = false,
            renderStyle = this.renderStyle;

        // With only one Bible selected, the Bible header and its buttons duplicate the reference row
        if(this.renderStyle == 'verse_passage' && this.multiBibles) {
            addBibleHeader = true;
        }

        if(this.multiBibles && (
            this.renderStyle == 'passage' || this.singleVerseBibleHeaderNext || this.singleVerseCount >= this.singleVerseBibleHeaderThreshold
        )) {
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
        var refContent = '';
        var addLink;
        // 'Add to List' does the same thing regardless of Bible, so it belongs with the reference, not the Bible headers
        var addToListWithReference = this.multiBibles && !pd.single_verse && pd.verses_count > 1;

        if(!this.multiBibles) {
            var shareLink = this.linkBuilder.buildPassageSignalLink('onShare', this.formData.bible, pd);
            refContent += this._buildContextLinkHtml(shareLink, 'Share') + ' &nbsp;';
            var copyLink = this.linkBuilder.buildPassageSignalLink('onCopy', this.formData.bible, pd);
            refContent += this._buildContextLinkHtml(copyLink, 'Copy') + ' &nbsp;';
            addLink = this.linkBuilder.buildPassageSignalLink('onSessionVerseListAdd', this.formData.bible, pd);
            refContent += this._buildContextLinkHtml(addLink, 'Add to List') + ' &nbsp;';

            if(this.audioBibleEnabled(this.firstBible, pd)) {
                var listenLink = this.linkBuilder.buildPassageSignalLink('onListen', this.formData.bible, pd);
                refContent += this._buildContextLinkHtml(listenLink, 'Listen') + ' &nbsp;';
            }
        }

        if(addToListWithReference) {
            addLink = this.linkBuilder.buildPassageSignalLink('onSessionVerseListAdd', this.formData.bible, pd);
            refContent += this._buildContextLinkHtml(addLink, 'Add to List') + ' &nbsp;';
        }

        if(this.app.statics.access.statistics) {
            var sl = this.linkBuilder.buildSignalLink('onStatistics', this.formData.bible, bookName, pd.chapter_verse);
            refContent += this._buildContextLinkHtml(sl, 'Statistics') + ' &nbsp;';
        }

        var passageCrossReferencesLink = this._buildPassageCrossReferencesToggleLink(pd);

        if(passageCrossReferencesLink) {
            refContent += passageCrossReferencesLink + ' &nbsp;';
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

        if(addBibleHeader) {            
            Container.createComponent({
                name: 'BibleRow',
                tag: 'tr'
            });

            var bibleContent = '';

            for(i in this.bibles) {
                var mod = this.bibles[i];

                if(typeof this.app.statics.bibles[mod] == 'undefined') {
                    continue;
                }

                var bible_info = this.app.statics.bibles[mod];
                bibleContent = ''; //this._getBibleDisplayName(bible_info);

                shareLink = this.linkBuilder.buildPassageSignalLink('onShare', [mod], pd);
                bibleContent += this._buildContextLinkHtml(shareLink, 'Share') + ' &nbsp;';
                copyLink = this.linkBuilder.buildPassageSignalLink('onCopy', [mod], pd);
                bibleContent += this._buildContextLinkHtml(copyLink, 'Copy') + ' &nbsp;';
                if(!addToListWithReference) {
                    addLink = this.linkBuilder.buildPassageSignalLink('onSessionVerseListAdd', [mod], pd);
                    bibleContent += this._buildContextLinkHtml(addLink, 'Add to List') + ' &nbsp;';
                }

                if(this.audioBibleEnabledChapter(mod, pd)) {
                    listenLink = this.linkBuilder.buildPassageSignalLink('onListen', [mod], pd);
                    bibleContent += this._buildContextLinkHtml(listenLink, 'Listen') + ' &nbsp;';
                }

                var showbibleContent = !pd.single_verse && pd.verses_count > 1;

                Container.$.BibleRow.createComponent({
                    tag: 'th',
                    classes: 'bss_top_align',
                    attributes: {colspan: this.passageColumnsPerBible},
                    allowHtml: true,
                    components: [
                        {content: this._getBibleDisplayName(bible_info)},
                        {components: [
                            {tag: buttonContainer, content: bibleContent, allowHtml: true, showing: showbibleContent},
                        ]},
                        {
                            kind: AudioContainer, 
                            enabled: this.multiBibles && this.audioBibleEnabledNarrow(mod, pd),
                            bible: mod, 
                            passage: pd
                        }
                    ]
                });
            }
        }

        this._addWideAudioContainer(Container, pd);

        var VerseContainer = Container.createComponent({
            tag: 'tbody',
            name: 'VerseContainer'
        });

        for(chapter in pd.verse_index) {
            pd.verse_index[chapter].forEach(function(verse) {
                var html = '';
                var components = [];
                this.singleVerseCount ++;

                var addBibleHeader = (this.singleVerseCount > 1 && this.singleVerseCount % 10 == 1);
                var verseShowing = false;
                var passageClone = Object.assign({}, pd);
                passageClone.chapter_verse_actual = chapter + ':' + verse;

                if(addBibleHeader && renderStyle == 'verse_passage' && this.multiBibles) {
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
                        var verseData = this._withVerseMeta(pd.verses[mod][chapter][verse], chapter, verse);

                        if(renderStyle == 'verse_passage') {
                            var classes = this.getSelectedBibleClasses();
                            //var processed = '<td class="' + classes + '">' + this.processSingleVerseContent(pd, pd.verses[mod][chapter][verse]) + '</td>';
                            var processed = this.processSingleVerseContent(pd, verseData);

                            components.push({tag: 'td', classes: classes, components: [
                                {allowHtml: true, content: processed},
                                {
                                    kind: AudioContainer, 
                                    enabled: this.audioBibleEnabledNarrow(mod, passageClone),
                                    bible: mod, 
                                    passage: passageClone
                                }
                            ]});
                        } else {
                            var processed = this.processPassageVerseContent(pd, verseData);
                        }

                        html += processed;
                        verseShowing = true;
                    }
                    else {
                        html += this.blankPassageVerse;
                    }
                }
                
                verseShowing && this.signalVerseShowing(pd.book_id, chapter, verse);

                if(renderStyle == 'verse_passage') {
                    VerseContainer.createComponent({
                        tag: 'tr',
                        components: components,
                    });

                    this._addCrossReferencesRow(VerseContainer, pd, chapter, verse);
                    this._addWideAudioContainer(VerseContainer, passageClone);
                } else {
                    VerseContainer.createComponent({
                        tag: 'tr',
                        allowHtml: true,
                        content: html
                    });

                    this._addCrossReferencesRow(VerseContainer, pd, chapter, verse);
                }

            }, this);
        }

        this._addNavButtons(Container, pd);

        // var Row = Container.createComponent({
        //     name: 'BibleCopyrightRow',
        //     tag: 'tr'
        // });

        // this._renderCopyRightBottomHelper(Row);
    },

    processSingleVerseContent: function(passage, verse) {
        var ref = this.proccessSingleVerseReference(passage, verse);
        return this.processAssembleSingleVerse(ref, verse, passage);
    },
    processPassageVerseContent: function(passage, verse) {
        var ref = this.proccessPassageVerseReference(passage, verse);
        return this.processAssemblePassageVerse(ref, verse, passage);
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
    processAssembleSingleVerse: function(reference, verse, passage) {
        var text = '<div class="bss_ver">' + reference + '</div><div class="bss_txt">' + this.processText(verse.text) + '</div>';
        return this._addInlineCrossReferences(text, passage, verse);
    },
    processAssemblePassageVerse: function(reference, verse, passage) {
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

        return this._addInlineCrossReferences(processed, passage, verse);
    },
    _addInlineCrossReferences: function(content, passage, verse) {
        if(this.multiBibles) {
            return content;
        }

        var html = this._buildCrossReferencesHtml(passage.book_id, verse.chapter, verse.verse, passage);

        if(!html) {
            return content;
        }

        if(this.app.normalizeCrossReferencesShow(this.app.UserConfig.get('crossReferencesShow')) == 'toggle') {
            return content + html;
        }

        return content + html;
    },
    _withVerseMeta: function(verseData, chapter, verse) {
        var chapterNum = parseInt(chapter, 10),
            verseNum = parseInt(verse, 10);

        if(verseData.chapter == chapterNum && verseData.verse == verseNum) {
            return verseData;
        }

        var v = Object.assign({}, verseData);

        if(typeof v.chapter == 'undefined' || v.chapter === null || v.chapter === '') {
            v.chapter = chapterNum;
        }

        if(typeof v.verse == 'undefined' || v.verse === null || v.verse === '') {
            v.verse = verseNum;
        }

        return v;
    },
    _addCrossReferencesRow: function(Container, passage, chapter, verse) {
        if(!this.multiBibles) {
            return;
        }

        var html = this._buildCrossReferencesHtml(passage.book_id, chapter, verse, passage);

        if(!html) {
            return;
        }

        Container.createComponent({
            tag: 'tr',
            classes: 'bss_cross_references_row',
            components: [
                {
                    tag: 'td',
                    attributes: {colspan: this.bibleCount * this.passageColumnsPerBible},
                    allowHtml: true,
                    content: html
                }
            ]
        });
    },
    _getCrossReferencesToggleId: function(bookId, chapter, verse, cv, cva) {
        var id = this.getId ? this.getId() : 'bss';
        cv = (cv || '').toString().replace(/[^A-Za-z0-9_\-:.]/g, '_');
        cva = (cva || '').toString().replace(/[^A-Za-z0-9_\-:.]/g, '_');
        return 'bss_cross_refs_' + id + '_' + bookId + '_' + chapter + '_' + verse + '_' + cv + '_' + cva;
    },
    _getCrossReferencesSignalKey: function(bookId, cv, cva) {
        return [bookId || '', cv || '', cva || ''].join('|');
    },
    _buildCrossReferencesToggleLink: function(passage) {
        var bookId = passage.book_id;
        var cv = passage.chapter_verse || '';
        var cva = passage.chapter_verse_actual || '';

        var mode = this.app.normalizeCrossReferencesShow(this.app.UserConfig.get('crossReferencesShow'));

        if(mode != 'toggle') {
            return '';
        }

        if(passage.chapter_verse_actual) {
            var chapter = passage.chapter_verse_actual.split(':')[0];
            var verse = passage.chapter_verse_actual.split(':')[1] || null;
        } else {
            var chapter = (passage.chapter_verse || '').split(':')[0];
            var verse = (passage.chapter_verse || '').split(':')[1] || null;
        }
        
        if(!this.app.crossReferencesEnabled()) {
            return '';
        }

        var refs = this._getCrossReferences(bookId, chapter, verse);

        if(!refs.length) {
            return '';
        }

        var toggleId = this._getCrossReferencesToggleId(bookId, chapter, verse, cv, chapter + ':' + verse);
        var signalKey = this._getCrossReferencesSignalKey(bookId, cv, cva);

        if(!Array.isArray(this.crossReferencesToggleMap[signalKey])) {
            this.crossReferencesToggleMap[signalKey] = [];
        }

        if(this.crossReferencesToggleMap[signalKey].indexOf(toggleId) === -1) {
            this.crossReferencesToggleMap[signalKey].push(toggleId);
        }

        var link = this.linkBuilder.buildPassageSignalLink('onCrossReferences', this.formData.bible, passage);

        return this._buildContextLinkHtml(link, 'Cross References');
    },
    _buildPassageCrossReferencesToggleLink: function(passage) {
        if(!this.app.crossReferencesEnabled()) {
            return '';
        }

        var mode = this.app.normalizeCrossReferencesShow(this.app.UserConfig.get('crossReferencesShow'));

        if(mode != 'toggle') {
            return '';
        }

        var toggleIds = [];
        var cv = passage.chapter_verse || '';
        var cva = passage.chapter_verse_actual || '';

        for(var chapter in passage.verse_index) {
            passage.verse_index[chapter].forEach(function(verse) {
                var refs = this._getCrossReferences(passage.book_id, chapter, verse);

                if(refs.length) {
                    toggleIds.push(this._getCrossReferencesToggleId(passage.book_id, chapter, verse, cv, chapter + ':' + verse));
                }
            }, this);
        }

        if(!toggleIds.length) {
            return '';
        }

        var refKey = this._getCrossReferencesSignalKey(passage.book_id, cv, cva);
        var link = this.linkBuilder.buildPassageSignalLink('onCrossReferences', this.formData.bible, passage);

        this.crossReferencesPassageToggleMap[refKey] = toggleIds;

        return this._buildContextLinkHtml(link, 'Cross References');
    },
    // Builds a footnote-style cross-references block for use in multi-Bible paragraph view.
    // Each verse's CRs are shown on their own line, prefixed with chapter:verse.
    // In toggle mode, the block is hidden and the ID is registered in crossReferencesPassageToggleMap
    // so the passage-level signal link can show/hide it.
    _buildPassageCrossReferencesFootnote: function(passage) {
        if(!this.app.crossReferencesEnabled()) {
            return '';
        }

        var mode = this.app.normalizeCrossReferencesShow(this.app.UserConfig.get('crossReferencesShow'));

        if(mode == 'hidden') {
            return '';
        }

        var cv  = passage.chapter_verse || '';
        var cva = passage.chapter_verse_actual || '';
        var footnoteLines = [];

        for(var chapter in passage.verse_index) {
            passage.verse_index[chapter].forEach(function(verse) {
                // Paragraph-mode footnotes always render in expanded (book-grouped) layout.
                var refs = this._getCrossReferences(passage.book_id, chapter, verse, 'expand');

                if(refs.length) {
                    var footnoteBody = refs.join('');
                    footnoteLines.push('<b>' + bssUtils.escapeHtml(chapter + ':' + verse) + '</b> ' + footnoteBody);
                }
            }, this);
        }

        if(!footnoteLines.length) {
            return '';
        }

        var body = footnoteLines.join('<br />');

        if(mode == 'toggle') {
            var id = this.getId ? this.getId() : 'bss';
            var sanitizedCv = (cv || '').toString().replace(/[^A-Za-z0-9_\-]/g, '_');
            var toggleId = 'bss_cross_refs_fn_' + id + '_' + passage.book_id + '_' + sanitizedCv;
            var refKey = this._getCrossReferencesSignalKey(passage.book_id, cv, cva);

            this.crossReferencesPassageToggleMap[refKey] = [toggleId];

            return '<div class="bss_cross_references bss_cross_references_footnote" id="' + toggleId + '" style="display:none">' + body + '</div>';
        }

        return '<div class="bss_cross_references bss_cross_references_footnote">' + body + '</div>';
    },
    _toggleCrossReferencesIds: function(ids) {
        if(!ids || !ids.length) {
            return;
        }

        var show = true;

        for(var i = 0; i < ids.length; i++) {
            var e = document.getElementById(ids[i]);

            if(e && e.style.display !== 'none' && e.style.display !== '') {
                show = false;
                break;
            }
        }

        for(var j = 0; j < ids.length; j++) {
            var el = document.getElementById(ids[j]);

            if(el) {
                el.style.display = show ? 'block' : 'none';
            }
        }
    },
    handleCrossReferencesSignal: function(inSender, inEvent) {        
        var b = inEvent && inEvent.b ? inEvent.b : null;
        var cv = inEvent && inEvent.cv ? inEvent.cv : '';
        var cva = inEvent && inEvent.cva ? inEvent.cva : '';
        var signalKey = this._getCrossReferencesSignalKey(b, cv, cva);

        if(this.crossReferencesPassageToggleMap[signalKey]) {
            this._toggleCrossReferencesIds(this.crossReferencesPassageToggleMap[signalKey]);
            return true;
        } else if(this.crossReferencesToggleMap[signalKey]) {
            this._toggleCrossReferencesIds(this.crossReferencesToggleMap[signalKey]);
            return true;
        }

        return true;
    },
    _buildCrossReferencesHtml: function(bookId, chapter, verse, passage) {
        if(!this.app.crossReferencesEnabled()) {
            return '';
        }

        var mode = this.app.normalizeCrossReferencesShow(this.app.UserConfig.get('crossReferencesShow'));

        if(mode == 'hidden') {
            return '';
        }

        var refs = this._getCrossReferences(bookId, chapter, verse);

        if(!refs.length) {
            return '';
        }

        var body = refs.join('');
        var title = "<span class='bss_cross_references_title'>" + this.app.t('Cross References') + "</span>";

        if(mode == 'toggle') {
            var cv = passage && passage.chapter_verse ? passage.chapter_verse : '';
            var toggleId = this._getCrossReferencesToggleId(bookId, chapter, verse, cv, chapter + ':' + verse);

            return '<div class="bss_cross_references" id="' + toggleId + '" style="display:none">' + body + '</div>';
        }

        return '<div class="bss_cross_references">' + title + ': ' + body + '</div>';
    },
    _getCrossReferences: function(bookId, chapter, verse, format) {
        var data = this.app.get('altResponseData') || this.get('resultsData') || {};
        var crossReferences = data.cross_references || [];
        var found = [];

        if(!bookId || !chapter || !verse) {
            return found;
        }

        var idx = bookId + '_' + chapter + '_' + verse;

        // Check if crossReferennce is an object - preferred
        if(typeof crossReferences == 'object' && crossReferences !== null && !Array.isArray(crossReferences)) {
            return crossReferences[idx] ? [this._formatCrossReference(crossReferences[idx], format)] : [];
        }

        // Fallback for older array-based format - loop through all and find matches
        if(!Array.isArray(crossReferences)) {
            return found;
        }

        for(var i = 0; i < crossReferences.length; i++) {
            var item = crossReferences[i];
            var fromBook = parseInt(item.from_book, 10);
            var fromChapter = parseInt(item.from_chapter, 10);
            var fromVerse = parseInt(item.from_verse, 10);

            if(fromBook !== parseInt(bookId, 10)) {
                continue;
            }

            if(fromChapter !== parseInt(chapter, 10) || fromVerse !== parseInt(verse, 10)) {
                continue;
            }

            var label = this._formatCrossReference(item, format);

            if(label) {
                found.push(label);
            }
        }

        return found;
    },
    _formatCrossRefRange: function(cr) {
        if(cr.to_chapter_end && cr.to_verse_end && (cr.to_chapter_end != cr.to_chapter_start || cr.to_verse_end != cr.to_verse_start)) {
            return '-' + (cr.to_chapter_end != cr.to_chapter_start ? cr.to_chapter_end + ':' : '') + cr.to_verse_end;
        }
        return '';
    },
    // Builds the href for a single cross reference link via the LinkBuilder. When
    // crossReferenceLinkIncludeParent is enabled, the originating ("from" / parent) reference is
    // prepended so the link pulls both the parent verse and the cross reference (as a combined
    // reference); the link's display text is unchanged either way.
    // Both variants use the 'cr' hash so the destination knows it came from a cross reference and
    // can reset scroll mode to the top of the Bible text (not the top of the site). A plain 'p'
    // link is indistinguishable from any other passage link and won't trigger cross-reference scrolling.
    _crossReferenceTargetHref: function(item, cr, localeBook) {
        var targetRef = localeBook + ' ' + cr.to_chapter_start + ':' + cr.to_verse_start + this._formatCrossRefRange(cr);

        if(this.app._isTrue(this.app.configs.crossReferenceLinkIncludeParent)) {
            var parentRef = this.app.getLocaleBookName(item.from_book) + ' ' + item.from_chapter + ':' + item.from_verse;

            return this.linkBuilder.buildReferenceLink('cr', this.formData.bible, parentRef + '; ' + targetRef);
        }

        return this.linkBuilder.buildReferenceLink('cr', this.formData.bible, targetRef);
    },
    _formatCrossReference: function(item, format) {
        if(!Array.isArray(item.cross_references)) {
            return '';
        }

        // format overrides the user setting (paragraph footnotes force 'expand'); otherwise use the user's choice.
        var mode = format || this.app.normalizeCrossReferenceFormat(this.app.UserConfig.get('crossReferenceFormat'));
        var expand = (mode == 'expand') || (mode == 'auto' && item.cross_references.length > 7);
        var targetAttr = this.app._isTrue(this.app.configs.crossReferenceLinkNewTab) ? ' target="_blank"' : '';

        if(expand) {
            var bookRows = [];
            var lastBook = null;
            var currentRefs = null;

            for(var i = 0; i < item.cross_references.length; i++) {
                var cr = item.cross_references[i];
                var localeBook = this.app.getLocaleBookName(cr.to_book);

                if(lastBook !== localeBook) {
                    currentRefs = [];
                    bookRows.push({book: localeBook, refs: currentRefs});
                    lastBook = localeBook;
                }

                var reference = cr.to_chapter_start + ':' + cr.to_verse_start + this._formatCrossRefRange(cr);
                var href = this._crossReferenceTargetHref(item, cr, localeBook);
                currentRefs.push('<a href="' + bssUtils.escapeHtml(href) + '" class="bss_std_link bss_cross_reference_link" rel="noopener noreferrer"' + targetAttr + '>' + bssUtils.escapeHtml(reference) + ';</a>');
            }

            var openAllLink = this._buildOpenAllCrossReferencesLink(item.from_book, item.from_chapter, item.from_verse, item);

            var rows = bookRows.map(function(entry, index) {
                // add open all link to last row
                if(index === bookRows.length - 1 && openAllLink) {
                    entry.refs.push(openAllLink);
                }

                return '<tr><td class="bss_cr_book_name">' + bssUtils.escapeHtml(entry.book) + '</td><td>' + entry.refs.join('') + '</td></tr>';
            });

            return '<table class="bss_cross_references_table">' + rows.join('') + '</table>';
        }

        var references = [];

        for(var i = 0; i < item.cross_references.length; i++) {
            var cr = item.cross_references[i];
            var localeBook = this.app.getLocaleBookName(cr.to_book);
            var reference = localeBook + ' ' + cr.to_chapter_start + ':' + cr.to_verse_start + this._formatCrossRefRange(cr);
            var href = this._crossReferenceTargetHref(item, cr, localeBook);
            references.push('<a href="' + bssUtils.escapeHtml(href) + '" class="bss_std_link bss_cross_reference_link" rel="noopener noreferrer"' + targetAttr + '>' + bssUtils.escapeHtml(reference) + ';</a>');
        }

        var openAllLink = this._buildOpenAllCrossReferencesLink(item.from_book, item.from_chapter, item.from_verse, item);

        if(openAllLink) {
            references.push(openAllLink);
        }

        return references.join('');
    },
    _buildOpenAllCrossReferencesLink: function(bookId, chapter, verse, item) {
        if(!item) {
            var data = this.app.get('altResponseData') || this.get('resultsData') || {};
            var crossReferences = data.cross_references || {};

            if(typeof crossReferences != 'object' || Array.isArray(crossReferences)) {
                return '';
            }

            var idx = bookId + '_' + chapter + '_' + verse;
            item = crossReferences[idx] || null;
        }

        if(!item || !Array.isArray(item.cross_references) || item.cross_references.length < 2) {
            return '';
        }

        var rawRefs = [];

        // Include the originating ("from" / parent) reference first when enabled.
        if(this.app._isTrue(this.app.configs.crossReferenceLinkIncludeParent)) {
            rawRefs.push(this.app.getLocaleBookName(item.from_book) + ' ' + item.from_chapter + ':' + item.from_verse);
        }

        for(var i = 0; i < item.cross_references.length; i++) {
            var cr = item.cross_references[i];
            var localeBook = this.app.getLocaleBookName(cr.to_book);
            rawRefs.push(localeBook + ' ' + cr.to_chapter_start + ':' + cr.to_verse_start + this._formatCrossRefRange(cr));
        }

        // Always 'cr', with or without the parent reference - see _crossReferenceTargetHref().
        var href = this.linkBuilder.buildReferenceLink('cr', this.formData.bible, rawRefs.join('; '));
        var label = this.app.t('Open All');
        var targetAttr = this.app._isTrue(this.app.configs.crossReferenceLinkNewTab) ? ' target="_blank"' : '';

        return '<a href="' + bssUtils.escapeHtml(href) + '" class="bss_std_link bss_open_all bss_cross_reference_link" rel="noopener noreferrer"' + targetAttr + '>' + bssUtils.escapeHtml(label) + '</a>';
    },
    proccessSingleVerseReference: function(passage, verse) {
        var bookName = this.app.getLocaleBookName(passage.book_id, passage.book_name);
        var verseLink = this.linkBuilder.buildReferenceLink('p', this.formData.bible, bookName, verse.chapter, verse.verse);
        var chapterLink = this.linkBuilder.buildReferenceLink('p', this.formData.bible, bookName, verse.chapter);
        var contextLink = this.linkBuilder.buildReferenceLink('context', this.formData.bible, bookName, verse.chapter, verse.verse);

        var includeContextLinks = true;
        var passageClone = Object.assign({}, passage);

        if(this.renderStyle == 'verse_passage') {
            passageClone.chapter_verse_actual = verse.chapter + ':' + verse.verse;
        }

        if(!passage.single_verse && (passage.nav && !passage.nav.ccc || passage.chapter_verse.indexOf(':') == -1)) {
            includeContextLinks = false;
        }

        var crossReferencesLink = this._buildCrossReferencesToggleLink(passageClone);
        var wrapper = this._contextLinkWrapperTag();

        // verse.linksHtml = '<br /><small>'; // future use?

        var verseTitle = bssUtils.escapeHtml(this.app.t('Show this verse'));

        var html = '';
            html += '<a href="' + bssUtils.escapeHtml(verseLink) + '" title="' + verseTitle + '" class="bss_std_link">' + bssUtils.escapeHtml(bookName + ' ' + verse.chapter + ':' + verse.verse) + '</a>';

            if(includeContextLinks) {
                html += '&nbsp; <' + wrapper + '>' + this._buildContextLinkHtml(contextLink, 'Context', 'Show in context') + '</' + wrapper + '>';
                html += '&nbsp; <' + wrapper + '>' + this._buildContextLinkHtml(chapterLink, 'Chapter', 'Show full chapter') + '</' + wrapper + '>';
            }

            var shareLink = this.linkBuilder.buildPassageSignalLink('onShare', [this.selectedBible.module], passageClone);
            html += '&nbsp; <' + wrapper + '>' + this._buildContextLinkHtml(shareLink, 'Share') + '</' + wrapper + '>';

            var copyLink = this.linkBuilder.buildPassageSignalLink('onCopy', [this.selectedBible.module], passageClone);
            html += '&nbsp; <' + wrapper + '>' + this._buildContextLinkHtml(copyLink, 'Copy') + '</' + wrapper + '>';

            var addLink = this.linkBuilder.buildPassageSignalLink('onSessionVerseListAdd', [this.selectedBible.module], passageClone);
            html += '&nbsp; <' + wrapper + '>' + this._buildContextLinkHtml(addLink, 'Add to List') + '</' + wrapper + '>';

            if(
                (passage.single_verse || passage.verses_count == 1) && this.audioBibleEnabled(this.selectedBible.module, passageClone)
                || this.audioBibleEnabledVerse(this.selectedBible.module, passageClone)
            ) {
                var audioLink = this.linkBuilder.buildPassageSignalLink('onListen', [this.selectedBible.module], passageClone);
                html += '&nbsp; <' + wrapper + '>' + this._buildContextLinkHtml(audioLink, 'Listen') + '</' + wrapper + '>';
            }

            // Statistics
            if(this.app.statics.access.statistics) {
                var sl = this.linkBuilder.buildSignalLink('onStatistics', this.formData.bible, bookName, verse.chapter, verse.verse);
                html += '&nbsp; <' + wrapper + '>' + this._buildContextLinkHtml(sl, 'Statistics') + '</' + wrapper + '>';
            }

            if(crossReferencesLink) {
                html += '&nbsp; <' + wrapper + '>' + crossReferencesLink + '</' + wrapper + '>';
            }

        return html;
    },   
    _addWideAudioContainer: function(Container, passage) {
        if(!this.audioBibleEnabledWide('all', passage)) {
            return;
        }

        Container.createComponent({
            tag: 'tr', 
            components: [
                {tag: 'td', attributes: {colspan: this.bibleCount * this.passageColumnsPerBible}, 
                components: [
                    {kind: AudioContainer, enabled: true, bible: 'all', passage: passage}
                ]}
            ]
        });
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
