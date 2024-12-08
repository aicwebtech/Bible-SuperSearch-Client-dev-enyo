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
    // kind: i18n,
    kind: Link,
    linkBuilder: LinkBuilder,
    containsVerses: true,
    textShowing: false,
    showBookName: true,
    item: {},

    handlers: {
        onLocaleChange: 'localeChanged',
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
        var bookNameShort = this.app.getLocaleBookName(this.item.book, null, true);
        var bookName = this.app.getLocaleBookName(this.item.book, null);
        var mode = 'sl/' + this.app.get('resultsListCacheId');
        link = this.linkBuilder.buildReferenceLink(mode, bible, bookName, this.item.chapter, this.item.verse);

        this.setAttribute('href', link);

        var content = (this.showBookName) ? bookNameShort + ' ' : '';
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
        // { components: [
        //     {name: 'SearchLink', kind: Link, content: 'Return to Search'}
        // ]}
        {tag: 'table', name: 'Table'}
    ],

    create: function() {
        this.inherited(arguments);
        var t = this;
        var lastBook = null;

        // this.$.SearchLink.set('href', '#/c/' + this.app.get('resultsListCacheId'));

        this.list.forEach(function(item) {
            var cont = 'Container_' + item.book,
                colcont =  'Column_' + item.book;

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
                t.$.Table.createComponent({
                    name: cont, 
                    tag: 'tr',
                    components: [
                        {
                            kind: i18n,
                            tag: 'td',
                            style: 'white-space: nowrap; padding-right: 5px; vertical-align: top',
                            content: item.book + 'B',
                            containsVerses: true
                        }, 
                        {
                            name: colcont,
                            tag: 'td'
                        }
                    ]
                });

            }

            t.log('component', t.$.Table.$[cont]);

            // if(t.$.Table.$[cont] && t.$.Table.$[cont].$[colcont]) {                
                var lc = t.$.Table.$[colcont].createComponent({
                    kind: ResultsListItem,
                    item: item,
                    showBookName: false, 
                    owner: t
                });

                t.listComponents.push(lc);
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

            // lastBook = item.book;

            // // if(item.showing && !t.scrollTo) {
            // //     t.scrollTo = c;
            // // }
        });

        // this.scrollToItem();
    },
    rendered: function() {
        this.inherited(arguments);
        this.scrollToItem();
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
        this.log();
        var t = this;
        // return;

        // if(!this.scrollTo || !this.scrollTo.hasNode()) {
        //     return;
        // }

        // this.log();

        var scrollTo = this.listComponents.find(function(c) {
            // Get ACTUAL component
            cc = t.$[c.get('name')];

            return cc.get('textShowing');
        });

        // this.log('scrollToOrig', scrollTo.get('name'));

        var sc = 'Column_' + scrollTo.item.book;
        scrollTo = this.$.Table.$[sc] || scrollTo;

        // this.log('scrollToNew', scrollTo.get('name'));

        if(!scrollTo || !scrollTo.hasNode()) {
            return;
        }

        var offsetTop = scrollTo.hasNode().offsetTop;

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