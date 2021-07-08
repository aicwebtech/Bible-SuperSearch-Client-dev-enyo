module.exports = {
    // Mutate the results data structure so that each verse is placed in it's own passage.
    toVerses: function(results) {
        var resultsNew = [];

        for(i in results) {
            var p = results[i];

            if(p.single_verse) {
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
                        single_verse: true,
                        verse_index: {},
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
    }
};