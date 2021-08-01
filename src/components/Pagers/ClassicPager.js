var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Signal = require('../Signal');
var Link = require('../Link/Link');
var i18n = require('../Locale/i18nContent');
var Passage = require('../Passage');

// Classic text / html based pager
module.exports = kind({
    name: 'ClassicPager',
    classes: 'biblesupersearch_pager',
    lastPage: null, // Total number of pages
    cacheHash: 'abcde12345', //null,
    formData: {},
    currentPage: 1,
    perPage: 30,
    totalResults: null,
    numPageLinks: 10, // maximum number of individual page links to display at once,
    includeTotals: false,

    // settings:
    firstPageText:  '<<<',
    prevPageText: '<<',
    nextPageText: '>>',
    lastPageText: '>>>',

    Passage: Passage,

    events: {
        onPageChange: ''
    },

    create: function() {
        this.inherited(arguments);
        this._rebuildHelper();
    },
    rebuild: function() {
        this._rebuildHelper();
        this.render();
    },
    _rebuildHelper: function() {
        this.destroyClientControls();
        var cache = this.get('cacheHash');
        var page  = this.get('currentPage');
        var prevPage = (page == 1) ? 1 : page - 1;
        var nextPage = (page == this.lastPage) ? this.lastPage : page + 1;
        var displayRangeSt = (page - 1) * this.perPage + 1;
        var displayRangeEn = page * this.perPage;
        var showing = (this.lastPage > 1) ? true : false;
        var urlBase = this.getLinkBase();

        displayRangeEn = (displayRangeEn > this.totalResults) ? this.totalResults : displayRangeEn;

        if(this.includeTotals) {
            // var msg = 'Your search produced HZHA ' + this.totalResults + ' results. &nbsp;';
            // msg += 'Showing results ' + displayRangeSt + ' to ' + displayRangeEn + '.<br /><br />';
            showing = true;

            this.createComponent({
                // content: msg,
                components: [
                    {kind: i18n, content: 'Your search produced'},
                    {tag: 'span', content: ' ' + this.totalResults + ' '},
                    {kind: i18n, content: 'results'},
                    {tag: 'span', content: '. &nbsp;', allowHtml: true},
                    {kind: i18n, content: 'Showing Results'},
                    {tag: 'span', content: ' ' + displayRangeSt + ' '},
                    {kind: i18n, content: 'to'},
                    {tag: 'span', content: ' ' + displayRangeEn + '.'},
                    {tag: 'br'},
                    {tag: 'br'}
                ],
                allowHtml: true,
                name: 'TotalsContainer',
                classes: 'totals'
            });
        }

        if(this.lastPage == 1) {
            this.set('showing', showing);
            return;
        }

        var LinkContainer = this.createComponent({
            name: 'LinkContainer',
            classes: 'links'
        });
        
        if(this.lastPage) {        
            LinkContainer.createComponent({
                kind: Link,
                classes: (page == 1) ? 'std_link disabled' : 'std_link',
                content: this.firstPageText,
                allowHtml: true,
                href: (page == 1) ? null : '#/c/' + cache + '/1',
                title: 'First Page'
            });        
        }

        LinkContainer.createComponent({
            kind: Link,
            classes: (page == 1) ? 'std_link disabled' : 'std_link',
            href: (page == 1) ? null : urlBase + prevPage.toString(),
            content: this.prevPageText,
            allowHtml: true,
            title: 'Previous Page'
        });

        if(this.lastPage) {
            if(this.lastPage <= this.numPageLinks) {
                var displayFirstPage = 1;
                var displayLastPage  = this.lastPage;                
            }
            else {
                var displayFirstPage = 1;
                var displayLastPage  = this.numPageLinks;
                var midHi = Math.ceil(this.numPageLinks / 2);
                var midLo = Math.floor(this.numPageLinks / 2);

                while(page + midHi > displayLastPage && displayLastPage < this.lastPage) {
                    displayFirstPage ++;
                    displayLastPage ++;
                }
            }

            for(var i = displayFirstPage; i <= displayLastPage; i++) {
                LinkContainer.createComponent({
                    kind: Link,
                    href: (i == page) ? null : urlBase + i.toString(),
                    classes: (i == page) ? 'std_link current_page' : 'std_link',
                    content: i.toString()
                });
            }
        }

        LinkContainer.createComponent({
            classes: (page == this.lastPage) ? 'std_link disabled' : 'std_link',
            kind: Link,
            href: (page == this.lastPage) ? null : urlBase + nextPage.toString(),
            content: this.nextPageText,
            allowHtml: true,
            title: 'Next Page'
        });        

        if(this.lastPage) {        
            LinkContainer.createComponent({
                classes: (page == this.lastPage) ? 'std_link disabled' : 'std_link',
                kind: Link,
                allowHtml: true,
                content: this.lastPageText,
                href: (page == this.lastPage) ? null : urlBase + this.lastPage.toString(),
                title: 'Last Page'
            });
        }

        this.set('showing', showing);
    },
    currentPageChanged: function(was, is) {
        if(this.lastPage && is > this.lastPage) {
            this.currentPage = this.lastPage;
        }
    },
    goNextPage: function(inSender, inEvent) {
        if(!this.lastPage || this.lastPage && this.currentPage < this.lastPage) {
            this._pageChangeHelper(this.get('currentPage') + 1);
        }
    },
    goPrevPage: function(inSender, inEvent) {
        if(this.currentPage > 1) {
            this._pageChangeHelper(this.get('currentPage') - 1);
        }
    },    
    goLastPage: function(inSender, inEvent) {
        this._pageChangeHelper(this.get('lastPage'));
    },
    goChangePage: function(inSender, inEvent) {
        this._pageChangeHelper(inSender.get('page'));
    },
    _pageChangeHelper: function(newPage) {
        if(this.get('currentPage') != newPage) {
            this.set('currentPage', newPage);
            var data = {page: this.get('currentPage')};
            this.log('changing', data);
            Signal.send('onPageChange', data);
            this.doPageChange(data);
        }
    },
    getLinkBase: function() {
        var cache = this.get('cacheHash');
        return '#/c/' + cache + '/';

        var curUrl = window.location.href;
        parts = curUrl.split('#');

        var search = '',
            passage = '';

        if(this.formData) {
            if(this.formData.search) {
                search = this.formData.search;
                passage = this.formData.reference || null;
            }
            else {
                search = this.formData.request;
                
            }
        }

        if(parts[1]) {        
            subparts = parts[1].split('/');

            var mode = subparts.shift();

            if(mode == '') {
                mode = subparts.shift();
            }

            subpartsClean = [
                mode || 's',
                subparts[0] || '',
                subparts[1] || '',
                subparts[2] || '',
                subparts[3] || '',
            ];

            // page = subparts.pop();

            // if(Number.isNaN( Number.parseInt(page, 10))) {
            //     subparts.push(page);
            // }

            return '#/' + subpartsClean.join('/') + '/';
        }

        var cache = this.get('cacheHash');
        return '#/c/' + cache + '/';
    }

});
