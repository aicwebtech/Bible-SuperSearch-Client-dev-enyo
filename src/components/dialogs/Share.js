var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');
var i18nComponent = require('../Locale/i18nComponent');
var TextArea = require('enyo/TextArea');
var Image = require('../Image');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
// var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

// Todo - format clean up!

module.exports = kind({
    name: 'ShareDialog',    
    kind: Dialog,
    maxWidth: '400px',
    height: '475px',
    classes: 'help_dialog share_dialog',
    bibleString: null,
    ezCopy: false,
    
    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, tag: 'h3', content: 'Share'}, 
        ]}
    ],

    bodyComponents: [
        // {kind: Signal, onFormResponseSuccess: 'handleFormResponse', onFormResponseError: 'handleFormError'},
        {classes: 'list start_list', name: 'ListContainer'}, 
        {classes: 'link_share_container', components: [
            {kind: TextArea, name: 'CopyArea', classes: 'link_share'}
        ]},
        {tag: 'br'}
    ],

    buttonComponents: [
        {name: 'Copy', kind: Button, ontap: 'copy', components: [
            {kind: i18n, content: 'Copy'},
        ]},          
        {tag: 'span', allowHtml: true, content: '&nbsp; &nbsp;'},
        // {name: 'CopyWithText', kind: Button, ontap: 'copyWithText', components: [
        //     {kind: i18n, content: 'Copy with Text'},
        // ]},        
        {tag: 'span', allowHtml: true, content: '&nbsp; &nbsp;'},
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
            console.log('copy_toggle', value, dir);
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

        if(is) {
            this.populate(); 
            this.$.ListContainer.render();
        }
    },
    populate: function() {
        var title = document.title,
            url = window.location.href,
            responseData = this.app.get('responseData'),
            limit = 7
            count = 0;

        var content = title + '\n\n' + url;

        if(responseData.success) {
            var passages = responseData.results.results,
                bible = null;

            content += '\n\n';

            mainLoop:
            for(var i in passages) {
                var p = passages[i];

                if(bible == null) {
                    for(var b in p.verses) {
                        this.log('b', b);

                        if(b && b != null && b != '0' && b != 0) {
                            if(typeof this.app.statics.bibles[b] == 'undefined') {
                                continue;
                            }

                            bible = b;
                            content += this.app.statics.bibles[b].name + '\n\n';
                            break;
                        } 
                    }
                }

                content += (p.single_verse) ? '' : p.book_name + ' ' + p.chapter_verse + '\n\n';

                for(var c in p.verse_index) {

                    for(var idx in p.verse_index[c]) {
                        count ++;
                        var v = p.verse_index[c][idx];
                        var verse = p.verses[bible][c][v];

                        content += (p.single_verse) ? p.book_name + ' ' + p.chapter_verse + '\n' : verse.verse + ' ';
                        content += this.processText(verse.text);
                        if(count >= limit) {
                            content += (p.single_verse) ? '\n…' : ' …';
                            break mainLoop;
                        }

                        content += (p.single_verse) ? '\n\n' : '\n';
                    }
                }

                content += (p.single_verse) ? '' : '\n';
            }
        }

        this.$.CopyArea.set('content', content.trim());
    },

    handleVerseTap: function(inSender, inEvent) {
        this.close();
    },
    localeChanged: function(inSender, inEvent) {

    },
    copy: function() {
        var n = this.$.CopyArea.hasNode();

        if(!n) {
            return;
        }

        // This code for selection all text in a HTML element was migrated from Bible SuperSearch version 3.0
        // This works, but there is probably a better way
        if (document.selection) {
            var div = document.body.createTextRange();
            div.moveToElementText(n);
            div.select();
        }
        else {
            var div = document.createRange();
            div.setStartBefore(n);
            div.setEndAfter(n);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(div);
        }

        try {
            var success = document.execCommand('copy');

            if(success) {
                alert('Copied to clipboard');
            }
            else {
                alert('Failed to copy');
            }
        }
        catch (e) {
            alert('Failed to copy');
        }
    },
    copyWithText: function() {
        this.set('ezCopy', true);
        // todo - enable link on EZ Copy here
        this.close();
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

