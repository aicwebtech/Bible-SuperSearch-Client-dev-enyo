var kind = require('enyo/kind');
var ResultsBase = require('./ResultsReadBase');

module.exports = kind({
    name: 'ResultsReadVerse',
    kind: ResultsBase,

    processAssembleVerse: function(reference, verse) {
        return '<td>' + reference + '</td><td>' + this.processText(verse.text) + '</td>';
    },
    processAssembleVerse: function(reference, verse) {
        return reference + '  ' + this.processText(verse.text);
    },
    processAssemblePassageVerse: function(reference, verse) {
        // var processed = '<td class=\'ver\'><sup>' + reference + '</sup></td><td class=\'txt\'>' + this.processText(verse.text) + '</td>';
        // var processed = '<td><sup class=\'ver\'>' + reference + '</sup><span class=\'txt\'>' + this.processText(verse.text) + '</span></td>';
        var dirClass = this.selectedBible.rtl ? 'rtl' : 'ltr';
        var text = this.processText(verse.text);
        
        // Table within table - this is ugly!
        if(this.app.isRtl) {
            if(this.selectedBible.rtl) {
                // var processed = '<td><table><tr><td class=\'ver\'><sup>' + reference + '</sup></td><td class=\'txt rtl\'>' + text + '</td></tr></table></td>';
                // var processed = '<td><table class=\'rtl\'><tr><td class=\'txt rtl\'>' + text + '</td><td class=\'ver\'><sup>' + reference + '</sup></td></tr></table></td>';
                var processed = '<td><table><tr><td class=\'ver rtl\'><sup>' + reference + '</sup></td><td class=\'txt ltr\'>' + text + '</td></tr></table></td>';
            }
            else {
                var processed = '<td><table class=\'ltr\'><tr><td class=\'txt ltr\'>' + text + '</td><td class=\'ver\'><sup>' + reference + '</sup></td></tr></table></td>';
                // var processed = '<td><table><tr><td class=\'ver ltr\'><sup>' + reference + '</sup></td><td class=\'txt ltr\'>' + text + '</td></tr></table></td>';
            }
        }
        else {        
            if(this.selectedBible.rtl) {
                var processed = '<td><table class=\'rtl\'><tr><td class=\'txt rtl\'>' + text + '</td><td class=\'ver\'><sup>' + reference + '</sup></td></tr></table></td>';
            }
            else {
                var processed = '<td><table class=\'ltr\'><tr><td class=\'ver\'><sup>' + reference + '</sup></td><td class=\'txt ltr\'>' + text + '</td></tr></table></td>';
            }            
        }


        return processed;
    },
});
