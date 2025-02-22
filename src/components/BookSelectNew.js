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
        onClearFormWaterfall: 'clear'
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
                allowHtml: true,
                value: '0',
            });
        }  

        var tgroup = this.$.Book.createOptionComponent({
            kind: OptGroup,
            label: this.app.t('Old Testament')
        });

        BookList.forEach(function(item) {
            if(item.id == '40') {
                tgroup = this.$.Book.createOptionComponent({
                    kind: OptGroup,
                    label: this.app.t('New Testament')
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
        if(this.defaultBook) {
            defaultChapter = this.defaultChapter || 1;
            defaultVerse = this.includeAllVerses ? '' : ':1';
            this.$.Book.setSelectedByValue(this.defaultBook);
            this._createChapterList(defaultChapter);
            this._createVerseList(this.includeAllVerses ? '' : '1');
            var Book = this._getBookById(this.defaultBook);
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
