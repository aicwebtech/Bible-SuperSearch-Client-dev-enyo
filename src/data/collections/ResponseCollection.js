module.exports = {
    // Mutate the results data structure so that each verse is placed in it's own passage.
    toVerses: function(results, asMultiverse) {
        var resultsNew = [],
            singleVerse = (typeof asMultiverse == 'undefined' || !asMultiverse) ? true : false;

        for(i in results) {
            var p = results[i];

            if(p.single_verse) {
                p.single_verse = singleVerse;
                cv = p.chapter_verse.split(':');
                v = cv[1] || null;
                //p.nav = this.generateNav(p.book_id, cv[0], v);

                resultsNew.push(p);
                continue;
            }

            for(chapter in p.verse_index) {
                for(i in p.verse_index[chapter]) {
                    var verse = p.verse_index[chapter][i];

                    var pNew = {
                        book_id: p.book_id,
                        book_name: p.book_name,
                        book_raw: p.book_raw,
                        book_short: p.book_short,
                        chapter_verse: chapter + ':' + verse,
                        single_verse: singleVerse,
                        verse_index: {},
                        nav: this.generateNav(p.book_id, chapter, verse),
                        verses: {},
                        verse_count: 1,
                    };

                    pNew.verse_index[chapter] = [verse];

                    for(bible in p.verses) {
                        pNew.verses[bible] = {};
                        pNew.verses[bible][chapter] = {};
                        pNew.verses[bible][chapter][verse] = p.verses[bible][chapter][verse];
                    }

                    resultsNew.push(pNew);
                }
            }
        }

        return resultsNew;
    },
    toMultiversePassages: function(results) {
        for(i in results) {
            // p = results[i];

            if(results[i].single_verse) {
                results[i].single_verse = false;
                
                cv = results[i].chapter_verse.split(':');
                v = cv[1] || null;
                results[i].nav = this.generateNav(results[i].book_id, cv[0], v);
            }
        }

        return results;
    },
    generateNav: function(book, chapter, verse) {
        var nav = {};

        chapter = parseInt(chapter, 10);
        var pcc = this.prevChapter(book, chapter);
        var ncc = this.nextChapter(book, chapter);
        nav.pb = this.prevBook(book);        
        nav.nb = this.nextBook(book);
        nav.pcb = pcc[0];
        nav.pcc = pcc[1];
        nav.ncb = ncc[0];
        nav.ncc = ncc[1];
        nav.ccb = verse ? book : null;
        nav.ccc = verse ? chapter : null;

        return nav;
    },
    prevBook: function(book) {
        if(typeof this.bookChapters[book] == 'undefined') {
            return null;
        }

        if(book == 1) {
            return null;
        } else {
            return book - 1;
        }
    },    
    nextBook: function(book) {
        if(typeof this.bookChapters[book] == 'undefined') {
            return null;
        }

        if(book == 66) {
            return null;
        } else {
            return book + 1;
        }
    },
    prevChapter: function(book, chapter) {
        if(typeof this.bookChapters[book] == 'undefined') {
            return [null, null];
        }

        if(chapter == 1) {
            book = this.prevBook(book);
            return [book, this.bookChapters[book]]; // :X - get from book
        } else {
            return [book, chapter - 1];
        }
    },  
    nextChapter: function(book, chapter) {
        if(typeof this.bookChapters[book] == 'undefined') {
            return [null, null];
        }

        if(chapter == this.bookChapters[book]) {
            book = this.nextBook(book);
            chapter = (book) ? 1 : null;
        } else {
            chapter ++;
        }

        return [book, chapter];
    },

    bookChapters: [
        0,  // idx 0 => DNE
        50, // idx 1 => Genesis
        40, // idx 2 => Exodus
        27,
        36,
        34,
        24,
        21,
        4,
        31,
        24,
        22,
        25,
        29,
        36,
        10,
        13,
        10,
        42,
        50,
        31,
        12,
        8,
        66,
        52,
        5,
        48,
        12,
        14,
        3,
        9,
        1,
        4,
        7,
        3,
        3,
        3,
        2,
        14,
        4,
        28,
        16,
        24,
        21,
        28,
        16,
        16,
        13,
        6,
        6,
        4,
        4,
        5,
        3,
        6,
        4,
        3,
        1,
        13,
        5,
        5,
        3,
        5,
        1,
        1,
        1,
        22, // idx 66 => Revelation
    ]
};
