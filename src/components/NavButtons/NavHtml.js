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

    prevBookText: '|&#9664;',
    prevChapterText: '&#9664;',
    currentChapterText: '&ndash;',
    nextChapterText: '&#9654;',
    nextBookText: '&#9654;|',

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
            bible = (this.bibles) ? this.bibles : '';

        if(typeof this.nav.nb != 'undefined' && this.nav.nb != null) {
            var nbook = this.app.statics.books[this.nav.nb - 1];
            nb_link = this.linkBuilder.buildReferenceLink('p', bible, nbook.name, 1);
            nb_text = nbook.name;
        }         

        if(typeof this.nav.pb != 'undefined' && this.nav.pb != null) {
            var pbook = this.app.statics.books[this.nav.pb - 1];
            pb_link = this.linkBuilder.buildReferenceLink('p', bible, pbook.name, 1);
            pb_text = pbook.name
        }         

        if(typeof this.nav.pcc != 'undefined' && this.nav.pcc != null) {
            var pcbook = this.app.statics.books[this.nav.pcb - 1];
            pc_link = this.linkBuilder.buildReferenceLink('p', bible, pcbook.name, this.nav.pcc);
            pc_text = pcbook.name + ' ' + this.nav.pcc;
        }         

        if(typeof this.nav.ncc != 'undefined' && this.nav.ncc != null) {
            var ncbook = this.app.statics.books[this.nav.ncb - 1];
            nc_link = this.linkBuilder.buildReferenceLink('p', bible, ncbook.name, this.nav.ncc);
            nc_text = ncbook.name + ' ' + this.nav.ncc;
        }         

        if(typeof this.nav.ccc != 'undefined' && this.nav.ccc != null) {
            var ccbook = this.app.statics.books[this.nav.ccb - 1];
            cc_link = this.linkBuilder.buildReferenceLink('p', bible, ccbook.name, this.nav.ccc);
            cc_text = ccbook.name + ' ' + this.nav.ccc;
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
