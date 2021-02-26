var kind = require('enyo/kind');
var GridView = require('./GridView');
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
    lastHoverTarget: null,
    lastHoverX: 0,
    lastHoverY: 0,
    navigationButtonsView: Nav,
    pagerView: Pager,
    showingCopyrightBottom: false,

    published: {
        resultsData: null,
        formData: null
    },

    handlers: {
        onFormResponseSuccess: 'handleFormResponse',
        onFormResponseError: 'handleFormError',
        onmouseover: 'handleHover',
        onmouseout: 'handleMouseOut',
        ontap: 'handleClick'
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
    formDataChanged: function(was, is) {
        this.bibles = [];

        for(i in this.formData.bible) {
            var module = this.formData.bible[i];

            if(typeof this.app.statics.bibles[module] == 'undefined') {
                continue;
            }

            this.bibles.push(module);
        }

        // this.log(this.bibles);
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
        // passage.book_name + ' ' + passage.chapter_verse + '  ' + verse.text;
        var ref = this.proccessSingleVerseReference(passage, verse);
        return this.processAssembleSingleVerse(ref, verse);
    },
    proccessSingleVerseReference: function(passage, verse) {
        var book = this.app.getBook(passage.book_id);
        return book.name + ' ' + verse.chapter + ':' + verse.verse;
    },    
    processPassageVerseContent: function(passage, verse) {
        var ref = this.proccessPassageVerseReference(passage, verse);
        return this.processAssemblePassageVerse(ref, verse);
    },
    proccessPassageVerseReference: function(passage, verse) {
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

        // strongs
        if(this.app.UserConfig.get('strongs')) {
            text = text.replace(/\{/g, "<sup>");
            text = text.replace(/\}/g, "</sup>");
            text = text.replace(/[GHgh][0-9]+/g, utils.bind(this, function(match, offset, string) {
                // This link not working for a URL that ends in a file (ie biblesupersearch.html)
                var url = '#/strongs/' + this.biblesStr + '/' + match;
                return '<a class="strongs" href="' + url + '">' + match + '</a>';
            }));
        }
        else {
            text = text.replace(/\} \{/g, '');
            text = text.replace(/\{[^\}]+\}/g, '');
        }

        // italics
        if(this.app.UserConfig.get('italics')) {
            text = text.replace(/\[/g, '<i>');
            text = text.replace(/\]/g, "</i>");
        }
        else {
            text = text.replace(/[\[\]]/g, '');
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
            tag: 'table',
            // attributes:{border: 1},
            classes: 'biblesupersearch_render_table'
        });
    },

    watchRenderable: function(pre, cur, prop) {
        this.log(pre, cur, prop);
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
            includeTotals: includeTotals
        });
    },
    selectBible: function(module) {
        this.selectedBible = (typeof this.app.statics.bibles[module] == 'undefined') ? null : this.app.statics.bibles[module];
        return this.selectedBible;
    },
    handleHover: function(inSender, inEvent) {
        var target = inEvent.target;
        var x = inEvent.x;
        var y = inEvent.y;
        var lastX = this.lastHoverX;
        var lastY = this.lastHoverY;
        var thres = 5;

        if((
            (x - thres <= lastX) && 
            (x + thres >= lastX) && 
            (y - thres <= lastY) && 
            (y + thres >= lastY)
        )) {
            // return;
        }

        if(target != this.lastHoverTarget) {
            // this.hideHoverDialogs();
            this.lastHoverTarget = target;
            this.lastHoverX = x;
            this.lastHoverY = y;
            // this.log('inSender', inSender);
            // this.app.debug && this.log('hover inEvent', inEvent);

            var mouseX = inEvent.clientX; //inEvent.screenX + inEvent.offsetX;
            var mouseY = inEvent.clientY; // + inEvent.offsetY;

            if(this.app.clientBrowser == 'IE') {
                // apparently, do nothing - seems to position correctly?
            }
            else {
                mouseX += window.scrollX;
                mouseY += window.scrollY;
            }

            var parentWidth = inEvent.target.parentNode.offsetWidth;
            var parentHeight = inEvent.target.parentNode.offsetHeight;
            // var parentHeight = this.hasNode().scrollHeight;
            // var parentWidth  = this.hasNode().scrollWidth;
            // var mouseX = inEvent.offsetX;
            // var mouseY = inEvent.offsetY;


            if(target.tagName == 'A' && target.className == 'strongs') {
                // this.log('mouseY options', inEvent.offsetY, inEvent.y, inEvent.pageY, inEvent.movementY, inEvent.screenY);
                // this.hideHoverDialogs(); // uncomment in production
                // this.log('offset', inEvent.offsetY);
                // this.log('pWidth', parentWidth);
                // this.log('pHeight', parentHeight);
                // this.log('inEvent', inEvent);
                // this.log('mouseY', mouseY);
                this.$.StrongsHover.displayPosition(mouseX, mouseY, target.innerHTML, parentWidth, parentHeight);
            }

        }
    },
    handleMouseOut: function(inSender, inEvent) {
        if(inSender === this) {
            this.hideHoverDialogs();
        }
    },
    handleClick: function(inSender, inEvent) {
        if(inSender.name != 'DialogsContainer') {
            this.hideHoverDialogs();
        }
    },
    handleKey: function(inSender, inEvent) {
        // this.log(inEvent);

        if(inEvent.code == 'Escape') {
            this.hideHoverDialogs();
        }
    },
    hideHoverDialogs: function() {
        this.$.StrongsHover.set('showing', false);
    },
    handlePrint: function(inSender, inEvent) {
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
    }

});
