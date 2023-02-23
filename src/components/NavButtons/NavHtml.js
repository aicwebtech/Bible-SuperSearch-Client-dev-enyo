var kind = require('enyo/kind');
var Link = require('enyo/Anchor');
var ImageLink = require('../LinkImage');
var LinkBuilder = require('../Link/LinkBuilder');

module.exports = kind({
    name: 'NavHtml',
    linkBuilder: LinkBuilder,
    classes: 'html_nav_buttons',
    nav: {}, // navigation data
    bibles: [],

    prevBookText: '|&#9664;&#xFE0E;',
    prevChapterText: '&#9664;&#xFE0E;',
    currentChapterText: '&ndash;&#xFE0E;',
    nextChapterText: '&#9654;&#xFE0E;',
    nextBookText: '&#9654;&#xFE0E;|',

    create: function() {
        this.inherited(arguments);

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
            bible = (this.bibles) ? this.bibles : '';

        // Next Book
        if(typeof this.nav.nb != 'undefined' && this.nav.nb != null) {
            bookName = this.app.getLocaleBookName(this.nav.nb, this.nav.next_book);
            nb_link = this.linkBuilder.buildReferenceLink('p', bible, bookName, 1);
            nb_text = bookName;
        }         

        // Prev Book
        if(typeof this.nav.pb != 'undefined' && this.nav.pb != null) {
            bookName = this.app.getLocaleBookName(this.nav.pb, this.nav.prev_book);
            pb_link = this.linkBuilder.buildReferenceLink('p', bible, bookName, 1);
            pb_text = bookName;
        }         

        // Prev Chapter
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
            classes: (pb_link) ? 'active' : 'inactive',
            content: this.prevBookText
        });        

        this.createComponent({
            kind:  Link,
            name:  'pc',
            href:  pc_link,
            title: pc_text,
            allowHtml: true,
            classes: (pc_link) ? 'active' : 'inactive',
            content: this.prevChapterText
        });        

        this.createComponent({
            kind:  Link,
            name:  'cc',
            href:  cc_link,
            title: cc_text,
            allowHtml: true,
            classes: (cc_link) ? 'active' : 'inactive',
            content: this.currentChapterText
        });        

        this.createComponent({
            kind:  Link,
            name:  'nc',
            href:  nc_link,
            title: nc_text,
            allowHtml: true,
            classes: (nc_link) ? 'active' : 'inactive',
            content: this.nextChapterText
        });        

        this.createComponent({
            kind:  Link,
            name:  'nb',
            href:  nb_link,
            title: nb_text,
            allowHtml: true,
            classes: (nb_link) ? 'active' : 'inactive',
            content: this.nextBookText
        });
    }
});
