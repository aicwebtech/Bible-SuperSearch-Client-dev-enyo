var kind = require('enyo/kind');
var ImageLink = require('../LinkImage');
var LinkBuilder = require('../Link/LinkBuilder');

module.exports = kind({
    name: 'NavBase',
    linkBuilder: LinkBuilder,
    nav: {}, // navigation data
    iconDir: '',
    prevBook: 'pb.gif',
    prevBookDisabled: 'pb_nl.gif',
    nextBook: 'nb.gif',
    nextBookDisabled: 'nb_ln.gif',    
    prevChapter: 'pc.gif',
    prevChapterDisabled: 'pc_nl.gif',
    nextChapter: 'nc.gif',
    nextChapterDisabled: 'nc_ln.gif',
    currentChapter: 'sc.gif',
    currnetChapterDisabled: 'sc_nl.gif',

    create: function() {
        this.inherited(arguments);

        var pb_icon = this.prevBookDisabled,
            nb_icon = this.nextBookDisabled,
            nc_icon = this.nextChapterDisabled,
            pc_icon = this.prevChapterDisabled,
            cc_icon = this.currnetChapterDisabled,
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
            bible = '';

        if(typeof this.nav.nb != 'undefined') {
            var nbook = this.app.statics.books[this.nav.nb - 1];
            nb_link = this.linkBuilder.buildReferenceLink('p', bible, nbook.name);
            nb_icon = this.iconDir + this.nextBook;
            nb_text = nbook.name;
        }         

        if(typeof this.nav.pb != 'undefined') {
            var pbook = this.app.statics.books[this.nav.pb - 1];
            pb_link = this.linkBuilder.buildReferenceLink('p', bible, pbook.name);
            pb_icon = this.iconDir + this.prevBook;
            nb_text = pbook.name
        }         

        if(typeof this.nav.pcc != 'undefined') {
            var pcbook = this.app.statics.books[this.nav.pcb - 1];
            pc_link = this.linkBuilder.buildReferenceLink('p', bible, pcbook.name, this.nav.pcc);
            pc_icon = this.iconDir + this.prevChapter;
            pc_text = pcbook.name + ' ' + this.nav.pcc;
        }         

        if(typeof this.nav.ncc != 'undefined') {
            var ncbook = this.app.statics.books[this.nav.ncb - 1];
            nc_link = this.linkBuilder.buildReferenceLink('p', bible, ncbook.name, this.nav.ncc);
            nc_icon = this.iconDir + this.nextChapter;
            nc_text = ncbook.name + ' ' + this.nav.ncc;
        }         

        if(typeof this.nav.ccc != 'undefined') {
            var ccbook = this.app.statics.books[this.nav.ccb - 1];
            cc_link = this.linkBuilder.buildReferenceLink('p', bible, ccbook.name, this.nav.ccc);
            cc_icon = this.iconDir + this.currentChapter;
            cc_text = ccbook.name + ' ' + this.nav.ccc;
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
