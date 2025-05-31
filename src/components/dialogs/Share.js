var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');
var Checkbox = require('enyo/Checkbox');
var i18nComponent = require('../Locale/i18nComponent');
var TextArea = require('enyo/TextArea');
var Image = require('../Image');
var utils = require('enyo/utils');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
// var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

// Todo - format clean up!

// Todo: Use Web Share API to use native device share dialogs!
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
// https://stackoverflow.com/questions/32176004/share-button-for-mobile-website-to-invoke-ios-android-system-share-dialogs

module.exports = kind({
    name: 'ShareDialog',    
    kind: Dialog,
    maxWidth: '400px',
    height: '320px',
    classes: 'bss_help_dialog bss_share_dialog',
    bibleString: null,
    ezCopy: false,
    shareContent: null,
    actuallyShowDialogForce: false,
    populated: false,
    resultsFilter: null,
    autoCopy: false,
    autoCopyIncLink: false,
    autoCopyIncFormat: true,

    titleComponents: [
        {classes: 'bss_header', components: [
            {kind: i18n, classes: 'bss_dialog_title', content: 'Share'}, 
        ]}
    ],

    bodyComponents: [
        {classes: 'bss_link_share_container', components: [
            {
                // kind: TextArea, 
                tag: 'p',
                name: 'CopyArea', 
                allowHtml: true,
                classes: 'bss_link_share', 
                attributes: {dir: 'auto'},
                _style: 'width: 98%'
            }
        ]},
        {
            kind: Signal,
            onShare: 'handleClickShare',
            onCopy: 'handleClickCopy',
        }
    ],

    buttonComponents: [
        {
            components: [
                {
                    kind: i18n, 
                    tag: 'label', 
                    content: 'Include Link',
                    attributes: {for: 'bss_share_inc_link'}
                },
                {tag: 'span', allowHtml: true, content: '&nbsp; &nbsp;'},
                {
                    kind: Checkbox, 
                    name: 'inc_link', 
                    id: 'bss_share_inc_link',
                    checked: true
                },            
                {tag: 'span', allowHtml: true, content: '&nbsp; &nbsp;'},
                {
                    kind: i18n, 
                    tag: 'label',
                    content: 'Include Formatting',
                    attributes: {for: 'bss_share_inc_format'}
                },
                {tag: 'span', allowHtml: true, content: '&nbsp; &nbsp;'},
                {
                    kind: Checkbox, 
                    name: 'inc_format', 
                    id: 'bss_share_inc_format'
                },
            ]
        },

        {tag: 'br'},
        
        {components: [
            {name: 'Copy', kind: Button, ontap: 'copy', components: [
                {kind: i18n, content: 'Copy'}
            ]},          
            {tag: 'span', allowHtml: true, content: '&nbsp; &nbsp; &nbsp; &nbsp;'},
            {name: 'Close', kind: Button, ontap: 'close', components: [
                {kind: i18n, content: 'Close'},
            ]}
        ]}
    ],

    handlers: {
        onLocaleChange: 'localeChanged'
    },

    bindings: [
        {from: 'app.UserConfig.copy', to: 'ezCopy', oneWay: false, transform: function(value, dir) {
            return value;
        }},             
    ],

    observers: [
        {method: 'watchRenderStyle', path: ['$.inc_format.checked', '$.inc_link.checked']},
    ],

    create: function() {
        if(this.multiColumn) {
            this.width = '1200px';
        }

        this.inherited(arguments);
    },
    close: function() {
        this.resultsFilter = null;
        this.app.set('shareShowing', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);

        var actuallyShowDialog = true;
        this.populated = false;

        // this.app && this.log('use nav share', this.useNavigationShare());

        if(this.useNavigationShare()) {
            actuallyShowDialog = navigator.share ? false : true;
        }

        if(is) {
            if(actuallyShowDialog || this.actuallyShowDialogForce) {
                this.populate(); 
            } else {                
                this.app.set('shareShowing', false);
                this.populate(); 
                this.copy();
            }
        } else {
            this.resultsFilter = null;
        }
    },
    forceShowing: function() {
        this.actuallyShowDialogForce = true;
        this.app.set('shareShowing', true);
        this.actuallyShowDialogForce = false;
    },
    useNavigationShare: function() {
        var useNavShare = this.app.get('configs').useNavigationShare || 'never',
            client = this.app.get('client');

        switch(useNavShare) {
            case 'always':
                return true;
                break;
            case 'mobile':
                return client.isMobile;
                break;
            case 'never':
            default :
                return false;
        }
    },
    watchRenderStyle: function(pre, cur, prop) {
        this.populated && this.populate();
    },
    handleClickShare: function(inSender, inEvent) {
        this.log('handleClickShare', inSender, inEvent);
        this.resultsFilter = utils.clone(inEvent);
        this.app.set('shareShowing', true);
    },
    handleClickCopy: function(inSender, inEvent) {
        this.log('handleClickCopy', inSender, inEvent);
        this.autoCopy = true;
        this.resultsFilter = utils.clone(inEvent);
        this.forceShowing();
        // this.populate();
        this.copyHelper();
        this.close();
        // this.resultsFilter = null;
        this.autoCopy = false;
    },
    populate: function() {
        var title = document.title,
            url = window.location.href,
            baseUrl = url.split('#'),
            baseUrl = baseUrl[0],
            responseData = this.app.get('responseDataNew') || this.app.get('responseData'),
            incLink = this.$.inc_link ? this.$.inc_link.get('checked') : true,
            limit = 0, // unlimited
            count = 0,
            content = '',
            bibleName = '',
            singleVerse = false,
            maxReached = false,
            nl = '<br />';

        this.app.clearSelection();

        if(this.autoCopy) {
            incLink = this.autoCopyIncLink;
        }

        this.shareContent = null;

        if(responseData.success) {
            var passages = responseData.results.results,
                bible = null,
                references = [];

            var filterChapter = null;
            var filterVerse = null;

            if(this.resultsFilter && this.resultsFilter.cva) {
                var sp = this.resultsFilter.cva.split(':');
                filterChapter = sp[0] || null;
                filterVerse = sp[1] || null;
            }

            mainLoop:
            for(var i in passages) {
                var p = passages[i];

                if(this.resultsFilter) {
                    if(this.resultsFilter.b && this.resultsFilter.b != p.book_id) {
                        continue;
                    }
                    if(this.resultsFilter.cv != p.chapter_verse) {
                        continue;
                    }

                    bible = this.resultsFilter.bible.split(',')[0];
                }

                if(bible == null) {
                    for(var b in p.verses) {

                        if(b && b != null && b != '0' && b != 0) {
                            if(typeof this.app.statics.bibles[b] == 'undefined') {
                                continue;
                            }

                            bible = b;
                            bibleName = this.app.statics.bibles[b].name;
                            break;
                        } 
                    }
                } else {
                    bibleName = this.app.statics.bibles[bible].name;
                }

                this.setCopyAreaClassesByBible(bible);

                var book_name = this.app.getLocaleBookName(p.book_id, p.book_name);
                
                singleVerse = p.single_verse || filterChapter && filterVerse;
                var chapterVerse = (filterChapter && filterVerse) ? this.resultsFilter.cva : p.chapter_verse;

                content += (singleVerse) ? '' : book_name + ' ' + p.chapter_verse + nl + nl;

                if(this.resultsFilter) {
                    url = baseUrl + '#/r/' + bible + '/' + book_name + '.' + chapterVerse;
                }

                if(!singleVerse) {
                    references.push(book_name + ' ' + p.chapter_verse);
                }

                for(var c in p.verse_index) {
                    for(var idx in p.verse_index[c]) {
                        var v = p.verse_index[c][idx];

                        if(filterChapter && filterVerse && (filterChapter != c || filterVerse != v)) {
                            continue;
                        }

                        var verse = p.verses[bible][c][v];
                        count ++;

                        content += (p.single_verse || filterVerse) ? book_name + ' ' + chapterVerse + nl : verse.verse + ' ';

                        if(singleVerse) {
                            references.push(book_name + ' ' + chapterVerse);
                        }

                        content += this.processText(verse.text);
                        
                        if(limit > 0 && count >= limit) {
                            content += (singleVerse) ? nl + nl +  '…' : ' …';
                            maxReached = true;
                            break mainLoop;
                        }

                        content += (singleVerse) ? nl + nl : nl;
                    }
                }

                content += (p.single_verse) ? '' : nl;
            }
        }

        // content += (maxReached) ? nl + nl : ''; // same regardles of singleVerse
        //content += (singleVerse) ? '' : nl + nl;
        content += bibleName;

        if(incLink) {
            content += nl + nl + nl + references.join('; ') + ' - ' + this.app.t('Bible SuperSearch') + nl + url;
        }

        this.$.CopyArea.set('content', content.trim());
        this.populated = true;

        this.$.CopyArea.hasNode() && this.$.CopyArea.hasNode().scrollTo({
            top: 0, 
            left: 0
        });
    },
    setCopyAreaClassesByBible: function(bible) {
        var bibleInfo = (typeof this.app.statics.bibles[bible] == 'undefined') ? null : this.app.statics.bibles[bible];

        if(!bibleInfo) {
            return ;
        }

        var classes = ['bss_link_share'];

        classes.push('bss_bible_text');
        classes.push('bss_bible_' + bibleInfo.module);
        classes.push(bibleInfo.rtl ? 'bss_rtl' : 'bss_ltr');

        this.$.CopyArea.set('classes', classes.join(' ')); 
    },
    handleVerseTap: function(inSender, inEvent) {
        this.close();
    },
    localeChanged: function(inSender, inEvent) {

    },
    copy: function() {
        if(this.share()) {
            return;
        }

        return this.copyHelper();
    },
    copyHelper: function() {
        return this.app._copyComponentContent(this.$.CopyArea, 'content');
    },
    share: function() {
        if(this.useNavigationShare() && navigator.share) {
            var promise = navigator.share({
                // text: this.shareContent,
                text: this.$.CopyArea.get('content'),
                title: document.title
            });

            promise.then(utils.bind(this, function() {
                this.app.debug && this.log('Successful share');
            }), 
            utils.bind(this, function() {
                this.app.debug && this.log('Failed to share 1');
                // Use our generic dialog in case the browser share dialog fails
                this.forceShowing();
            }));

            promise.catch(utils.bind(this, function(error) {
                this.app.debug && this.log('Failed to share 2');
                // Use our generic dialog in case the browser share dialog fails
                this.forceShowing();
            }));
            
            return true;
        }

        return false;
    },
    processText: function(text) {
        text = text.replace(/<[^<>]+>/g, ''); // strip HTML

        if(this.autoCopy) {
            var incFormat = this.autoCopyIncFormat;
        } else {
            var incFormat = this.$.inc_format ? this.$.inc_format.get('checked') : true;
        }

        // red letter - ERROR - using <> for red letter will COLLIDE with highlighting which sends back HTML!
        // U+2039, U+203A Single angle quotation marks (NOT <>)
        if(this.app.UserConfig.get('red_letter')) {
            // Do nothing?  Remove?
            text = text.replace(/[‹›]/g, '');
        }
        else {
            text = text.replace(/[‹›]/g, '');
        }

        // strongs
        if(incFormat && this.app.UserConfig.get('strongs')) {
            // do nothing
        }
        else {
            text = text.replace(/\} \{/g, '');
            text = text.replace(/\{[^\}]+\}/g, '');
        }

        // italics
        if(incFormat && this.app.UserConfig.get('italics')) {
            // do nothing
        }
        else {
            text = text.replace(/[\[\]]/g, '');
        }

        text = text.replace('¶ ', '');
        return text;
    },
});

