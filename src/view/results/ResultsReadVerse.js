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
        var dirClass = this.selectedBible.rtl ? 'rtl' : 'ltr';
        var text = this.processText(verse.text);
        
        // Table within table - this is ugly!
        // var verTd = '<td class=\'ver ' + dirClass + '\'><sup>' + reference + '</sup></td>';
        // var txtTd = '<td class=\'txt ' + dirClass + '\'>' + text + '</td>';        
        var verTd = '<td class=\'ver\'><sup>' + reference + '</sup></td>';
        var txtTd = '<td class=\'txt\'>' + text + '</td>';

        // var processed = '<td class=\'bss_' + dirClass + '\'><table class=\'bss_' + dirClass + '\'><tr>' + verTxt + '</tr></table></td>'; // known working
        var processed = '<td class=\'bss_' + dirClass + '\'><table><tr>' + verTd + txtTd + '</tr></table></td>';

        return processed;
    },
});
