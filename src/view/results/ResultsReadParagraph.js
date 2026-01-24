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

        var bookName = this.app.getLocaleBookName(pd.book_id, pd.book_name);
        var refContent = ''; 

        if(!this.multiBibles) {
            var shareLink = this.linkBuilder.buildPassageSignalLink('onShare', this.formData.bible, pd);
            refContent += '<a href="' + shareLink + '" title="' + this.app.t('Share') + '" class="bss_std_link">' + this.app.it('Share') + '</a> &nbsp;';
            var copyLink = this.linkBuilder.buildPassageSignalLink('onCopy', this.formData.bible, pd);
            refContent += '<a href="' + copyLink + '" title="' + this.app.t('Copy') + '" class="bss_std_link">' + this.app.it('Copy') + '</a> &nbsp; ';
            
            if(this.audioBibleEnabled(this.formData.bible, pd)) {
                var listenLink = this.linkBuilder.buildPassageSignalLink('onListen', this.formData.bible, pd);
                refContent += '<a href="' + listenLink + '" title="' + this.app.t('Listen') + '" class="bss_std_link">' + this.app.it('Listen') + '</a> &nbsp;';  
            }
        }

        if(this.app.statics.access.statistics) {
            var sl = this.linkBuilder.buildSignalLink('onStatistics', this.formData.bible, bookName, pd.chapter_verse);
            refContent += '<a href="' + sl + '" title="' + this.app.t('Statistics') + '" class="bss_std_link">' + this.app.t('Statistics') + '</a> &nbsp;';
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
                            {tag: 'sup', content: refContent, allowHtml: true},
                        ]},
                        {
                            kind: AudioContainer, 
                            enabled: this.audioBibleEnabledNarrow(this.formData.bible, pd),
                            bible: this.formData.bible, 
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
                bibleContent += '<a href="' + shareLink + '" title="' + this.app.t('Share') + '" class="bss_std_link">' + this.app.it('Share') + '</a> &nbsp;';
                copyLink = this.linkBuilder.buildPassageSignalLink('onCopy', [module], pd);
                bibleContent += '<a href="' + copyLink + '" title="' + this.app.t('Copy') + '" class="bss_std_link">' + this.app.it('Copy') + '</a> &nbsp;';   
                
                if(this.audioBibleEnabled(module, pd)) {
                    listenLink = this.linkBuilder.buildPassageSignalLink('onListen', [module], pd);
                    bibleContent += '<a href="' + listenLink + '" title="' + this.app.t('Listen') + '" class="bss_std_link">' + this.app.it('Listen') + '</a> &nbsp;';  
                }
                
                Container.$.BibleRow.createComponent({
                    tag: 'th',
                    classes: 'bss_top_align',
                    attributes: {colspan: this.passageColumnsPerBible},
                    components: [
                        {content: this._getBibleDisplayName(bible_info)},
                        {components: [
                            {tag: 'sup', content: bibleContent, allowHtml: true}
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

        this._addNavButtons(Container, pd);
    },
    // Multi verse, single Bible
    renderPassageSingleBible: function(pd) {
        this.renderPassageParallelBible(pd);
    }
});
