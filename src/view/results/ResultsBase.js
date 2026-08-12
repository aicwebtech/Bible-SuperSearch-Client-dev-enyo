var kind = require('enyo/kind');
var GridView = require('./GridView');
var ResultsList = require('./ResultsList');
var ResCom = require('./ResultsReadComponent');
var Signal = require('../../components/Signal');
var Pager = require('../../components/Pagers/ClassicPager');
// var Pager = require('../../components/Pagers/CleanPager');
var LinkBuilder = require('../../components/Link/LinkBuilder');
// var Nav = require('../../components/NavButtons/NavClassic');
var Nav = require('../../components/NavButtons/NavHtml');
var HoverDialog = require('../../components/dialogs/Hover');
var StrongsHoverDialog = require('../../components/dialogs/StrongsHover');
var utils = require('enyo/utils');
var bssUtils = require('../../lib/Utils');
var Ajax = require('enyo/Ajax');
var i18n = require('../../components/Locale/i18nComponent');

module.exports = kind({
    name: 'ResultsBase',
    classes: 'bss_results',
    bibles: [],
    biblesStr: null,
    multiBibles: false,
    firstBible: null,
    bibleCount: 1,
    isParagraphView: false,  // Indicates if render is a parargraph view
    newLine: '<br />',
    hasPaging: false,
    paging: null,
    linkBuilder: LinkBuilder,
    selectedBible: null, // Bible we're currently processing
    lastHoverIntentTarget: null,
    lastHoverTarget: null,
    lastHoverX: 0,
    lastHoverY: 0,
    navigationButtonsView: Nav,
    pagerView: Pager,
    showingCopyrightBottom: false,
    renderStyle: 'passage',
    _localeChangeRender: false,
    _configChangeRender: false,
    activeComponent: null,
    sideButtons: false,
    resultsShowing: true,
    specialResultsShowing: false,
    list: null,

    published: {
        resultsData: null,
        formData: null
    },

    handlers: {
        onFormResponseSuccess: 'handleFormResponse',
        onFormResponseError: 'handleFormError',
        onmouseover: 'handleHover',
        onmouseout: 'handleMouseOut',
        onLocaleChange: 'handleLocaleChange',
        onGlobalScroll: 'handleGenericReposition',
        onGlobalScrollEnd: 'handleGenericReposition',
        onResultsLinkTap: 'handleResultsLinkTap',
        ontap: 'handleClick',
        // onGlobalTap: 'handleClick'
    },

    components: [
        // {content: 'formatting buttons go here'},
        // {name: 'ResultsContainer'},
        {
            kind: Signal, 
            onFormResponseSuccess: 'handleFormResponse', 
            onFormResponseError: 'handleFormError', 
            onResultsPrint: 'handlePrint',
            onCrossReferences: 'handleCrossReferencesSignal',
            onkeyup: 'handleKey', // Keyboard events need to be handled by Signal per docs
            isChrome: true
        },
        {name: 'DialogsContainer', components: [
            {name: 'StrongsHover', kind: StrongsHoverDialog}
        ]},
        {
            name: 'SideSwipeButtons',
            isChrome: true,
            showing: true,
            classes: 'bss_side_swipe_button_container',

            components: [
                {
                    name: 'SideButtonPrev', 
                    classes: 'bss_side_swipe_button bss_float_left', 
                    content: '&lt;', 
                    allowHtml: true, 
                    ontap: 'clickPrev'
                },
                {
                    name: 'SideButtonNext', 
                    classes: 'bss_side_swipe_button bss_float_right', 
                    content: '&gt;', 
                    allowHtml: true, 
                    ontap: 'clickNext'
                },
            ]
        }
    ],

    create: function() {
        this.inherited(arguments);
        this.pagerView = this.app.getSubControl('Pager');
    },
    rendered: function() {
        this.inherited(arguments);
        
        var e = {
            localeChange: this._localeChangeRender,
            configChange: this._configChangeRender
        };

        this.bubble('onResultsRendered', e);
        this._localeChangeRender = false;
        this._configChangeRender = false;

        this.$.ResultsList && this.$.ResultsList.scrollToItemDelay();
    },
    formDataChanged: function(was, is) {
        this.bibles = [];
        this.firstBible = null;

        for(i in this.formData.bible) {
            var mod = this.formData.bible[i];

            if(mod == 0 || mod == '0' || mod == null) {
                continue;
            }

            if(typeof this.app.statics.bibles[mod] == 'undefined') {
                continue;
            }

            if(this.firstBible === null) {
                this.firstBible = mod;
            }

            this.bibles.push(mod);
        }

        this.bibleCount = this.bibles.length;
        this.biblesStr = this.bibles.join(',');
        this.multiBibles = (this.bibleCount > 1) ? true : false;
    },
    resultsDataChanged: function(was, is) {
        this.hasPaging = false;
        this.paging = null;

        if(is && is.paging && is.paging.last_page) {
            this.hasPaging = true;
            this.paging = is.paging;
        }
    },
    renderResults: function() {
        this.destroyClientControls();
        this.beforeRender();

        var resultsData = this.get('resultsData'),
            formData = this.get('formData');

        if(!resultsData) {
            return;
        }

        if(!Array.isArray(resultsData.results)) {
            this.log('Error: results are not an array');
            return;
        }

        this.preRenderList();
        
        this.app.debug && this.log('Rendering Results!');
        this.renderPager(true);
        this.renderList();

        this.renderHeader();
        this.renderTopPlaceholder();

        resultsData.results.forEach(function(passage, idx, arr) {
            this.renderPassage(passage, idx, arr);
        }, this);

        this.renderFooter();
        this.renderPager(false);
        // this.$.ResultsContainer.render();

        this.app.debug && this.log('showingCopyrightBottom', this.showingCopyrightBottom);

        if(!this.showingCopyrightBottom) {
            this.app.debug && this.log('about to renderCopyrightBottom');
            this.renderCopyrightBottom();
        }

        this.render();
        this.populateTopPlaceholder();
        this.determineActiveComponent();
        this.afterRender();
    },
    beforeRender: function() {
        // hook called before rendering
    },
    afterRender: function() {

    },
    renderPassage: function(passage, idx, arr) {
        
        var resultsFilter = this.app.get('_resultsFilter') || null;

        if(resultsFilter) {
            this.log('resultsFilter', resultsFilter, passage);
            
            if(resultsFilter.b && resultsFilter.b != passage.book_id) {
                return;
            }
            
            if(resultsFilter.cv != passage.chapter_verse) {
                return;
            }
        }
        
        this.showingCopyrightBottom = false;

        var firstPage = !this.paging || this.paging.current_page == 1;

        // The 'Original Verse' / 'Cross References' headings only describe the results when the
        // originating verse was actually pulled in alongside the cross reference(s).  With
        // crossReferenceLinkIncludeParent disabled the results are cross references only, so the
        // headings are omitted (the view is still flagged as a cross reference view so that it
        // scrolls to the top of the Bible text).
        var crossReferenceHeadings = this.app._crossReferenceView && this.app._isTrue(this.app.configs.crossReferenceLinkIncludeParent);

        if(crossReferenceHeadings && firstPage && !this.app.UserConfig.get('copy')) {
            if(idx == 0) {
                this.createComponent({
                    kind: i18n,
                    tag: 'h3',
                    classes: 'bss_original_verse_heading',
                    content: 'Original Verse'
                });
            } else if(idx == 1) {
                this.createComponent({
                    kind: i18n,
                    tag: 'h3',
                    classes: 'bss_cross_references_heading',
                    content: arr.length > 2 ? 'Cross References' : 'Cross Reference'
                });
            }
        }

        if(passage.single_verse && this.multiBibles) {
            this.renderSingleVerseParallelBible(passage);
        }
        else if(passage.single_verse && !this.multiBibles) {
            this.renderSingleVerseSingleBible(passage);
        }
        else if(!passage.single_verse && !this.multiBibles) {
            this.renderPassageSingleBible(passage);
        }
        else {
            this.renderPassageParallelBible(passage);
        }
    },

    renderTopPlaceholder: function() {},                    // Must implement on child kind!
    renderSingleVerseSingleBible: function(passage) {},     // Must implement on child kind!
    renderSingleVerseParallelBible: function(passage) {},   // Must implement on child kind!
    renderPassageParallelBible: function(passage) {},       // Must implement on child kind!
    renderPassageSingleBible: function(passage) {},         // Must implement on child kind!

    signalVerseShowing: function(book, chapter, verse) {
        this.app.get('resultsShowing').push({book: book, chapter: chapter, verse: verse, showing: true});
        Signal.send('onShowingChange', {book: book, chapter: chapter, verse: verse, showing: true});
    },

    renderCopyrightBottom: function() {
        this.createComponent({
            tag: 'hr'
        });

        var Container = this.createComponent({
            name: 'CopyrightFooter',
            tag: 'table',
            classes: 'biblesupersearch_render_table bss_copyright_footer'
        }).createComponent({
            tag: 'tr'
        });

        this._renderCopyRightBottomHelper(Container);
    },
    _renderCopyRightBottomHelper: function(Container) {
        for(i in this.bibles) {
            var mod = this.bibles[i];

            if(typeof this.app.statics.bibles[mod] == 'undefined') {
                continue;
            }
            
            var bible_info = this.app.statics.bibles[mod];
            
            var components = [
                {
                    tag: 'h5', 
                    content: bible_info.name + ' (' + bible_info.shortname + ')', 
                    ontap: 'handleBibleInfoTap', 
                    module: mod, 
                    owner: this,
                    classes: 'bss_clickable bss_center'
                },
                {
                    kind: i18n, 
                    content: bible_info.copyright_statement, 
                    allowHtml: true, 
                    attributes: {dir: 'auto'},
                }
            ];

            if(bible_info.research) {
                components.push({tag: 'br'});
                components.push({tag: 'br'});
                components.push({kind: i18n, content: 'This Bible is provided for research purposes only.'});
            }

            if(bible_info.tts_ai) {
                components.push({tag: 'br'});
                components.push({tag: 'br'});
                components.push({
                    kind: i18n, 
                    content: 'Audio Bible may have been generated by using AI, and not an actual human voice.',
                });
            }

            Container.createComponent({
                tag: 'td',
                components: components,
                classes: 'bss_copyright_statement',
                attributes: {colspan: this.passageColumnsPerBible}
            });
        }

        this.showingCopyrightBottom = true;
    },
    handleBibleInfoTap: function(inSender, inEvent) {
        Signal.send('onBibleInfo', {module: inSender.get('module')});
    },
    _getBibleDisplayName: function(bible) {
        if(this.bibles.length <= 1) {
            return bible.name;
        }
        
        return bible.name.length > 30 ? bible.shortname : bible.name;
    },

    renderHeader: function() {}, // Called before results are rendered, not required
    renderFooter: function() {}, // Called after results are rendered, not required
    
    preRenderList: function() {
        var resultsData = this.get('resultsData');
        this.list = null;

        if(!this.app.configs.resultsList) {
            return false;
        }

        if(resultsData.list && resultsData.list.length > 0) {
            this.list = resultsData.list;
            this.app.set('resultsListCacheId', resultsData.hash);
            this.app.set('resultsListPage', resultsData.paging.current_page || 1);
            this.app.set('resultsList', resultsData.list);
        } else if(this.app.get('resultsListCacheId') == this.app.get('resultListRequestedCacheId')) {
            this.list = this.app.get('resultsList');
        }
    },
    renderList: function() {
        if(!this.list || this.list.length == 0) {
            return;
        }

        this.createComponent({
            kind: ResultsList,
            name: 'ResultsList',
            list: this.list
        });
    },

    handleResultsLinkTap: function(s, e) {
        var t = this;

        var bible = this.app.getSelectedBibles();
        var bible = (bible) ? bible.filter(function(b) {return b != 0 && b != null}) : [];

        var fd = {
            bible: JSON.stringify(bible),
            reference: e.item.book + 'B ' + e.item.chapter + ':' + e.item.verse,
            search: this.app.getFormSearch(),
            search_type: this.app.getFormFieldValue('search_type') || 'or',
            highlight: true,
            markup: 'raw'
        };

        var ajax = new Ajax({
            url: this.app.configs.apiUrl,
            cacheBust: this.app.configs.disableCache,
            method: 'GET'
        });

        this.app.set('ajaxLoadingDelay', 100);

        ajax.go(fd); // for GET
        ajax.response(this, function(s, r) {
            t.app.set('ajaxLoadingDelay', false);
            t.app.set('altResponseData', r);
            t.populateTopPlaceholder();

            // Scroll to tapped item
            if(t.app.configs.resultsListClickScroll) {
                t.$.ResultsList.scrollToItem();
            }
        });

        ajax.error(this, function(s, r) {
            t.app.set('ajaxLoadingDelay', false);

            try {
                var response = JSON.parse(s.xhrResponse.body);
            }
            catch (error) {
                this.app.displayInitError();
                this.errorHandle && this.errorHandle();
                return;
            }

            if(response.error_level == 4) {
                // actual error, do something?
            }
            else {
                // Treat like success
                t.app.set('altResponseData', response);
                t.populateTopPlaceholder();

                // Scroll to tapped item
                if(t.app.configs.resultsListClickScroll) {
                    t.$.ResultsList.scrollToItem();
                }
            }
        });
    },
    processText: function(verse) {
        return verse.text;
    },
    processPassageReference: function(passage) {

    },
    processVerseReference: function(verse) {
        // Is this needed??
    },
    processVerseVerse: function(verse) {
        return verse.verse;
    },
    processSingleVerseContent: function(passage, verse) {
        var ref = this.proccessSingleVerseReference(passage, verse);
        return this.processAssembleSingleVerse(ref, verse);
    },
    proccessSingleVerseReference: function(passage, verse) {
        var bookName = this.app.getLocaleBookName(passage.book_id, passage.book_name);
        // Reference is concatenated into allowHtml content downstream, so escape the API-derived parts.
        return bssUtils.escapeHtml(bookName + ' ' + verse.chapter + ':' + verse.verse);
    },
    processPassageVerseContent: function(passage, verse) {
        var ref = this.proccessPassageVerseReference(passage, verse);
        return this.processAssemblePassageVerse(ref, verse);
    },
    proccessPassageVerseReference: function(passage, verse) {
        if(this.renderStyle == 'verse_passage') {
            return this.proccessSingleVerseReference(passage, verse);
        }

        return bssUtils.escapeHtml(verse.verse);
    },
    processAssembleSingleVerse: function(reference, verse) {
        return this.processAssembleVerse(reference, verse);
    },
    processAssemblePassageVerse: function(reference, verse) {
        return this.processAssembleVerse(reference, verse);
    },
    processAssembleVerse: function(reference, verse) {
        return reference + ' ' + this.processText(verse.text);
    },
    
    // Adds highlighting / strongs / italics / red letter when nessessary
    processText: function(text) {
        // red letter - ERROR - using <> for red letter will COLLIDE with highlighting which sends back HTML!
        // U+2039, U+203A Single angle quotation marks (NOT <>)
        if(this.app.UserConfig.get('red_letter')) {
            text = text.replace(/‹/g, '<span class="bss_red_letter">');
            text = text.replace(/›/g, "</span>");
        }
        else {
            text = text.replace(/[‹›]/g, '');
        }

        // ASV hack - ASV text has {{Selah or {Selah}
        // (I confirmed in a print ASV that this is original to the text)
        // We compensate for this here by using placeholders for the curly brackets
        text = text.replace(/\{\{/g, '(LCB)(LCB)');
        text = text.replace(/\{([A-Za-z<>/ ]+)\}/g, '(LCB)$1(RCB)');

        // strongs
        if(this.app.UserConfig.get('strongs')) {
            text = text.replace(/\{/g, "<sup>");
            text = text.replace(/\}/g, "</sup>");
            text = text.replace(/[GHgh][0-9]+/g, utils.bind(this, function(match, offset, string) {
                // This link not working for a URL that ends in a file (ie biblesupersearch.html)
                var url = '#/strongs/' + this.biblesStr + '/' + match;

                if(this.getStrongsOpenClick()) {
                    return '<a class="strongs" href="' + url + '" onclick="return false;">' + match + '</a>';
                } else {
                    return '<a class="strongs" href="' + url + '">' + match + '</a>';
                }
            }));
        }
        else {
            text = text.replace(/\} \{/g, '');
            text = text.replace(/\{[^\}]+\}/g, '');
        }

        // Now that we're done with Strong's, we replace our placeholders with curly brackets
        text = text.replace(/\(LCB\)/g, '{');
        text = text.replace(/\(RCB\)/g, '}');

        // italics
        if(this.app.UserConfig.get('italics')) {
            text = text.replace(/\[/g, '<i>');
            text = text.replace(/\]/g, "</i>");
        }
        else {
            text = text.replace(/[\[\]]/g, '');
        }

        // higlight
        if(this.app.UserConfig.get('highlight')) {
            // do nothing
        }
        else {
            text = text.replace(/\<b\>/g, '');
            text = text.replace(/\<\/b\>/g, '');            
            text = text.replace(/\<em\>/g, '');
            text = text.replace(/\<\/em\>/g, '');            
            text = text.replace(/\<strong\>/g, '');
            text = text.replace(/\<\/strong\>/g, '');
        }

        text = text.replace('¶ ', '');
        // text = text.replace(/\s+([.,?!;])/, '$1');
        return text;
    },
    isNewParagraph: function(verse) {
        if(!this.isParagraphView) {
            return false;
        }

        if(verse.verse == 1) {
            return false;
        }

        if(verse.italics && verse.italics.indexOf('#') === 0) {
            return true; // Ugly 3.0 format, should be changed in 4.0
        }

        if(verse.text.indexOf('¶') === 0) {
            return true;
        }

        return false;
    },
    _createContainer: function(passage, name) {
        return this.createComponent({
            kind: ResCom,
            tag: 'table',
            name: name || null,
            passage: passage || null,
            // attributes:{border: 1},
            classes: 'biblesupersearch_render_table'
        });
    },
    getStrongsOpenClick: function() {
        var strongsOpenClick = this.app.configs.strongsOpenClick;

        switch(strongsOpenClick) {
            case 'mobile':
                strongsOpenClick = this.app.client.isMobile;
                break;
            case 'always':
                strongsOpenClick = true;
                break;
            case 'none':
            default:
                strongsOpenClick = false;
                break;
        }

        return strongsOpenClick;
    },
    watchRenderable: function(pre, cur, prop) {
        this.renderResults();
    },
    watchFormatable: function(pre, cur, prop) {

    },
    renderPager: function(includeTotals) {
        if(!this.hasPaging) {
            return;
        }

        includeTotals = includeTotals || false;
        var name = includeTotals ? 'Pager_1' : 'Pager_2';

        if(this.$[name]) {
            return;
        }

        this.createComponent({
            kind: this.pagerView,
            name: name,
            currentPage: this.paging.current_page,
            lastPage: this.paging.last_page,
            perPage: this.paging.per_page,
            totalResults: this.paging.total,
            cacheHash: this.resultsData.hash,
            formData: this.formData,
            includeTotals: includeTotals
        });
    },
    selectBible: function(mod) {
        this.selectedBible = (typeof this.app.statics.bibles[mod] == 'undefined') ? null : this.app.statics.bibles[mod];
        return this.selectedBible;
    },
    getSelectedBibleClasses: function() {
        if(!this.selectedBible) {
            return null;
        }

        var classes = [];

        classes.push('bss_bible_text');
        classes.push('bss_bible_' + this.selectedBible.module);
        classes.push(this.selectedBible.rtl ? 'bss_rtl' : 'bss_ltr');

        return classes.join(' ');
    },
    handleHover: function(inSender, inEvent) {
        var target = inEvent.target;
        var hoverIntent = false;
        var x = inEvent.x;
        var y = inEvent.y;
        var lastX = this.lastHoverX;
        var lastY = this.lastHoverY;
        var lastTarget = this.lastHoverTarget;
        var thres = 50;
        var hoverIntentThres = this.app.configs.hoverDelayThreshold;
        var strongsOpenClick = this.getStrongsOpenClick();
        // var strongsOpenClick = false; // debugging ONLY as handleHover and handleClick with collide if both are active!

        // this.app.debug && this.log('hoverIntentThres', hoverIntentThres, strongsOpenClick);

        target.bssType = null;

        if(target.tagName == 'A' && target.className == 'strongs') {
            target.bssType = 'strongs';
        }

        if(target.bssType == 'strongs') {
            if(strongsOpenClick) {
                return; // If strongs is opened via click, don't open via hover!
            }
            this.$.StrongsHover.cancelHide();
        }

        if((
            (x - thres <= lastX) && 
            (x + thres >= lastX) && 
            (y - thres <= lastY) && 
            (y + thres >= lastY)
        )) {
            // return;
        } 

        if(target != this.lastHoverTarget) {
            this.lastHoverTarget = target;
            this.lastHoverX = x;
            this.lastHoverY = y;

            var mouseX = inEvent.clientX; //inEvent.screenX + inEvent.offsetX;
            var mouseY = inEvent.clientY; // + inEvent.offsetY;

            if(target.bssType == 'strongs') {
                this.app.debug && this.log('raw mouse', mouseX, mouseY);
            }

            if(this.app.clientBrowser == 'IE') {
                // apparently, do nothing - seems to position correctly?
            }
            else {
                mouseX += window.scrollX;
                mouseY += window.scrollY;
            }

            var parentWidth  = inEvent.target.parentNode.offsetWidth;
            var parentHeight = inEvent.target.parentNode.offsetHeight;

            // Experimental!
            // If user mouses off of Strongs link, close dialog
            // make this a config?
            if(!strongsOpenClick && lastTarget && lastTarget.bssType == 'strongs') {
                // this.$.StrongsHover.set('showing', false);
                this.$.StrongsHover.hideDelay();
            }

            var t = this;
            
            setTimeout(function() {
                if(target != t.lastHoverTarget) {
                    return;
                }

                if(target.bssType == 'strongs') {
                    if(strongsOpenClick) {
                        return; // If strongs is opened via click, don't open via hover!
                    }

                    // t.log('mouseX raw', inEvent.clientX);
                    // t.log('mouseX', mouseX);
                    // t.log('mouseY raw', inEvent.clientY);
                    // t.log('mouseY', mouseY);
                    // t.log('target.innerHTML', target.innerHTML);
                    // t.log('parentWidth', parentWidth);
                    // t.log('parentHeight', parentHeight);

                    // this.hideHoverDialogs(); // uncomment in production
                    t.$.StrongsHover && t.$.StrongsHover.displayPosition(mouseX, mouseY, target.innerHTML, parentWidth, parentHeight, false);
                }
            }, hoverIntentThres);
        }
    },
    handleMouseOut: function(inSender, inEvent) {
        if(inSender === this) {
            this.hideHoverDialogs();
        }
    },
    handleClick: function(inSender, inEvent) {
        var strongsOpenClick = this.getStrongsOpenClick();
        var target = inEvent.target;

        if(target.tagName == 'A' && target.className == 'bss_top_placeholder_hide') {
            this.hideTopPlaceholder();
        }

        if(target.tagName == 'A' && target.className && target.className.indexOf('bss_cross_reference_link') !== -1) {
            var src = inEvent.srcEvent || inEvent;   // srcEvent is the raw DOM event (also used by the strongs branch)
            var newTab = this.app._isTrue(this.app.configs.crossReferenceLinkNewTab);
            var modified = !!(src.ctrlKey || src.metaKey || src.shiftKey || src.button === 1);

            if(!newTab && !modified) {
                // Same-window open: stamp the current view's hash onto the entry we're leaving
                // (before the browser follows the fragment link) so Back can restore it.
                var form = this.app.getActiveForm();
                form && form.syncHash && form.syncHash();
            }
        }

        if(strongsOpenClick && target.tagName == 'A' && target.className == 'strongs') {
            inEvent.preventDefault();
            // inEvent.stopPropagation();
            inEvent.bubbling = false;

            this.app.debug && this.log('raw mouse', inEvent);

            // var mouseX = Math.round(inEvent.clientX); 
            // var mouseY = Math.round(inEvent.clientY); 

            var mouseX = Math.round(inEvent.srcEvent.clientX); 
            var mouseY = Math.round(inEvent.srcEvent.clientY); 

            this.app.debug && this.log('raw mouse client', mouseX, mouseY);
            // this.log('raw mouse srcEvent client', inEvent.srcEvent.clientX, inEvent.srcEvent.clientY);

            if(this.app.clientBrowser == 'IE') {
                // apparently, do nothing - seems to position correctly?
            }
            else {
                mouseX += window.scrollX
                mouseY += window.scrollY;
            }

            var parentWidth  = inEvent.target.parentNode.offsetWidth;
            var parentHeight = inEvent.target.parentNode.offsetHeight;
            
            // this.log('mouseX raw', inEvent.clientX);
            // this.log('mouseX', mouseX);
            // this.log('mouseY raw', inEvent.clientY);
            // this.log('mouseY', mouseY);
            // this.log('target.innerHTML', target.innerHTML);
            // this.log('parentWidth', parentWidth);
            // this.log('parentHeight', parentHeight);

            // this.hideHoverDialogs(); // uncomment in production
            this.$.StrongsHover && this.$.StrongsHover.displayPosition(mouseX, mouseY, target.innerHTML, parentWidth, parentHeight, true);
            this.app.debug && this.$.StrongsHover && this.log('displaying Strongs dialog');
            return true;
        }

        // no longer relavant
        if(inSender.name != 'DialogsContainer') {
            // this.hideHoverDialogs();
        }
    },
    handleKey: function(inSender, inEvent) {
        if(inEvent.code == 'Escape') {
            this.hideHoverDialogs();
        }

        // this.waterfall('onKeyWaterfall', inEvent);
        //this.waterfall('onType', inEvent);
        // return false;
    },
    hideEverything: function() {
        this.hideHoverDialogs();
        Signal.send('onHideEverything');
    },
    hideHoverDialogs: function() {
        this.$.StrongsHover.set('showing', false);
    },
    handlePrint: function(inSender, inEvent) {
        if(this.app.UserConfig.get('copy')) {
            this.app.UserConfig.set('copy', false);

            var to = setTimeout( function() {
                Signal.send('onResultsPrint');
            }, 500);

            return;
        }

        var resultsHtml = this.hasNode().innerHTML,
            cssPath = this.app.get('rootDir') + '/biblesupersearch.css',
            title = this.app.get('bssTitle'),
            curURL = window.location.href;

        // bssTitle and the URL are derived from user-supplied search input, so they must be
        // escaped for their respective contexts before being written into the print document.
        // safeCssPath is emitted as a double-quoted HTML attribute (<link href="...">), which is
        // the correct context for escapeHtml - do not place it in a CSS url('...') string.
        var safeTitle = bssUtils.escapeHtml(title),
            safeCssPath = bssUtils.escapeHtml(cssPath),
            // JSON.stringify yields a safely-quoted/escaped JS string literal; additionally escape
            // '<' so a '</script>' sequence in the URL cannot prematurely terminate the script tag.
            safeUrl = JSON.stringify(curURL).replace(/</g, '\\u003c');

        var html = '';
            html += '<html>\n';
            html +=     '<head>\n';
            html +=         '<title>' + safeTitle + '</title>\n';
            html +=         '<link rel="stylesheet" type="text/css" href="' + safeCssPath + '">\n';
            html +=     '</head>\n';
            html +=     '<body>\n';
            html +=         '<div class="biblesupersearch_print">\n';
            html +=             resultsHtml + '\n';
            html +=         '</div>\n';
            html +=     '</body>\n';
            html +=     '<script>\n';
            html +=         'history.replaceState(history.state, "", ' + safeUrl + ');\n'; // Force the displayed URL to that of the parent page
            html +=         'window.print();\n';                                            // After html is rendered, this triggers the print dialog
            html +=     '</script>\n';
            html += '</html>\n';

        var winName = 'printWindow-' + new Date().getTime(),
            printWindow = window.open('about:blank', winName);

        if(printWindow) {
            printWindow.document.write(html);
        }
        else {
            alert('Could not open print friendly window.  Is your browser blocking popups?');
        }
    },
    handleGenericReposition: function(inSender, inEvent) {
        this.determineActiveComponent();
    },
    determineActiveComponent: function() {
        var comp = this.getClientControls(),
            visible = comp.filter(function(item) {
                return item.isVisible && item.isVisible();
            });

        if(this.activeComponent) {
            this.activeComponent.set('active', false);
            this.activeComponent = null;
        }

        if(visible.length == 1 || this.hasPaging && visible.length > 0) {
            this.activeComponent = visible[0];
            this.activeComponent.set('active', true);
            // this.app.debug && this.log('activeComponent', this.activeComponent.get('name'));
        }
    },
    handleLocaleChange: function(inSender, inEvent) {
        this._localeChangeRender = true;
        this.renderResults();
    },
    clickNext: function() {
        if(!this.sideButtons) {
            return; // buttons not showing, bail
        }

        this.app.debug && this.log();
        this.activeComponent.waterfall('onAutoClick', {button: '_next'});
        Signal.send('onAutoClick', {button: '_next'});
    },
    clickPrev: function() {
        if(!this.sideButtons) {
            return; // buttons not showing, bail
        }

        this.app.debug && this.log();
        this.activeComponent.waterfall('onAutoClick', {button: '_prev'});
        Signal.send('onAutoClick', {button: '_prev'});
    },
    sideButtonsChanged: function(was, is) {
        var isfr = is; // is for real

        // Prevent racing condition between one componet turning buttons off and another turning them on
        if(this.activeComponent && this.activeComponent.get('sideButtons')) {
            isfr = true;
            this.sideButtons = isfr;
        }

        if(isfr == was) {
            return; // if no change, do nothing further
        }

        this.$.SideSwipeButtons.addRemoveClass('bss_fadein', !!isfr);
    },
    // Builds a context link (Copy, Share, Listen, etc) anchor, rendered as an
    // icon button when contextLinksAsButtons is enabled and the label has an icon.
    // label is the translation key; title (optional) is a different translation
    // key for the title/aria-label attributes (defaults to label).
    _buildContextLinkHtml: function(href, label, title) {
        var icon = this.app.contextLinkIcon(label);
        var classes = icon ? 'bss_std_link bss-material-icons bss_icon bss_context_icon' : 'bss_std_link';
        var titleText = bssUtils.escapeHtml(this.app.t(title || label));
        var text = bssUtils.escapeHtml(icon || this.app.t(label));

        return '<a href="' + bssUtils.escapeHtml(href) + '" title="' + titleText + '" aria-label="' + titleText + '" class="' + classes + '">' + text + '</a>';
    },
    // Tag wrapping context links: plain inline when shown as icon buttons,
    // superscript when shown as text links
    _contextLinkWrapperTag: function() {
        return this.app.configs.contextLinksAsButtons ? 'span' : 'sup';
    },
    audioBibleEnabled: function(bible, passage) {
        // :todo future check Bible / passage for audio availability (via API)

        if(!this.app.configs.audioBible || this.app.configs.audioBible == 'false') {
            return false;
        }

        if(this.app.configs.audioBibleApi == 'biblesupersearch') {
            if(bible == 'all') {
                return true;
            } else {
                var bible_info = this.app.statics.bibles[bible];
                return bible_info ? bible_info.audio_enable : false;
            }
        } else {
            return true;
            //: todo - UI config to enable / disable audio per Bible
        }
    },
    audioBibleEnabledWide: function(bible, passage) {
        if(!this.audioBibleEnabled(bible, passage)) {
            return false;
        }

        var config = this.audioBibleDisplayConfigs();

        if(config.display == 'wide') {
            return true;
        }

        if(config.display != 'threshold') {
            return false;
        }

        return (this.bibleCount >= config.threshold) ? true : false;
    },
    audioBibleEnabledNarrow: function(bible, passage) {
        if(!this.audioBibleEnabled(bible, passage)) {
            return false;
        }

        var config = this.audioBibleDisplayConfigs();

        if(config.display == 'narrow') {
            return true;
        }

        if(config.display != 'threshold') {
            return false;
        }

        return (this.bibleCount < config.threshold) ? true : false;
    },
    audioBibleEnabledVerse: function(bible, passage) {
        if(!this.audioBibleEnabled(bible, passage)) {
            return false;
        }

        var bible_info = this.app.statics.bibles[bible];

        if(bible_info && (bible_info.audio_structure == 'both' || bible_info.audio_structure == 'verses')) {
            return true;
        }

        return false;
    },
    audioBibleEnabledChapter: function(bible, passage) {
        if(!this.audioBibleEnabled(bible, passage)) {
            return false;
        }

        if(this.renderStyle == 'passage') {
            return true;
        }

        var bible_info = this.app.statics.bibles[bible];

        if(bible_info && (bible_info.audio_structure == 'both' || bible_info.audio_structure == 'chapters')) {
            return true;
        }

        return false;
    },
    audioBibleDisplayConfigs: function() {
        switch(this.app.configs.audioBibleDisplay) {
            case 'narrow':
            case 'wide':
            case 'threshold':
                var display = this.app.configs.audioBibleDisplay;
                break;
            default:
                var display = 'threshold';
        }
        
        var threshold = parseInt(this.app.configs.audioBibleDisplayThreshold) || 3;

        return {display: display, threshold: threshold};
    },
    handleCrossReferencesSignal: function(s, e) {
        // do nothing
    }
});
