// var kind = require('enyo/kind');

var bssUtils = require('../../lib/Utils');

// Generic JavaScript object, not an enyo kind
module.exports = {
    buildReferenceLink: function() {
        var mode  = arguments[0] || 'p';
        var bible = arguments[1] || null;
        var book  = arguments[2] || '';
        var chapt = arguments[3] || null;
        var verse = arguments[4] || null;
        var chaptEnd = arguments[5] || null;
        var verseEnd = arguments[6] || null;

        // The arrow function here is valid JavaScript, but compiler doesn't think so ... 
        //var bible = (bible) ? bible.filter((b) => b != 0 && b != null).join(',') : '';
        
        var bible = (bible) ? bible.filter(function(b) {return b != 0 && b != null}).join(',') : '';

        var hasChaptRange = chapt && chaptEnd && chapt != chaptEnd;
        var hasVerseRange = verse && verseEnd && verse != verseEnd;

        if(hasChaptRange && !hasVerseRange && verse) {
            // unprocessable link, remove verse, fallback to chapter range link
            verse = null;
        }

        // Determine if we need a generic link (for ranges)
        if(hasChaptRange && hasVerseRange) {
            // pull mode based on whether form has a request 'q' or 'reference' 'r'
            mode = 'r';
        }

        var link = '#/' + mode + '/' + bible + '/' + book;

        if(hasChaptRange && hasVerseRange) {
            link += ' ' + chapt + ':' + verse + '-' + chaptEnd + ':' + verseEnd;
        } else {
            if(chapt) {
                link += '/' + chapt;

                if(hasChaptRange) {
                    link += '-' + chaptEnd;
                }
            }        

            if(verse) {
                link += '/' + verse;

                if(hasVerseRange) {
                    link += '-' + verseEnd;
                }
            }
        }

        link = link.replace(/\s+/g, '.');
        return link;
    },    
    buildSignalLink: function() {
        var signal  = arguments[0] || 'p';
        var bible = arguments[1] || null;
        var book  = arguments[2] || '';
        var chapt = arguments[3] || null;
        var verse = arguments[4] || null;

        var bible = (bible) ? bible.filter(function(b) {return b != 0 && b != null}).join(',') : '';

        var opts = {
            bible: bible,
            reference: book
        };

        if(chapt) {
            opts.reference += ' ' + chapt;
        }        

        if(verse) {
            opts.reference += ':' + verse;
        }

        // var optsStr = '{bible:' + bible + ',reference:\'' + opts.reference + '\'}';
        // Values are interpolated into single-quoted JS string literals inside a javascript: URL,
        // so escape them to prevent breaking out of the string context.
        var optsStr = '{bible:\'' + bssUtils.escapeJsString(bible) + '\',reference:\'' + bssUtils.escapeJsString(opts.reference) + '\'}';

        var link = 'javascript: biblesupersearch.app.s(\'' + bssUtils.escapeJsString(signal) + '\',' + optsStr + ')';

        return link;
    },
    buildPassageSignalLink: function() {
        var signal  = arguments[0] || 'p';
        var bible = arguments[1] || null;
        var passage  = arguments[2] || '';

        var bible = (bible) ? bible.filter(function(b) {return b != 0 && b != null}).join(',') : '';

        var opts = {
            bible: bible,
            b: passage.book_id,
            cv: passage.chapter_verse,
            cva: passage.chapter_verse_actual ? ', cva:\'' + bssUtils.escapeJsString(passage.chapter_verse_actual) + '\'' : '',
        };

        // var optsStr = '{bible:' + bible + ',reference:\'' + opts.reference + '\'}';
        // Values are interpolated into single-quoted JS string literals inside a javascript: URL,
        // so escape them to prevent breaking out of the string context.
        var optsStr = '{bible:\'' + bssUtils.escapeJsString(opts.bible) + '\',b:\'' + bssUtils.escapeJsString(opts.b) + '\', cv:\'' + bssUtils.escapeJsString(opts.cv) + '\'' + opts.cva + '}';

        var link = 'javascript: biblesupersearch.app.s(\'' + bssUtils.escapeJsString(signal) + '\',' + optsStr + ')';

        return link;
    }
};
