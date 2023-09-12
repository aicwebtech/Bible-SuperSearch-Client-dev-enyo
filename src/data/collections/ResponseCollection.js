module.exports = {
    // Mutate the results data structure so that each verse is placed in it's own passage.
    toVerses: function(results, asMultiverse) {
        asMultiverse = true;

        var resultsNew = [],
            singleVerse = (typeof asMultiverse == 'undefined' || !asMultiverse) ? true : false;

        for(i in results) {
            var p = results[i];

            if(p.single_verse) {
                p.single_verse = singleVerse;
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
    toMultiverse: function(results) {

    },
    generateNav: function(book, chapter, verse) {
        var nav = {};

        chapter = parseInt(chapter, 10);

        console.log(book, chapter, verse);


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
        if(book == 1) {
            return null;
        } else {
            return book - 1;
        }
    },    
    nextBook: function(book) {
        if(book == 66) {
            return null;
        } else {
            return book + 1;
        }
    },
    prevChapter: function(book, chapter) {
        if(chapter == 1) {
            book = this.prevBook(book);
            return [book, 999]; // :X - get from book
        } else {
            return [book, chapter - 1];
        }
    },  
    nextChapter: function(book, chapter) {
        return [book, chapter + 1]; // :X - get from book

        if(chapter == 1) {
            book = this.nextBook(book);
            return 999; // :X - get from book
        } else {
            return chapter + 1;
        }
    }
};