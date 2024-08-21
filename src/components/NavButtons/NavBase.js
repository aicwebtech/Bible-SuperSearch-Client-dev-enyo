var kind = require('enyo/kind');
var ImageLink = require('../LinkImage');
var LinkBuilder = require('../Link/LinkBuilder');
var Signal = require('../Signal');

// WARNING:  NavHtml (stylable buttons) does NOT extend NavBase!!!!!

module.exports = kind({
    name: 'NavBase',
    linkBuilder: LinkBuilder,
    classes: 'biblesupersearch_nav_buttons',
    nav: {}, // navigation data
    bibles: [],
    swapOnRtl: true,
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

    components: [
        {kind: Signal, onBibleChange: 'handleBibleChange', _onAutoClick: 'handleAutoClick', isChrome: true}
    ],

    handlers: {
        ontap: 'handleTap',
        onAutoClick: 'handleAutoClick'
    },

    create: function() {
        this.inherited(arguments);
        this.buildLinks();
    },
    buildLinks: function() {
        this.destroyClientControls();

        var swap = this.app.isRtl && this.swapOnRtl,
            pb_icon = swap ? this.nextBookDisabled : this.prevBookDisabled,
            nb_icon = swap ? this.prevBookDisabled :  this.nextBookDisabled,
            nc_icon = swap ? this.prevChapterDisabled : this.nextChapterDisabled,
            pc_icon = swap ? this.nextBookDisabled : this.prevChapterDisabled,
            cc_icon = this.currentChapterDisabled,
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
            bookName = null,
<<<<<<< HEAD
=======
            swap = this.app.isRtl && this.swapOnRtl,
>>>>>>> master
            bible = (this.bibles) ? this.bibles : '';

        // Next Book
        if(typeof this.nav.nb != 'undefined' && this.nav.nb != null) {
            bookName = this.app.getLocaleBookName(this.nav.nb, this.nav.next_book);
            nb_link = this.linkBuilder.buildReferenceLink('p', bible, bookName, 1);
<<<<<<< HEAD
            nb_icon = this.iconDir + this.nextBook;
=======
            nb_icon = swap ? this.prevBook : this.nextBook;
>>>>>>> master
            nb_text = bookName;
        }         

        // Prev Book
        if(typeof this.nav.pb != 'undefined' && this.nav.pb != null) {
            bookName = this.app.getLocaleBookName(this.nav.pb, this.nav.prev_book);
            pb_link = this.linkBuilder.buildReferenceLink('p', bible, bookName, 1);
<<<<<<< HEAD
            pb_icon = this.iconDir + this.prevBook;
=======
            pb_icon = swap ? this.nextBook : this.prevBook;
>>>>>>> master
            pb_text = bookName;
        }         

        // Prev Chapter
        if(typeof this.nav.pcc != 'undefined' && this.nav.pcc != null) {
            bookName = this.app.getLocaleBookName(this.nav.pcb, this.nav.pcb_name);
            pc_link = this.linkBuilder.buildReferenceLink('p', bible, bookName, this.nav.pcc);
<<<<<<< HEAD
            pc_icon = this.iconDir + this.prevChapter;
=======
            pc_icon = swap ? this.nextChapter : this.prevChapter;
>>>>>>> master
            pc_text = bookName + ' ' + this.nav.pcc;
        }         

        // Next Chapter
        if(typeof this.nav.ncc != 'undefined' && this.nav.ncc != null) {
            bookName = this.app.getLocaleBookName(this.nav.ncb, this.nav.ncb_name);
            nc_link = this.linkBuilder.buildReferenceLink('p', bible, bookName, this.nav.ncc);
<<<<<<< HEAD
            nc_icon = this.iconDir + this.nextChapter;
=======
            nc_icon = swap ? this.prevChapter : this.nextChapter;
>>>>>>> master
            nc_text = bookName + ' ' + this.nav.ncc;
        }         

        // Current Chapter
        if(typeof this.nav.ccc != 'undefined' && this.nav.ccc != null) {
<<<<<<< HEAD
            ookName = this.app.getLocaleBookName(this.nav.ccb, this.nav.ccb_name);
            cc_link = this.linkBuilder.buildReferenceLink('p', bible, bookName, this.nav.ccc);
            cc_icon = this.iconDir + this.currentChapter;
=======
            bookName = this.app.getLocaleBookName(this.nav.ccb, this.nav.ccb_name);
            cc_link = this.linkBuilder.buildReferenceLink('p', bible, bookName, this.nav.ccc);
            cc_icon = this.currentChapter;
>>>>>>> master
            cc_text = bookName + ' ' + this.nav.ccc;
        }


        this.createComponent({
            kind:  ImageLink,
            name:  'pb',
            src:   this.iconDir + pb_icon,
            href:  pb_link,
            title: pb_text,
        });        

        this.createComponent({
            kind:  ImageLink,
            name:  'pc',
            src:   this.iconDir + pc_icon,
            href:  pc_link,
            title: pc_text,
        });        

        this.createComponent({
            kind:  ImageLink,
            name:  'cc',
            src:   this.iconDir + cc_icon,
            href:  cc_link,
            title: cc_text,
        });        

        this.createComponent({
            kind:  ImageLink,
            name:  'nc',
            src:   this.iconDir + nc_icon,
            href:  nc_link,
            title: nc_text,
        });        

        this.createComponent({
            kind:  ImageLink,
            name:  'nb',
            src:   this.iconDir + nb_icon,
            href:  nb_link,
            title: nb_text,
        });
    },
    
    handleBibleChange: function(inSender, inEvent) {
        var c = this.app.configs.bibleChangeUpdateNavigation || false;

        if(c && c != 'false') {
            this.bibles = inEvent.bibles;
            this.buildLinks();
            this.render();
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
                button = 'pc';
                break;
            case '_next':
                button = 'nc';
                break;
        }

        button && this.$[button] && this.$[button].hasNode().click();
    }
});
