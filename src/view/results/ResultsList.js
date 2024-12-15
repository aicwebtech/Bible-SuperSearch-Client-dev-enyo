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
    // kind: i18n,
    kind: Link,
    linkBuilder: LinkBuilder,
    containsVerses: true,
    textShowing: false,
    showBookName: true,
    shortNameOnly: true,
    item: {},

    handlers: {
        onLocaleChange: 'localeChanged',
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
            onShowingChange: 'handleShowingChange', 
            isChrome: true
        },
    ],

    create: function() {
        var bible = this.app.getSelectedBibles();
        this.visited = this.item.showing;
        this.absHref =  this.linkBuilder.buildReferenceLink('p', bible, this.item.book + 'B', this.item.chapter, this.item.verse);

        this.inherited(arguments);
        // this.addRemoveClass('bss_results_list_item_showing', this.item.showing);
        // this.set('showing', this.item.showing || false);

        this.makeLink();
    },
    makeLink: function() {
        var bible = this.app.getSelectedBibles();
        var bookNameShort = this.app.getLocaleBookName(this.item.book, null, this.shortNameOnly ? 'strict' : true);
        var bookName = this.app.getLocaleBookName(this.item.book, null);

        var mode = 'sl/' + this.app.get('resultsListCacheId'); // + '/' + this.app.get('resultsListPage');
        link = this.linkBuilder.buildReferenceLink(mode, bible, bookName, this.item.chapter, this.item.verse);

        this.setAttribute('href', link);

        var content = (this.showBookName && bookNameShort) ? bookNameShort + ' ' : '';
        this.setContent(content + this.item.chapter + ':' + this.item.verse);
        
        if(!this.showBookName || bookName != bookNameShort) {
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
        // if(!this.item.showing) {
            this.set('visited', false);
        // }
    },
    handleShowingClear: function() {
        this.set('textShowing', false);
    },
    handleShowingChange: function(s, e) {
        var i = this.item;

        if(i.book == e.book && i.chapter == e.chapter && i.verse == e.verse) {
            this.log(i.book, i.chapter, i.verse);

            this.set('textShowing', e.showing || true);
            this.set('visited', true);
        }
    },
    handleTap: function(s, e) {
        this.inherited(arguments);
        e.preventDefault();
        // e.stopPropagation();
        this.log(e);

        this.bubble('onResultsLinkTap', {item: this.item});
        return true;
    },
    textShowingChanged: function(was, is) {
        this.addRemoveClass('bss_results_list_item_showing', is);
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
            isChrome: true
        },
        // { components: [
        //     {name: 'SearchLink', kind: Link, content: 'Return to Search'}
        // ]}
        {tag: 'table', name: 'Table'}
    ],

    // handlers: {
    //     resize: 'handleResize'
    // },

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

        // this.$.SearchLink.set('href', '#/c/' + this.app.get('resultsListCacheId'));

        this.list.forEach(function(item) {
            var cont = 'Container_' + item.book,
                colcont =  'Column_' + item.book,
                bccont = 'BookCount_' + item.book;

            // if(!t.$[cont]) {
            //     t.createComponent({
            //         name: cont,
            //         classes: 'bss_results_list_container',
            //     });
            // }

            // t.$[cont].createComponent({
            //     kind: ResultsListItem,
            //     item: item,
            //     owner: t
            // });

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

            t.log('component', t.$.Table.$[cont]);

            // if(t.$.Table.$[cont] && t.$.Table.$[cont].$[colcont]) {                
                var lc = t.$.Table.$[colcont].createComponent({
                    kind: ResultsListItem,
                    item: item,
                    showBookName: true, 
                    owner: t
                });

                t.listComponents.push(lc);

                t.$.Table.$[bccont].set('content', ' (' + bookCount + ')');
            // }

            // // if(lastBook && lastBook != item.book) {
            // //     t.createComponent({tag: 'br'});
            // //     t.createComponent({tag: 'br'});
            // // }

            // // if(lastBook != item.book) {
            // //     t.createComponent({
            // //         kind: i18n,
            // //         // tag: 'span',
            // //         style: 'width: 150px; display: inline-block',
            // //         content: item.book + 'B',
            // //         containsVerses: true
            // //     });
            // // }

            // // var c = t.createComponent({
            // //     kind: ResultsListItem,
            // //     item: item,
            // //     showBookName: false
            // //     // showBookName: lastBook != item.book
            // // });

            lastBook = item.book;

            // // if(item.showing && !t.scrollTo) {
            // //     t.scrollTo = c;
            // // }
        });

        // this.scrollToItem();
    },
    rendered: function() {
        this.inherited(arguments);
        var t = this;

        this.RO = new ResizeObserver(function() {
            t.app.set('resultsListHeight', t.hasNode().offsetHeight - 16); // padding =  7 * 2, border = 1 * 2 
            t.app.set('resultsListWidth', t.hasNode().offsetWidth - 22);   // padding = 10 * 2, border = 1 * 2
        }).observe(this.hasNode());

        this.scrollToItem();
    }, 

    handleResize: function() {
        this.log();
    },
    
    scrollToItemDelay: function() {
        var t = this;

        if(this.scrollDelay) {
            window.clearTimeout(this.scrollDelay);
        }

        this.scrollDelay = window.setTimeout(function() {
            window.clearTimeout(t.scrollDelay);
            t.log('scrollTo Delay over');
            t.scrollDelay = null;
            t.scrollToItem();
        }, 1000)
    },

    scrollToItem: function() {
        this.log();
        var t = this;

        if(!this.$) {
            this.log('NO $ for components');
            return; // what on earth?
        }
        // return;

        // if(!this.scrollTo || !this.scrollTo.hasNode()) {
        //     return;
        // }

        // this.log();

        var scrollTo = this.listComponents.find(function(c) {
            if(c.get('textShowing')) {
                return true;
            }

            // Get ACTUAL component
            cc = t.$[c.get('name')];

            return cc ? cc.get('textShowing') : false;
        });

        // this.log('scrollToOrig', scrollTo.get('name'));

        if(!scrollTo || !scrollTo.hasNode()) {
            this.log('No component to scroll to');
            return;
        }

        var sc = 'Column_' + scrollTo.item.book;
        scrollTo = this.$.Table ? this.$.Table.$[sc] : scrollTo;

        // this.log('scrollToNew', scrollTo.get('name'));

        var offsetTop = scrollTo.hasNode().offsetTop;

        this.log('scrolling', offsetTop);

        // this.log('offsetTop', offsetTop, scrollTo.get('content'));

        this.hasNode() && this.hasNode().scrollTo({
            top: offsetTop - 2, 
            left: 0, 
            behavior: 'instant' // intentionally hardcoded
        });

        // var styles = window.getComputedStyle(this.scrollTo.hasNode());
        //     margin =    parseFloat(styles['marginTop']) +
        //                 parseFloat(styles['marginBottom']);
        // return;
        //     height = this.scrollTo.hasNode().offsetHeight;

        // this.log('styles', styles);
        // this.log('offsetHeight', offsetHeight);

        // // this.hasNode() && this.hasNode().scrollTo({
        // //     // top: 1300, 
        // //     top: top, 
        // //     left: 0, 
        // //     behavior: 'instant' // intentionally hardcoded
        // // });

        // // this.scrollTo = null;
        // return;
    }
});