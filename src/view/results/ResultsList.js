var kind = require('enyo/kind');
var GridView = require('./GridView');
var LinkBuilder = require('../../components/Link/LinkBuilder');
var Link = require('../../components/Link/VisitLink');
var utils = require('enyo/utils');
var i18n = require('../../components/Locale/i18nComponent');
var Signal = require('enyo/Signals');

var ResultsListItem = kind({
    classes: 'bss_results_list_item',
    visitedClasses: 'bss_results_list_item_visited',
    name: 'ResultsListItem',
    kind: Link,
    linkBuilder: LinkBuilder,
    containsVerses: true,
    textShowing: false,
    showBookName: true,
    shortNameOnly: true,
    item: {},

    handlers: {
        onLocaleChange: 'localeChanged',
        onResetShowing: 'resetShowing',
        ontap: 'handleTap'
    },

    attributes: {
        onclick: "return false;"
    },
    
    components: [
        {
            kind: Signal, 
            onVisitedClear: 'handleVisitedClear', 
            onShowingClear: 'handleShowingClear', 
            onShowingReset: 'showingResetItem', 
            isChrome: true
        }
    ],

    create: function() {
        var bible = this.app.getSelectedBibles();
        this.visited = this.item.showing;
        this.absHref =  this.linkBuilder.buildReferenceLink('p', bible, this.item.book + 'B', this.item.chapter, this.item.verse);

        this.inherited(arguments);
        this.addRemoveClass('bss_results_list_item_showing', this.item.showing);
        this.set('textShowing', this.item.showing || false);
        this.applyStyle('text-overflow', '\'' + this.item.chapter + ':' + this.item.verse + '\'');

        this.makeLink();
    },
    makeLink: function() {
        var bible = this.app.getSelectedBibles();
        var bookNameShort = this.app.getLocaleBookName(this.item.book, null, this.shortNameOnly ? 'strict' : true);
        var bookName = this.app.getLocaleBookName(this.item.book, null);
        var showBookName = this.showBookName;

        var mode = 'p'; // 'sl/' + this.app.get('resultsListCacheId'); // + '/' + this.app.get('resultsListPage');
        link = this.linkBuilder.buildReferenceLink(mode, bible, bookName, this.item.chapter, this.item.verse);

        this.setAttribute('href', link);

        var content = (showBookName && bookNameShort) ? bookNameShort + ' ' : '';
        this.setContent(content + this.item.chapter + ':' + this.item.verse);
        
        if(!showBookName || bookName != bookNameShort) {
            this.setAttribute('title', bookName + ' ' + this.item.chapter + ':' + this.item.verse);
        } else {
            this.setAttribute('title', null);
        }
    },
    localeChanged: function() {
        this.makeLink();
        // this.render();
    },
    handleVisitedClear: function() {
        this.set('visited', false);
    },
    handleShowingClear: function() {
        this.set('textShowing', false);
    },
    showingResetItem: function() {
        this.set('textShowing', !!this.item.showing);
    },
    handleTap: function(s, e) {
        this.inherited(arguments);
        e.preventDefault();
        Signal.send('onShowingClear');
        this.set('textShowing', true);

        this.bubble('onResultsLinkTap', {item: this.item});
        return true;
    },
    isTextShowing: function() {
        return this.get('textShowing');
    },
    textShowingChanged: function(was, is) {
        this.addRemoveClass('bss_results_list_item_showing', is);

        is && this.set('visited', true);
    },
    resetShowing: function() {
        // this.set('textShowing', null);
    }
});

