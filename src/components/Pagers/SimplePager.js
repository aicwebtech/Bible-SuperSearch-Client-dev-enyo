var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Signal = require('../Signal');

module.exports = kind({
    name: 'SimplePager',
    classes: 'biblesupersearch_pager',
    lastPage: null,
    currentPage: 1,
    perPage: 30,
    totalResults: null,

    events: {
        onPageChange: ''
    },

    components: [
        {kind: Button, content: '|<=', ontap:'goChangePage', page: 1},
        {kind: Button, content: '<=', ontap:'goPrevPage'},
        {kind: Button, content: '=>', ontap:'goNextPage'},
        {kind: Button, content: '=>|', ontap:'goLastPage'}
    ],

    create: function() {
        this.inherited(arguments);
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
