// This is the default "main" file, specified from the root package.json file
// The ready function is excuted when the DOM is ready for usage.

var ready = require('enyo/ready');
var App = require('./src/app');
var BSS = null;

ready(function () {
    BSS = new App();

    if(typeof QUnit == 'object') {
        QUnit.module("Basic Tests");
        QUnit.test("App instantiation", function( assert ) {
            assert.ok( BSS, "We expect the app instance to be truthy 2" );
        });

        // BSS-266: partial Bible (book_list) handling
        QUnit.module("BSS-266 Partial Bibles");

        var bookCount = function(map) {
            var n = 0;
            for(var k in map) { n++; }
            return n;
        };

        QUnit.test("parseBookList: nt keyword", function( assert ) {
            var m = BSS.parseBookList('nt');
            assert.equal(bookCount(m), 27, "NT contains 27 books");
            assert.ok(m[40] && m[66], "includes Matthew (40) and Revelation (66)");
            assert.notOk(m[39], "excludes Malachi (39)");
        });

        QUnit.test("parseBookList: ot keyword", function( assert ) {
            var m = BSS.parseBookList('ot');
            assert.equal(bookCount(m), 39, "OT contains 39 books");
            assert.ok(m[1] && m[39], "includes Genesis (1) and Malachi (39)");
            assert.notOk(m[40], "excludes Matthew (40)");
        });

        QUnit.test("parseBookList: entire keyword", function( assert ) {
            assert.equal(bookCount(BSS.parseBookList('entire')), 66, "entire contains all 66 books");
        });

        QUnit.test("parseBookList: blank/null => all books", function( assert ) {
            assert.equal(bookCount(BSS.parseBookList('')), 66, "blank string => all 66");
            assert.equal(bookCount(BSS.parseBookList(null)), 66, "null => all 66");
        });

        QUnit.test("parseBookList: mixed numeric + nt", function( assert ) {
            var m = BSS.parseBookList('1,2,3,4,5,32,nt');
            assert.ok(m[1] && m[5] && m[32], "includes listed OT books (Gen, Deut, Jonah)");
            assert.notOk(m[6], "excludes an unlisted OT book (Joshua)");
            assert.equal(bookCount(m), 33, "6 explicit OT books + 27 NT books");
        });

        QUnit.test("getAvailableBookIds: union and empty", function( assert ) {
            var savedBibles = BSS.statics.bibles;
            BSS.statics.bibles = { tr: {book_list: 'nt'}, wlc: {book_list: 'ot'} };
            BSS._bibleBookIdsCache = null;

            assert.equal(BSS.getAvailableBookIds([]), null, "no selection => null (all books)");
            assert.equal(bookCount(BSS.getAvailableBookIds(['tr'])), 27, "NT-only Bible => 27 books");
            assert.equal(bookCount(BSS.getAvailableBookIds(['tr', 'wlc'])), 66, "NT + OT Bibles => union of 66");

            BSS.statics.bibles = savedBibles;
            BSS._bibleBookIdsCache = null;
        });

        QUnit.test("getAvailableBookIds: string selection is not iterated char-by-char", function( assert ) {
            var savedBibles = BSS.statics.bibles;
            BSS.statics.bibles = { tr: {book_list: 'nt'}, wlc: {book_list: 'ot'} };
            BSS._bibleBookIdsCache = null;

            assert.equal(bookCount(BSS.getAvailableBookIds('tr')), 27, "single string module => 27 (NT), not treated as chars");
            assert.equal(bookCount(BSS.getAvailableBookIds('tr,wlc')), 66, "comma-joined string => union of 66");

            BSS.statics.bibles = savedBibles;
            BSS._bibleBookIdsCache = null;
        });

        QUnit.test("getAvailableBookIds: unknown module fails open (null)", function( assert ) {
            var savedBibles = BSS.statics.bibles;
            BSS.statics.bibles = { tr: {book_list: 'nt'} };
            BSS._bibleBookIdsCache = null;

            assert.equal(BSS.getAvailableBookIds(['nope']), null, "unknown module => null (show all books)");
            assert.equal(BSS.getAvailableBookIds(['tr', 'nope']), null, "any unknown module => null (can't safely filter)");

            BSS.statics.bibles = savedBibles;
            BSS._bibleBookIdsCache = null;
        });

        QUnit.test("parseBookList: unparseable list fails open to all 66", function( assert ) {
            assert.equal(bookCount(BSS.parseBookList('xyz')), 66, "garbage => all 66, not empty");
            assert.equal(bookCount(BSS.parseBookList('0')), 66, "out-of-range only => all 66, not empty");
        });

        // BSS.set('testing', true);
    }
}); 
