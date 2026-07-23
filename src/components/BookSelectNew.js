var kind = require('enyo/kind');
var Select = require('./PseudoSelect/PseudoSelect');
var Passage = require('./Passage');
var Option = require('./PseudoSelect/PseudoOption');
var OptGroup = require('./PseudoSelect/PseudoOptGroup');

module.exports = kind({
    name: 'BookSelect',
    tag: 'span',
    classes: 'bss_bookselect',

    components: [
        {name: 'Book', kind: Select, onchange: 'handleBookChange', classes: 'bss_book'}, 
        {tag: 'span', content: ''},
        {name: 'Chapter', kind: Select, onchange: 'handleChapterChange', classes: 'bss_chapter'},
        {tag: 'span', content: ''},
        {name: 'Verse', kind: Select, onchange: 'handleVerseChange', classes: 'bss_verse'}
    ],

    handlers: {
        onLocaleChange: 'localeChanged',
        onClearFormWaterfall: 'clear',
        onBibleChange: 'handleBibleChange',
        onAvailableBooksChange: 'handleBibleChange'
    },

    defaultBook: 1,
    defaultChapter: 1,
    includeBlankValue: false,
    includeAllVerses: true,
    value: null,
    bookId: null,
    chapter: null,
    _internalSet: false,
    Passage: Passage,

    create: function() {
        this.inherited(arguments);
        this.Passage.setApp(this.app);
        this._createBookList();
        this._initDefault();
    },

    localeChanged: function(inSender, inEvent) {
        this.bookId = null;
        this._createBookList();
        this.render();
        this._populateFromValueHelper(this.get('value'));
    },

    _createBookList: function() {
        var BookList = this._getBookList();
        var t = this;

        this.$.Book.destroyOptionControls();
        this.$.Chapter.destroyOptionControls();

        if(this.includeBlankValue) {
            this.$.Book.createOptionComponent({
                content: '&nbsp;',
                allowHtml: true, //OK
                value: '0',
            });
        }  

        // BSS-266: create each testament optgroup lazily, only when a book of that testament
        // survives filtering, so a hidden Old Testament leaves no empty group / stray divider.
        var currentTestament = null;

        BookList.forEach(function(item) {
            if(!this.app.bookShowingInSelectors(item.id)) {
                return;
            }

            var testament = (item.id >= 40) ? 'nt' : 'ot';

            if(testament != currentTestament) {
                currentTestament = testament;

                this.$.Book.createOptionComponent({
                    kind: OptGroup,
                    label: this.app.t(testament == 'nt' ? 'New Testament' : 'Old Testament')
                });
            }

            this.$.Book.createOptionComponent({
                content: item.name,
                value: item.id,
                grouped: true
            });
        }, this);

        this.$.Book.initOptions();
        this.$.Chapter.initOptions();
    }, 
    _createChapterList: function(selected) {
        var bookId = this.$.Book.get('value');
        selected = typeof selected != 'undefined' ? selected : '1';

        if(bookId != this.bookId) {
            this.$.Chapter.destroyOptionControls();

            if(bookId == 0 || bookId == '0') {
                selected = null;

                if(this.includeBlankValue) {
                    selected = 0;

                    this.$.Chapter.createOptionComponent({
                        content: '',
                        value: '0',
                    });
                }
            } else {            
                var Book = this.app.getBook(bookId);
                var chapters = parseInt(Book.chapters, 10);
                
                for(var i = 1; i <= chapters; i++) {
                    this.$.Chapter.createOptionComponent({
                        content: i + '',
                        value: i + '',
                    });
                }
            }

            this.bookId = bookId;
            this.$.Chapter.initOptions();
        }

        if(selected) {
            this.$.Chapter.setSelectedByValue(selected);
        } else if(selected == null) {
            //this.$.Chapter.resetValue();
        } else {
            //this.$.Chapter.setSelected(0);
            //this.$.Chapter.resetValue();
        }
    },
    _createVerseList: function(selected) {
        var bookId = this.$.Book.get('value'),
            chapter = this.$.Chapter.get('value');

        selected = typeof selected != 'undefined' ? selected : '1';

        if(chapter != this.chapter) {
            this.$.Verse.destroyOptionControls();

            if(bookId == 0 || bookId == '0') {
                selected = null;

                if(this.includeBlankValue) {
                    selected = 0;

                    this.$.Verse.createOptionComponent({
                        content: '',
                        value: '0',
                    });
                }
            } else {            
                if(this.includeAllVerses) {
                    this.$.Verse.createOptionComponent({
                        content: this.app.t('Show full chapter'),
                        value: '0',
                    });
                }
                
                var Book = this.app.getBook(bookId);
                var verses = parseInt(Book.chapter_verses[chapter], 10);
                
                for(var i = 1; i <= verses; i++) {
                    this.$.Verse.createOptionComponent({
                        content: i + '',
                        value: i + '',
                    });
                }
            }

            this.bookId = bookId;
            this.$.Verse.initOptions();
        }

        if(selected) {
            this.$.Verse.setSelectedByValue(selected);
        }
    },

    valueChanged: function(was, is) {
        this.app.debug && this.log(was, is);

        if(!this._internalSet) {
            this._populateFromValueHelper(is);
        }
    },

    _populateFromValueHelper: function(value) {
        this.app.debug && this.log('value', value);

        if(!value || value == '') {
            return this._initDefaultRender();
        }

        var Passages = this.Passage.explodeReferences(value, true);

        if(!Passages || Passages.length > 1) {
            return this._selectNoneRender();
        }

        var Passage = Passages.shift();

        if(!Passage || !Passage.chapter_verse || Passage.chapter_verse.match(/[;,-]/)) {
            return this._selectNoneRender();
        }

        Passage.book && this.$.Book.setSelectedByContent(Passage.book);
        var bookId = this.$.Book.get('value');

        if(!bookId || bookId == '0') {
            return this._selectNoneRender();
        }

        var Book = this.app.getBook(bookId);
        var cv = Passage.chapter_verse.split(':');

        if(!this.includeAllVerses && !cv[1]) {
            return this._selectNoneRender();    
        }

        var defaultVerse = this.includeAllVerses ? '' : '1';
        var chapter = cv[0] || '1';
        var verse = cv[1] || defaultVerse;

        if(verse.match(/[;:,-]/)) {
            return this._selectNoneRender();
        }

        if(!Book) {
            return this._selectNoneRender();
        }

        var maxChapters = parseInt(Book.chapters, 10);
        var maxVerses = parseInt(Book.chapter_verses[chapter], 10);
        var chapterInt = parseInt(chapter, 10);
        var verseInt = parseInt(verse, 10);

        if(chapter == '0' || chapterInt < 0 || chapterInt > maxChapters || verse == '0' || verseInt < 0 || verseInt > maxVerses) {
            return this._selectNoneRender();
        }

        this._createChapterList(chapter);
        this.$.Chapter.renderOptionComponents();
        this.$.Chapter.setSelectedByValue(chapter);
        this._createVerseList(verse);
        this.$.Verse.renderOptionComponents();
        this.$.Verse.setSelectedByValue(verse);
    },
    handleBookChange: function(inSender, inEvent) {
        var bookId = inSender.get('value');

        if(bookId && bookId != '0') {
            var Book = this._getBookById(bookId);
            this._internalSet = true;
            this.set('value', Book.name + ' 1');
            this._internalSet = false;
            this._createChapterList();
            this.$.Chapter.renderOptionComponents();
            this.$.Chapter.setSelectedByValue('1');
            this._createVerseList();
            this.$.Verse.renderOptionComponents();
            this.$.Verse.setSelectedByValue(this.includeAllVerses ? "" : "1");
        } else {
            this._internalSet = true;
            this.set('value', '');
            this._internalSet = false;
            this._createChapterList();
            this.$.Chapter.renderOptionComponents();
            this._createVerseList();
            this.$.Verse.renderOptionComponents();
            this.$.Verse.setSelectedByValue(this.includeAllVerses ? '' : '1');
        }
    }, 
    handleChapterChange: function(inSender, inEvent) {
        var bookId = this.$.Book.get('value'),
            chapter = inSender.get('value');
        var Book = this._getBookById(bookId);

        var val = Book.name + ' ' + chapter;
            val += this.includeAllVerses ? '' : ':1';

        this._internalSet = true;
        this.set('value', val);
        this._internalSet = false;
        this._createVerseList();
        this.$.Verse.renderOptionComponents();
        this.$.Verse.setSelectedByValue(this.includeAllVerses ? '' : '1');
    }, 
    handleVerseChange: function(inSender, inEvent) {
        var bookId = this.$.Book.get('value'),
            chapter = this.$.Chapter.get('value'),
            verse = inSender.get('value');
        var Book = this._getBookById(bookId);

        var val = Book.name + ' ' + chapter;
            val += verse ? ':' + verse : '';

        this._internalSet = true;
        this.set('value', val);
        this._internalSet = false;
    },
    clear: function() {
        this._initDefault();
    },
    // BSS-266: when the selected Bible(s) change, rebuild the (filtered) book list and keep the
    // current selection if its book is still available, otherwise fall back to the first available book.
    handleBibleChange: function(inSender, inEvent) {
        if(!this.app.hideUnavailableBooksEnabled()) {
            return;
        }

        var value = this.get('value');
        var bookId = this._bookIdFromValue(value);

        this.bookId = null;
        this._createBookList();

        if(bookId && !this.app.bookShowingInSelectors(bookId)) {
            // A selected book is no longer available -> fall back to the first available book.
            this._selectFirstAvailableBook();
        } else {
            // Keep the current selection (or blank/default) against the rebuilt list.
            this.render();
            this._populateFromValueHelper(value);
        }
    },
    _bookIdFromValue: function(value) {
        if(!value) {
            return null;
        }

        var Passages = this.Passage.explodeReferences(value, true);

        if(!Passages || Passages.length != 1 || !Passages[0] || !Passages[0].book) {
            return null;
        }

        var Book = this.app.findBookByName(Passages[0].book);

        return Book ? Book.id : null;
    },
    _firstAvailableBook: function() {
        var BookList = this._getBookList();

        for(var i = 0; i < BookList.length; i++) {
            if(this.app.bookShowingInSelectors(BookList[i].id)) {
                return BookList[i];
            }
        }

        return null;
    },
    _selectFirstAvailableBook: function() {
        var Book = this._firstAvailableBook();

        if(!Book) {
            return this._selectNoneRender();
        }

        var defaultChapter = this.defaultChapter || 1;
        var defaultVerse = this.includeAllVerses ? '' : ':1';

        this.bookId = null;
        this.$.Book.setSelectedByValue(Book.id);
        this._createChapterList(defaultChapter);
        this._createVerseList(this.includeAllVerses ? '' : '1');

        this._internalSet = true;
        this.set('value', Book.name + ' ' + defaultChapter + defaultVerse);
        this._internalSet = false;

        this.render();
    },
    _effectiveDefaultBook: function() {
        if(!this.defaultBook) {
            return null;
        }

        if(this.app.bookShowingInSelectors(this.defaultBook)) {
            return this.defaultBook;
        }

        var Book = this._firstAvailableBook();

        return Book ? Book.id : this.defaultBook;
    },
    _getBookList: function() {
        var locale = this.app.get('locale');
        var BookList = this.app.localeBibleBooks[locale] || this.app.statics.books;
        return BookList;
    },
    _getBookById: function(bookId) {
        var BookList = this._getBookList();

        var Book = BookList.find( function(item) {
            return item.id == bookId;
        });

        return Book;
    },
    _initDefault: function() {
        // BSS-266: if the configured default book is hidden for the selected Bible(s), start on the
        // first available book (e.g. Matthew when only NT-only Bibles are selected).
        var defaultBook = this._effectiveDefaultBook();

        if(defaultBook) {
            defaultChapter = this.defaultChapter || 1;
            defaultVerse = this.includeAllVerses ? '' : ':1';
            this.$.Book.setSelectedByValue(defaultBook);
            this._createChapterList(defaultChapter);
            this._createVerseList(this.includeAllVerses ? '' : '1');
            var Book = this._getBookById(defaultBook);
            var val = Book.name + ' ' + defaultChapter + defaultVerse;
        } else {
            var val = '';
            this.$.Book.resetValue();
            this._createChapterList();
            this._createVerseList();
        }

        this._internalSet = true;
        this.set('value', val);
        this._internalSet = false;
    },
    _initDefaultRender: function() {
        this._initDefault();
        this.render();
    },
    _selectNone: function() {
        this.$.Book.resetValue();
        this._createChapterList();
        this._createVerseList();
    
        this._internalSet = true;
        this.set('value', '');
        this._internalSet = false;
    },
    _selectNoneRender: function() {
        this._selectNone();
        this.render();
    }
});
