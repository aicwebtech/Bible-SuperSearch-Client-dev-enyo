module.exports = {
    app: null,
    setApp: function(app) {
        this.app = app;
    },
    routeRequest: function(value) {
        value = this.normalizeDashes(value);
        var field = false,
            nonPassageChars = this._containsNonPassageCharacters(value),
            passages = this.explodeReferences(value, true),
            book = (this.app && passages.length >= 1 && passages[0] && passages[0].book) ? this.app.findBookByName(passages[0].book) : null;

        // todo - migrate full logic here!

        // Treats as passage if 
        // * It's not empty AND 
        // * doesn't contain Strong's Numbers AND
        // * doesn't contain invalid characters for a reference (such as those used for boolean or REGEXP queries) AND 
        // * either
        //      1) It contains numbers but no (parentheses) or
        //      2) It resolves to multiple (possible) passages
        //      3) The book of the first passage resolves to an existing book AND a chapter (at least) is specified
        // Note: This passage-checking logic is specific to this method

        if(
            passages.length >= 1 &&
            !nonPassageChars && 
            !value.match(/[GHgh][0-9]+/) && 
            (
                value.match(/[0-9]/) && !value.match(/[()]/) || 
                passages.length >= 2 || 
                (book && passages[0].chapter_verse)
            ) 
        ) {
            field = 'reference';
        }
        else {
            // Todo, check for SINGLE PASSAGE here. 
            field = 'search';
        }

        return field;
    },

    // Warning, this isPassage may return false negatives as it's dependent on this.routeReuqest
    // Logic here needs to be replaced withe the actual "isPassage" logic from the API.
    isPassage: function(str) {
        return this.routeRequest(str) == 'reference' ? true : false;
    },

    disambiguateRequest: function(str) {
        var field = this.routeRequest(str);

        if(field == 'reference') {
            return null; // It's already a passage, no need to disambiguate
        }

        // Attempt to check for single book matches, and if so, return the book id as the disambiguation
        // All other passage parsing, ect has already been attempted in routeRequest, so we don't need to do that here.
        var book = this.app.findBookByName(str);

        if(book) {
            return book.id;
        }
        
        return null;
    },

    _containsNonPassageCharacters: function(str) {
        if(!str) {
            return false;
        }

        // migrated from PHP API.
        //nonPassageChars = str.match(/[`\\~!@#$%\^&*{}_[\]()]/);
        nonPassageChars = str.match(/[`\\~!@#$%\^&*{}_[\]]/); // now allowing ()?
        return nonPassageChars ? true : false;
    },

    explodeReferencesWithShortcuts: function(reference, separate_book) {
        var ref = this.explodeReferences(reference, false);

        ref.forEach(function(r) {
            
        }, this);

        return this.explodeReferences(ref.join('; '), separate_book);
    },
    explodeReferences: function(reference, separate_book) {
        separate_book = separate_book ? true : false;

        if(!reference) {
            return [];
        }

        // Normalize all dash variants (en/em dash, etc.) to a plain ASCII hyphen before
        // parsing, so book/chapter splitting and the chapter_verse sent to the API are
        // correct regardless of which dash the user typed (BSS-270).
        reference = this.normalizeDashes(reference);

        if(this._containsNonPassageCharacters(reference)) {
            return [];
        }

        exploded = [];
        ref_end  = reference.length - 1;
        book_end = false;

        for(pos = ref_end; pos >= 0; pos --) {
            char = reference.charAt(pos);

            if(!book_end && !char.match(/[0-9\s.,;:\- ]/) ) {
                book_end = pos;
            }
            else if(book_end && (char == ',' || char == ';' || pos == 0)) {
                bpos = (pos == 0) ? 0 : pos + 1;

                if(separate_book) {
                    book    = this._trim(this._substr(reference, bpos, book_end - pos + 1), ' .,;');
                    chapter = this._trim(this._substr(reference, book_end + 1, ref_end - book_end), ' .,;');
                    
                    exploded.push({
                        book: book,
                        chapter_verse: chapter
                    });
                }
                else {
                    ref = this._trim(this._substr(reference, bpos, ref_end - bpos + 1), ' .,;');
                    exploded.push(ref);
                }

                ref_end  = pos;
                book_end = false;
            }
        }

        return exploded.reverse(); // To keep the references in the same order that they were submitted
    },
    parseBook: function(ref) {
        if(!ref.book) {
            return ref;
        }

        // parseBook resolves book ranges via findBookByName, so an app must be set.
        // this.app should always be set (Passage.setApp) by the time we get here; fail
        // loudly rather than silently mis-splitting hyphenated book names (BSS-270).
        if(!this.app) {
            throw new Error('Passage.parseBook requires an app - call Passage.setApp() first.');
        }

        var bookNormalized = this.normalizeDashes(ref.book);

        if(bookNormalized.indexOf('-') !== -1) {
            // Some book names contain hyphens (e.g. Russian "1-Я Царств"), so try a direct
            // lookup first before treating the hyphen as a book-range separator.
            var Book = this.app.findBookByName(bookNormalized);

            if(Book) {
                ref.isBookRange = false;
                return ref;
            }

            // Book ranges are separated by '-', but some book names themselves contain
            // hyphens (e.g. Russian "1-Я Царств"). Try each hyphen as the split point and
            // use the first one where both sides resolve to a book, so ranges of hyphenated
            // book names (e.g. "1-Я Царств-2-Я Царств") are parsed correctly.
            var Book_St = null;
            var Book_En = null;

            for(var offset = bookNormalized.indexOf('-'); offset !== -1; offset = bookNormalized.indexOf('-', offset + 1)) {
                var left  = bookNormalized.substring(0, offset).trim();
                var right = bookNormalized.substring(offset + 1).trim();

                if(left === '' || right === '') {
                    continue;
                }

                var St = this.app.findBookByName(left);
                var En = this.app.findBookByName(right);

                if(St && En) {
                    Book_St = St;
                    Book_En = En;
                    break;
                }
            }

            if(Book_St && Book_En) {
                ref.isBookRange = true;
                ref.bookSt = Book_St.name;
                ref.bookEn = Book_En.name;
                return ref;
            }

            // Fallback for inputs the smart split could not fully resolve: keep treating
            // this as a range using the first/last segment, resolving each side to a
            // canonical book name where possible and preserving the raw text otherwise.
            // This keeps a partially-valid range (e.g. "Genesis-Foo") from collapsing and
            // dropping the endpoint that DID resolve.
            var books   = bookNormalized.split('-');
            var book_st = books.shift().trim();
            var book_en = books.pop();
            book_en = (book_en) ? book_en.trim() : book_st;

            var Book_St_fb = this.app.findBookByName(book_st);
            var Book_En_fb = this.app.findBookByName(book_en);

            ref.isBookRange = true;
            ref.bookSt = Book_St_fb ? Book_St_fb.name : book_st;
            ref.bookEn = Book_En_fb ? Book_En_fb.name : book_en;
            return ref;
        }

        ref.isBookRange = false;
        return ref;
    },
    normalizeDashes: function(str) {
        // replaces all dashes (hyphen, non-breaking hyphen, figure/en/em dash,
        // horizontal bar, minus sign, etc.) with a plain ASCII hyphen.
        if(str === null || typeof str === 'undefined') {
            return '';
        }
        str = String(str);
        return str.replace(/[\u2010\u2011\u2012\u2013\u2014\u2015\u2212]/g, '-');
    },
    _substr: function(str, offset, len) {
        return str.substring(offset, offset + len);
    },
    _trim: function(str, char) {
        return char ? this._trimChars(str, char) : str.trim();
    },
    _trimChars: function(str, chars) {
        var start = 0, 
            end = str.length;

        while(start < end && chars.indexOf(str[start]) >= 0) {
            ++ start;
        }

        while(end > start && chars.indexOf(str[end - 1]) >= 0) {
            -- end;
        }

        return (start > 0 || end < str.length) ? str.substring(start, end) : str;
    }
};