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

    handlers: {
        ontap: 'handleTap',
        onAutoClick: 'handleAutoClick'
    },

    components: [
        {kind: Button, content: '|<=', ontap:'goChangePage', page: 1, name: 'first_page'},
        {kind: Button, content: '<=', ontap:'goPrevPage', name: 'prev_page'},
        {kind: Button, content: '=>', ontap:'goNextPage', name: 'next_page'},
        {kind: Button, content: '=>|', ontap:'goLastPage', name: 'last_page'}
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
            this.app.set('scrollMode', 'results_top');
            this.set('currentPage', newPage);
            var data = {page: this.get('currentPage')};
            this.log('changing', data);
            Signal.send('onPageChange', data);
            this.doPageChange(data);
        }
    },
    handleTap: function(inSender, inEvent) {
        if(inSender.href) {
            // If clicking on an active link, set scroll mode
            this.app.set('scrollMode', 'results_top');
        }
    },
    handleAutoClick: function(inSender, inEvent) {
        button = inEvent.button || null;

        // Handle special cases.
        switch(button) {
            case '_prev':
                button = 'prev_page';
                break;
            case '_next':
                button = 'next_page';
                break;
        }

        button && this.$[button] && this.$[button].hasNode().click();
    }

});
