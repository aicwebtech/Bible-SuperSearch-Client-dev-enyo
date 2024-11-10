var kind = require('enyo/kind');
var GridView = require('./GridView');
var Link = require('enyo/Anchor');
var LinkBuilder = require('../../components/Link/LinkBuilder');


var utils = require('enyo/utils');
var i18n = require('../../components/Locale/i18nComponent');

var ResultsListItem = kind({
    classes: 'bss_results_list_item',
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

    create: function() {
        this.inherited(arguments);
        this.addRemoveClass('bss_results_list_item_showing', this.item.showing);
        this.makeLink();
    },
    makeLink: function() {
        var bible = this.app.getSelectedBibles();
        var bookNameShort = this.app.getLocaleBookName(this.item.book, null, true);
        var bookName = this.app.getLocaleBookName(this.item.book, null);
        // link = this.linkBuilder.buildReferenceLink('p', bible, bookName, this.item.chapter, this.item.verse);
        link = this.linkBuilder.buildReferenceLink('p', bible, this.item.book + 'B', this.item.chapter, this.item.verse);

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
    }
});

module.exports = kind({
    name: 'ResultsList',
    classes: 'bss_results_list',

    list: [],

    create: function() {
        this.inherited(arguments);

        var t = this;

        this.list.forEach(function(item) {
            t.createComponent({
                kind: ResultsListItem,
                item: item
            });
        });
    }
});