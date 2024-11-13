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
    item: {},

    attributes: {
        target: '_NEW'
    },

    handlers: {
        onLocaleChange: 'localeChanged',
    },
    
    components: [
        {
            kind: Signal, 
            onVisitedClear: 'handleVisitedClear', 
            isChrome: true
        },
    ],

    create: function() {
        var bible = this.app.getSelectedBibles();
        this.visited = this.item.showing;
        this.absHref =  this.linkBuilder.buildReferenceLink('p', bible, this.item.book + 'B', this.item.chapter, this.item.verse);

        this.inherited(arguments);
        this.addRemoveClass('bss_results_list_item_showing', this.item.showing);

        this.makeLink();
    },
    makeLink: function() {
        var bible = this.app.getSelectedBibles();
        var bookNameShort = this.app.getLocaleBookName(this.item.book, null, true);
        var bookName = this.app.getLocaleBookName(this.item.book, null);
        link = this.linkBuilder.buildReferenceLink('p', bible, bookName, this.item.chapter, this.item.verse);
        // link = this.linkBuilder.buildReferenceLink('p', bible, this.item.book + 'B', this.item.chapter, this.item.verse);

        this.setAttribute('href', link);
        this.setContent(bookNameShort + ' ' + this.item.chapter + ':' + this.item.verse + ';');
        
        if(bookName != bookNameShort) {
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
    }
});

module.exports = kind({
    name: 'ResultsList',
    classes: 'bss_results_list',
    scrollTo: null,

    list: [],

    create: function() {
        this.inherited(arguments);
        var t = this;

        this.list.forEach(function(item) {
            var c = t.createComponent({
                kind: ResultsListItem,
                item: item
            });

            if(item.showing && !t.scrollTo) {
                t.scrollTo = c;
            }
        });

        // this.scrollToItem();
    },
    rendered: function() {
        this.inherited(arguments);
        this.scrollToItem();
    }, 
    scrollToItem: function() {
        if(!this.scrollTo || !this.scrollTo.hasNode()) {
            return;
        }

        var offsetTop = this.scrollTo.hasNode().offsetTop;

        this.log('offsetTop', offsetTop, this.scrollTo.get('content'));

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