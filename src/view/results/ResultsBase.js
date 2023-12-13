var kind = require('enyo/kind');
var GridView = require('./GridView');
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
var i18n = require('../../components/Locale/i18nComponent');

module.exports = kind({
    name: 'ResultsBase',
    classes: 'results',
    bibles: [],
    biblesStr: null,
    multiBibles: false,
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
            onkeyup: 'handleKey', // Keyboard events need to be handled by Signal per docs
            isChrome: true
        },
        {name: 'DialogsContainer', components: [
            {name: 'StrongsHover', kind: StrongsHoverDialog}
        ]}
    ],

    // observers: [
    //     // {method: 'watchRenderable', path: ['app.UserConfig.copy', 'app.UserConfig.paragraph']}
    //     {method: 'watchRenderable', path: ['app.UserConfig.copy']}
    // ],

    // // observers not working?  why?
    // bindings: [
    //     {from: 'app.UserConfig.copy', to: 'uc.copy', transform: function(value, dir) {
    //         console.log('the here');
    //         this.renderResults();
    //     }},
    //     {from: 'app.UserConfig.paragraph', to: 'uc.paragraph', transform: function(value, dir) {
    //         console.log('the par');
    //         this.renderResults();
    //     }}
    // ],

    create: function() {
        this.inherited(arguments);
        // this.formViewProcess(this.formView);

        this.pagerView = this.app.getSubControl('Pager');

        // if(this.app.pagerView) {
        //     this.pagerView = this.app.pagerView;
        // }

        // this.navigationButtonsView = this.app.getSubControl('');
    },
    rendered: function() {
        this.inherited(arguments);
        
        var e = {
            localeChange: this._localeChangeRender,
        };

        this.bubble('onResultsRendered', e);
        this._localeChangeRender = false;
    },
    formDataChanged: function(was, is) {
        this.bibles = [];

        for(i in this.formData.bible) {
            var module = this.formData.bible[i];

            if(typeof this.app.statics.bibles[module] == 'undefined') {
                continue;
            }

            this.bibles.push(module);
        }

        this.bibleCount = this.bibles.length;
        this.biblesStr = this.bibles.join(',');
        this.multiBibles = (this.bibleCount > 1) ? true : false;
    },
    resultsDataChanged: function(was, is) {
        this.hasPaging = false;
        this.paging = null;

        // if(is && is.paging && is.paging.last_page && is.paging.last_page > 1) {
        if(is && is.paging && is.paging.last_page) {
            this.hasPaging = true;
            this.paging = is.paging;
        }
    },
    renderResults: function() {
        this.destroyClientControls();

        var resultsData = this.get('resultsData'),
            formData = this.get('formData');

        if(!resultsData) {
            return;
        }

        if(!Array.isArray(resultsData.results)) {
            this.log('Error: results are not an array');
            return;
        }
        
        this.app.debug && this.log('Rendering Results!');
        this.renderPager(true);
        this.renderHeader();

        resultsData.results.forEach(function(passage) {
            this.renderPassage(passage);
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
    },
    renderPassage: function(passage) {        
        this.showingCopyrightBottom = false;

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

    renderSingleVerseSingleBible: function(passage) {},     // Must implement on child kind!
    renderSingleVerseParallelBible: function(passage) {},   // Must implement on child kind!
    renderPassageParallelBible: function(passage) {},       // Must implement on child kind!
    renderPassageSingleBible: function(passage) {},         // Must implement on child kind!

    renderCopyrightBottom: function() {
        this.createComponent({
            tag: 'hr'
        });

        var Container = this.createComponent({
            name: 'CopyrightFooter',
            tag: 'table',
            classes: 'biblesupersearch_render_table copyright_footer'
        }).createComponent({
            tag: 'tr'
        });

        this._renderCopyRightBottomHelper(Container);
    },
    _renderCopyRightBottomHelper: function(Container) {
        for(i in this.bibles) {
            var module = this.bibles[i];

            if(typeof this.app.statics.bibles[module] == 'undefined') {
                continue;
            }
            
            var bible_info = this.app.statics.bibles[module];
            // var content = '<h5>' + bible_info.name + ' (' + bible_info.shortname + ')</h5>' + bible_info.copyright_statement;
            
            var components = [
                {tag: 'h5', content: bible_info.name + ' (' + bible_info.shortname + ')'},
                {kind: i18n, content: bible_info.copyright_statement, allowHtml: true}
            ];

            if(bible_info.research) {
                // content += '<br /><br />This Bible is provided for research purposes only.';
                components.push({tag: 'br'});
                components.push({tag: 'br'});
                components.push({kind: i18n, content: 'This Bible is provided for research purposes only.'});
            }

            Container.createComponent({
                tag: 'td',
                components: components,
                classes: 'copyright_statement',
                attributes: {colspan: this.passageColumnsPerBible}
            });
        }

        this.showingCopyrightBottom = true;
    },

    _getBibleDisplayName: function(bible) {
        if(this.bibles.length <= 1) {
            return bible.name;
        }
        
        return bible.name.length > 30 ? bible.shortname : bible.name;
    },

    renderHeader: function() {}, // Called before results are rendered, not required
    renderFooter: function() {}, // Called after results are rendered, not required

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
        return bookName + ' ' + verse.chapter + ':' + verse.verse;
    },    
    processPassageVerseContent: function(passage, verse) {
        var ref = this.proccessPassageVerseReference(passage, verse);
        return this.processAssemblePassageVerse(ref, verse);
    },
    proccessPassageVerseReference: function(passage, verse) {
        if(this.renderStyle == 'verse_passage') {
            return this.proccessSingleVerseReference(passage, verse);
        }

        return verse.verse;
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
            text = text.replace(/‹/g, '<span class="red_letter">');
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
    _createContainer: function() {
        return this.createComponent({
            kind: ResCom,
            tag: 'table',
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

        this.createComponent({
            kind: this.pagerView,
            currentPage: this.paging.current_page,
            lastPage: this.paging.last_page,
            perPage: this.paging.per_page,
            totalResults: this.paging.total,
            cacheHash: this.resultsData.hash,
            formData: this.formData,
            includeTotals: includeTotals
        });
    },
    selectBible: function(module) {
        this.selectedBible = (typeof this.app.statics.bibles[module] == 'undefined') ? null : this.app.statics.bibles[module];
        return this.selectedBible;
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

        this.log('hoverIntentThres', hoverIntentThres, strongsOpenClick);

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
        target = inEvent.target;

        if(strongsOpenClick && target.tagName == 'A' && target.className == 'strongs') {
            inEvent.preventDefault();
            // inEvent.stopPropagation();
            inEvent.bubbling = false;

            var mouseX = Math.round(inEvent.clientX); 
            var mouseY = Math.round(inEvent.clientY); 

            if(this.app.clientBrowser == 'IE') {
                // apparently, do nothing - seems to position correctly?
            }
            else {
                mouseX += window.scrollX;
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
            this.$.StrongsHover && this.log('displaying Strongs dialog');
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

        var html = '';
            html += '<html>\n';
            html +=     '<head>\n';
            html +=         '<title>' + title + '</title>\n';
            html +=         '<style>\n';
            html +=             "@import url('" + cssPath + "');\n";
            html +=         '</style>\n';
            html +=     '</head>\n';
            html +=     '<body>\n';
            html +=         '<div class="biblesupersearch_print">\n';
            html +=             resultsHtml + '\n';
            html +=         '</div>\n';
            html +=     '</body>\n';
            html +=     '<script>\n';
            html +=         'history.replaceState(history.state, "", "' + curURL + '");\n'; // Force the displayed URL to that of the parent page
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
    handleLocaleChange: function(inSender, inEvent) {
        this._localeChangeRender = true;
        this.renderResults();
    }

});
