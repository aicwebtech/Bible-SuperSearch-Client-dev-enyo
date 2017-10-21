var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Signal = require('../Signal');
var Link = require('../Link/Link');

module.exports = kind({
    name: 'SimplePager',
    classes: 'biblesupersearch_pager',
    lastPage: null, // Total number of pages
    cacheHash: 'aerouv234', //null,
    currentPage: 1,
    perPage: 30,
    totalResults: null,
    numPageLinks: 10, // maximum number of individual page links to display at once

    events: {
        onPageChange: ''
    },

    components: [
        // {kind: Button, content: '|<=', ontap:'goChangePage', page: 1},
        // {kind: Button, content: '<=', ontap:'goPrevPage'},
        // {kind: Button, content: '=>', ontap:'goNextPage'},
        // {kind: Button, content: '=>|', ontap:'goLastPage'}
    ],

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
        
        if(this.lastPage) {        
            this.createComponent({
                kind: Link,
                content: '|<=',
                href: '#/c/' + cache + '/1'
            });        
        }

        this.createComponent({
            kind: Link,
            href: '#/c/' + cache + '/' + prevPage.toString(),
            content: '<='
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
                this.createComponent({
                    kind: Link,
                    href: (i == page) ? null : '#/c/' + cache + '/' + i.toString(),
                    classes: (i == page) ? 'current_page' : null,
                    content: i.toString()
                });
            }
        }

        this.createComponent({
            kind: Link,
            href: '#/c/' + cache + '/' + nextPage.toString(),
            content: '=>'
        });        

        if(this.lastPage) {        
            this.createComponent({
                kind: Link,
                content: '=>|',
                href: '#/c/' + cache + '/' + this.lastPage.toString()
            });
        }
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
    }

});