module.exports = kind({
    name: 'ResultsList',
    classes: 'bss_results_list',
    scrollTo: null,
    scrollDelay: null,
    list: [],

    listComponents: [],

    components: [
        {
            kind: Signal, 
            resize: 'handleResize', 
            onShowingReset: 'scrollToItemDelay',
            isChrome: true
        },
        // {classes: 'bss_results_list', components: [
        //     {tag: 'table', name: 'Table'},
        // ]},
        {tag: 'table', name: 'Table'},
        // {
        //     name: 'Handle',
        //     classes: 'bss_results_list_handle',
        //     // ondragstart: 'resizeDragStart',
        //     // dragend: 'resizeDragEnd'
        // }
    ],

    create: function() {
        this.inherited(arguments);
        var t = this;
        var lastBook = null;
        var bookCount = 0;

        if(this.app.get('resultsListWidth')) {
            this.applyStyle('width', this.app.get('resultsListWidth') + 'px');
        }        

        if(this.app.get('resultsListHeight')) {
            this.applyStyle('height', this.app.get('resultsListHeight') + 'px');
        }

        this.list.forEach(function(item) {
            var cont = 'Container_' + item.book,
                colcont =  'Column_' + item.book,
                bccont = 'BookCount_' + item.book;

            if(!t.$.Table.$[cont]) {
                lastBook && t.$.Table.createComponent({
                    tag: 'tr',
                    allowHtml: true,
                    content: '<td colspan="2"><hr /></td>'
                });

                t.$.Table.createComponent({
                    name: cont, 
                    tag: 'tr',
                    components: [
                        {
                            tag: 'td',
                            classes: 'bss_results_list_label',
                            components: [
                                {components: [
                                    {
                                        kind: i18n,
                                        tag: 'span',
                                        content: item.book + 'B',
                                        containsVerses: true
                                    }, 
                                    {
                                        tag: 'span',
                                        name: bccont
                                    }
                                ]}
                            ]
                        }, 
                        {
                            name: colcont,
                            tag: 'td'
                        }
                    ]
                });

                bookCount = 1;
            } else {
                bookCount ++;
            }
              
            var lc = t.$.Table.$[colcont].createComponent({
                kind: ResultsListItem,
                item: item,
                showBookName: false, 
                owner: t
            });

            t.listComponents.push(lc);

            t.$.Table.$[bccont].set('content', ' (' + bookCount + ')');

            lastBook = item.book;
        });
    },
    rendered: function() {
        this.inherited(arguments);
        var t = this;

        this.RO = new ResizeObserver(function() {
            if(!t.app || !t.app.set) {
                return;
            }

            t.app.set('resultsListHeight', t.hasNode().offsetHeight - 16); // padding =  7 * 2, border = 1 * 2 
            t.app.set('resultsListWidth', t.hasNode().offsetWidth - 22);   // padding = 10 * 2, border = 1 * 2
        }).observe(this.hasNode());

        this.scrollToItem();

        // Attempt to build custom drag/drop handle for resize.
        // This will take me one day plus to actually build
        // NOT doing this for free lol
        // this.$.Handle.hasNode().addEventListener('dragstart', function(e) {
        //     t.log('drag start', e);
        // });        

        // this.$.Handle.hasNode().addEventListener('dragend', function(e) {
        //     t.log('drag end', e);
        // });
    }, 

    handleResize: function() {
        this.log();
    },

    resizeDragStart: function(s, e) {
        this.log(s, e);
    },
    resizeDragEnd: function(s, e) {
        this.log(s, e);
    },
    
    scrollToItemDelay: function() {
        var t = this;

        if(this.scrollDelay) {
            window.clearTimeout(this.scrollDelay);
        }

        this.scrollDelay = window.setTimeout(function() {
            window.clearTimeout(t.scrollDelay);
            t.scrollDelay = null;
            t.scrollToItem();
        }, 1000)
    },

    scrollToItem: function() {
        var t = this;

        if(!this.$) {
            this.log('NO $ for components');
            return; // what on earth?
        }

        var scrollTo = this.listComponents.find(function(c) {
            // Get ACTUAL component
            cc = t.$[c.get('name')];

            return cc ? cc.isTextShowing() : false;
        });

        scrollToAc = scrollTo ? this.$[scrollTo.get('name')] || null : null;

        var book = scrollTo && scrollTo.item ? scrollTo.item.book || null : null;
        var section = null;

        if(book) {            
            var sc = 'Column_' + scrollTo.item.book;
            section = this.$.Table ? this.$.Table.$[sc] : null;
        }

        var sNode = section ? section.hasNode() : null;
            cNode = scrollToAc ? scrollToAc.hasNode() : null; 

        var offsetTop = 0;
            offsetTop += sNode ? sNode.offsetTop : 0;
            offsetTop += sNode && cNode ? cNode.offsetTop : 0;

        this.hasNode() && this.hasNode().scrollTo({
            top: offsetTop - 2, 
            left: 0, 
            behavior: 'instant' // intentionally hardcoded
        });
    }
});