var kind = require('enyo/kind');
var Opt = require('./PseudoOption');
var i18n = require('../Locale/i18nComponent');
var PseudoAutocomplete = require('./PseudoAutocomplete');
var Input = require('enyo/Input');
var Signal = require('../../components/Signal')

module.exports = kind({
    name: 'PseudoAutocompleteReference',
    kind: PseudoAutocomplete,

    generateAutocompleteOptions: function(value) {
        var opts = [],
            lastComma = value.lastIndexOf(','),
            lastSemiColon = value.lastIndexOf(';'),
            split = Math.max(lastComma, lastSemiColon),
            valuePrefix = value.substring(0, split + 1),
            valueBook = value.substring(split + 1).trimStart(),
            contentPrefix = valuePrefix ? '... ' : '';
        
        valuePrefix += valuePrefix ? ' ' : '';

        // this.log('value', value);
        // this.log('valuePrefix', valuePrefix);
        // this.log('valueBook', valueBook);

        if(!valueBook || valueBook == '' || valueBook.length < this.app.configs.autocompleteThreshold) {
            return [];
        }

        var books = this.getBooksByName(valueBook);

        if(!books || books.length == 0) {
            return [];
        }

        books.forEach(function(item) {
            opts.push({content: contentPrefix + item.name, value: valuePrefix + item.name});
        });

        return opts;
    }, 
    getBooksByName: function(bookName) {
        var locale = this.app.get('locale');
        bookName = this.app._fmtBookNameMatch(bookName, locale);
        var BookList = this.app.localeBibleBooks[locale] || this.app.statics.books;

        var matchAnywhere = (!this.app.configs.autocompleteMatchAnywhere || this.app.configs.autocompleteMatchAnywhere == 'false') ? false : true;
        var matchOn = 'fn'; // fn or sn

        // Pass 1: Exact match
        var books = BookList.filter(function(bookItem) {
            if(bookName == bookItem[matchOn]) {
                return true;
            }

            // if(bookItem.matching && bookItem.matching.includes && bookItem.matching.includes(bookName)) {
            //     return true;
            // }

            // var namePeriodToSpace = bookItem.fn.replace(/\./g,' ');

            // if(bookName == namePeriodToSpace) {
            //     return true;
            // }

            return false;
        });

        // Pass 2: Partial match
        if(!books || books.length == 0) {
            books = BookList.filter(function(bookItem) {
                var pos = bookItem[matchOn].indexOf(bookName);

                if(matchAnywhere && pos != -1 || !matchAnywhere && pos == 0) {
                    return true;
                }

                return false;
            });
        }

        // Pass 3: (Experimental) Partial match, ignoring pumctuation
        if(!books || books.length == 0) {
            var bookNameNoPunc = bookName.replace(/[ .;:]/g, ' ');

            books = BookList.filter(function(bookItem) {
                var pos = bookItem[matchOn].replace(/[ .;:]/g, ' ').indexOf(bookNameNoPunc);

                if(matchAnywhere && pos != -1 || !matchAnywhere && pos == 0) {
                    return true;
                }

                return false;
            });
        }

        return books;
    }
});