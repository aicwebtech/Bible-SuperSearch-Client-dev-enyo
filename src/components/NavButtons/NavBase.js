var kind = require('enyo/kind');
var ImageLink = require('../LinkImage');
var LinkBuilder = require('../Link/LinkBuilder');

module.exports = kind({
    name: 'NavBase',
    linkBuilder: LinkBuilder,
    classes: 'biblesupersearch_nav_buttons',
    nav: {}, // navigation data
    bibles: [],
    iconDir: '',
    prevBook: 'pb.gif',
    prevBookDisabled: 'pb_nl.gif',
    nextBook: 'nb.gif',
    nextBookDisabled: 'nb_nl.gif',    
    prevChapter: 'pc.gif',
    prevChapterDisabled: 'pc_nl.gif',
    nextChapter: 'nc.gif',
    nextChapterDisabled: 'nc_nl.gif',
    currentChapter: 'sc.gif',
    currentChapterDisabled: 'sc_nl.gif',

    create: function() {
        this.inherited(arguments);

        var pb_icon = this.iconDir + this.prevBookDisabled,
            nb_icon = this.iconDir + this.nextBookDisabled,
            nc_icon = this.iconDir + this.nextChapterDisabled,
            pc_icon = this.iconDir + this.prevChapterDisabled,
            cc_icon = this.iconDir + this.currentChapterDisabled,
            pb_link = null,
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

        // this.log('books', this.app.statics.books);
        // this.log('nav', this.nav);
        // return;

        if(typeof this.nav.nb != 'undefined' && this.nav.nb != null) {
            var nbook = this.app.statics.books[this.nav.nb - 1];
            nb_link = this.linkBuilder.buildReferenceLink('p', bible, this.nav.next_book, 1);
            nb_icon = this.iconDir + this.nextBook;
            nb_text = this.nav.next_book;
        }         

        if(typeof this.nav.pb != 'undefined' && this.nav.pb != null) {
            var pbook = this.app.statics.books[this.nav.pb - 1];
            pb_link = this.linkBuilder.buildReferenceLink('p', bible, this.nav.prev_book, 1);
            pb_icon = this.iconDir + this.prevBook;
            pb_text = this.nav.prev_book;
        }         

        if(typeof this.nav.pcc != 'undefined' && this.nav.pcc != null) {
            var pcbook = this.app.statics.books[this.nav.pcb - 1];
            pc_link = this.linkBuilder.buildReferenceLink('p', bible, this.nav.pcb_name, this.nav.pcc);
            pc_icon = this.iconDir + this.prevChapter;
            pc_text = this.nav.pcb_name + ' ' + this.nav.pcc;
        }         

        if(typeof this.nav.ncc != 'undefined' && this.nav.ncc != null) {
            var ncbook = this.app.statics.books[this.nav.ncb - 1];
            nc_link = this.linkBuilder.buildReferenceLink('p', bible, this.nav.ncb_name, this.nav.ncc);
            nc_icon = this.iconDir + this.nextChapter;
            nc_text = this.nav.ncb_name + ' ' + this.nav.ncc;
        }         

        if(typeof this.nav.ccc != 'undefined' && this.nav.ccc != null) {
            var ccbook = this.app.statics.books[this.nav.ccb - 1];
            cc_link = this.linkBuilder.buildReferenceLink('p', bible, this.nav.ccb_name, this.nav.ccc);
            cc_icon = this.iconDir + this.currentChapter;
            cc_text = this.nav.ccb_name + ' ' + this.nav.ccc;
        }

        this.createComponent({
            kind:  ImageLink,
            name:  'pb',
            src:   pb_icon,
            href:  pb_link,
            title: pb_text,
        });        

        this.createComponent({
            kind:  ImageLink,
            name:  'pc',
            src:   pc_icon,
            href:  pc_link,
            title: pc_text,
        });        

        this.createComponent({
            kind:  ImageLink,
            name:  'cc',
            src:   cc_icon,
            href:  cc_link,
            title: cc_text,
        });        

        this.createComponent({
            kind:  ImageLink,
            name:  'nc',
            src:   nc_icon,
            href:  nc_link,
            title: nc_text,
        });        

        this.createComponent({
            kind:  ImageLink,
            name:  'nb',
            src:   nb_icon,
            href:  nb_link,
            title: nb_text,
        });
    }
});
