var kind = require('enyo/kind');
var Link = require('enyo/Anchor');
var ImageLink = require('../LinkImage');
var LinkBuilder = require('../Link/LinkBuilder');
var Signal = require('../Signal');

module.exports = kind({
    name: 'NavHtml',
    linkBuilder: LinkBuilder,
    classes: 'html_nav_buttons',
    nav: {}, // navigation data
    bibles: [],

    pswapBookText: '|&#9664;&#xFE0E;',
    pswapChapterText: '&#9664;&#xFE0E;',
    currentChapterText: '&ndash;&#xFE0E;',
    nextChapterText: '&#9654;&#xFE0E;',
    nextBookText: '&#9654;&#xFE0E;|',

    linkClasses: 'styleable',
    classesActive: 'active',
    classesInactive: 'inactive',
    swapOnRtl: true,

    // attributes: {dir: 'auto'},

    components: [
        {kind: Signal, onBibleChange: 'handleBibleChange', _onAutoClick: 'handleAutoClick', isChrome: true}
    ],

    handlers: {
        ontap: 'handleTap',
        onAutoClick: 'handleAutoClick',
        onLocaleChanged: 'handleLocaleChange'
    },

    create: function() {
        this.inherited(arguments);
        this.buildLinks();
    },

    buildLinks: function() {
        this.destroyClientControls();

        var pb_link = null,
            nb_link = null,
            nc_link = null,
            pc_link = null,
            cc_link = null,            
            pb_text = null,
            nb_text = null,
            nc_text = null,
            pc_text = null,
            cc_text = null,
            bookName = null,
<<<<<<< HEAD
=======
            cla = this.linkClasses + ' ' + this.classesActive,
            cli = this.linkClasses + ' ' + this.classesInactive,
            swap = this.app.isRtl && this.swapOnRtl,
>>>>>>> master
            bible = (this.bibles) ? this.bibles : '';

        // Next Book
        if(typeof this.nav.nb != 'undefined' && this.nav.nb != null) {
            bookName = this.app.getLocaleBookName(this.nav.nb, this.nav.next_book);
            nb_link = this.linkBuilder.buildReferenceLink('p', bible, bookName, 1);
            nb_text = bookName;
        }         

<<<<<<< HEAD
        // Prev Book
        if(typeof this.nav.pb != 'undefined' && this.nav.pb != null) {
            bookName = this.app.getLocaleBookName(this.nav.pb, this.nav.prev_book);
=======
        // Pswap Book
        if(typeof this.nav.pb != 'undefined' && this.nav.pb != null) {
            bookName = this.app.getLocaleBookName(this.nav.pb, this.nav.pswap_book);
>>>>>>> master
            pb_link = this.linkBuilder.buildReferenceLink('p', bible, bookName, 1);
            pb_text = bookName;
        }         

<<<<<<< HEAD
        // Prev Chapter
=======
        // Pswap Chapter
>>>>>>> master
        if(typeof this.nav.pcc != 'undefined' && this.nav.pcc != null) {
            bookName = this.app.getLocaleBookName(this.nav.pcb, this.nav.pcb_name);
            pc_link = this.linkBuilder.buildReferenceLink('p', bible, bookName, this.nav.pcc);
            pc_text = bookName + ' ' + this.nav.pcc;
        }         

        // Next Chapter
        if(typeof this.nav.ncc != 'undefined' && this.nav.ncc != null) {
            bookName = this.app.getLocaleBookName(this.nav.ncb, this.nav.ncb_name);
            nc_link = this.linkBuilder.buildReferenceLink('p', bible, bookName, this.nav.ncc);
            nc_text = bookName + ' ' + this.nav.ncc;
        }         

        // Current Chapter
        if(typeof this.nav.ccc != 'undefined' && this.nav.ccc != null) {
            ookName = this.app.getLocaleBookName(this.nav.ccb, this.nav.ccb_name);
            cc_link = this.linkBuilder.buildReferenceLink('p', bible, bookName, this.nav.ccc);
            cc_text = bookName + ' ' + this.nav.ccc;
        }

        this.createComponent({
            kind:  Link,
            name:  'pb',
            href:  pb_link,
            title: pb_text,
            allowHtml: true,
            classes: (pb_link) ? cla : cli,
            content: swap ? this.nextBookText : this.pswapBookText
        });        

        this.createComponent({
            kind:  Link,
            name:  'pc',
            href:  pc_link,
            title: pc_text,
            allowHtml: true,
            classes: (pc_link) ? cla : cli,
            content: swap ? this.nextChapterText : this.pswapChapterText
        });        

        this.createComponent({
            kind:  Link,
            name:  'cc',
            href:  cc_link,
            title: cc_text,
            allowHtml: true,
            classes: (cc_link) ? cla : cli,
            content: this.currentChapterText
        });        

        this.createComponent({
            kind:  Link,
            name:  'nc',
            href:  nc_link,
            title: nc_text,
            allowHtml: true,
            classes: (nc_link) ? cla : cli,
            content: swap ? this.pswapChapterText : this.nextChapterText
        });        

        this.createComponent({
            kind:  Link,
            name:  'nb',
            href:  nb_link,
            title: nb_text,
            allowHtml: true,
            classes: (nb_link) ? cla : cli,
            content: swap ? this.pswapBookText : this.nextBookText
        });
    },
    handleTap: function(inSender, inEvent) {
        if(inSender.href) {
            // If clicking on an active link, set scroll mode
            this.app.set('scrollMode', 'results_top');
        }
    },
    handleBibleChange: function(inSender, inEvent) {
        var c = this.app.configs.bibleChangeUpdateNavigation || false;

        if(c && c != 'false') {
            this.bibles = inEvent.bibles;
            this.buildLinks();
            this.render();
        }
    },
    handleLocaleChange: function(inSender, inEvent) {
        this.buildLinks();
        this.render();
    },
    handleAutoClick: function(inSender, inEvent) {
        button = inEvent.button || null;

        // Handle special cases.
        switch(button) {
            case '_pswap':
                button = 'pc';
                break;
            case '_next':
                button = 'nc';
                break;
        }

        button && this.$[button] && this.$[button].hasNode().click();
    }
});
