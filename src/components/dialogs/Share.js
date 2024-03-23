var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');
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
    classes: 'help_dialog share_dialog',
    bibleString: null,
    ezCopy: false,
    shareContent: null,
    actuallyShowDialogForce: false,
    
    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, classes: 'bss_dialog_title', content: 'Share'}, 
        ]}
    ],

    bodyComponents: [
        // {kind: Signal, onFormResponseSuccess: 'handleFormResponse', onFormResponseError: 'handleFormError'},
        {classes: 'link_share_container', components: [
            {kind: TextArea, name: 'CopyArea', classes: 'link_share', _style: 'width: 98%'}
        ]},
        // {tag: 'br'}
    ],

    buttonComponents: [
        {name: 'Copy', kind: Button, ontap: 'copy', components: [
            {kind: i18n, content: 'Copy'}
            // {tag: 'span', content: '&nbsp;', allowHtml: true},
            // {tag: 'span', classes: 'material-icons icon material-icons-small-button', content: 'share'}
        ]},          
        {tag: 'span', allowHtml: true, content: '&nbsp; &nbsp; &nbsp; &nbsp;'},
        {name: 'Close', kind: Button, ontap: 'close', components: [
            {kind: i18n, content: 'Close'},
        ]}
    ],

    handlers: {
        onLocaleChange: 'localeChanged',
        // onFormResponseSuccess: 'handleFormResponse'
    },

    bindings: [
        {from: 'app.UserConfig.copy', to: 'ezCopy', oneWay: false, transform: function(value, dir) {
            return value;
        }},             
    ],

    create: function() {
        if(this.multiColumn) {
            this.width = '1200px';
        }

        this.inherited(arguments);
    },
    close: function() {
        this.app.set('shareShowing', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);

        var actuallyShowDialog = navigator.share ? false : true;

        if(is) {
            if(actuallyShowDialog || this.actuallyShowDialogForce) {
                this.populate(); 
            } else {                
                this.app.set('shareShowing', false);
                this.populate(); 
                this.copy();
            }
        }
    },
    forceShowing: function() {
        this.actuallyShowDialogForce = true;
        this.app.set('shareShowing', true);
        this.actuallyShowDialogForce = false;
    },
    populate: function() {
        var title = document.title,
            url = window.location.href,
            responseData = this.app.get('responseData'),
            // limit = 7,
            limit = 0, // unlimited
            count = 0,
            content = '',
            bibleName = '',
            singleVerse = false,
            maxReached = false;

        this.shareContent = null;

        if(responseData.success) {
            var passages = responseData.results.results,
                bible = null,
                references = [];

            mainLoop:
            for(var i in passages) {
                var p = passages[i];

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
                }

                var book_name = this.app.getLocaleBookName(p.book_id, p.book_name);

                content += (p.single_verse) ? '' : book_name + ' ' + p.chapter_verse + '\n\n';

                if(!p.single_verse) {
                    references.push(book_name + ' ' + p.chapter_verse);
                }

                for(var c in p.verse_index) {
                    for(var idx in p.verse_index[c]) {
                        count ++;
                        var v = p.verse_index[c][idx];
                        var verse = p.verses[bible][c][v];

                        content += (p.single_verse) ? book_name + ' ' + p.chapter_verse + '\n' : verse.verse + ' ';

                        if(p.single_verse) {
                            references.push(book_name + ' ' + p.chapter_verse);
                        }

                        content += this.processText(verse.text);
                        
                        if(limit > 0 && count >= limit) {
                            content += (p.single_verse) ? '\n\n…' : ' …';
                            maxReached = true;
                            break mainLoop;
                        }

                        content += (p.single_verse) ? '\n\n' : '\n';
                    }
                }

                content += (p.single_verse) ? '' : '\n';
                singleVerse = p.single_verse;
            }
        }

        content += (maxReached) ? '\n\n' : ''; // same regardles of singleVerse
        //content += '\n' + bibleName + '\n\n\n' + title + '\n' + url;
        //this.shareContent = content;

        content += '\n' + bibleName + '\n\n\n' + references.join('; ') + ' - ' + this.app.t('Bible SuperSearch') + '\n' + url;
        this.$.CopyArea.set('content', content.trim());
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
        if(navigator.share) {
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
        if(this.app.UserConfig.get('strongs')) {
            // do nothing
        }
        else {
            text = text.replace(/\} \{/g, '');
            text = text.replace(/\{[^\}]+\}/g, '');
        }

        // italics
        if(this.app.UserConfig.get('italics')) {
            // do nothing
        }
        else {
            text = text.replace(/[\[\]]/g, '');
        }

        text = text.replace('¶ ', '');
        return text;
    },
});

