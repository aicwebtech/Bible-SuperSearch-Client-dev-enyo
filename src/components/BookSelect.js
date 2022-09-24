var kind = require('enyo/kind');
var Select = require('./Select');
var Passage = require('./Passage');

module.exports = kind({
    name: 'BookSelect',
    tag: 'span',

    components: [
        {name: 'Book', kind: Select, onchange: 'handleBookChange'}, 
        {tag: 'span', content: ''},
        {name: 'Chapter', kind: Select, onchange: 'handleChapterChange'}
    ],

    handlers: {
        onLocaleChange: 'localeChanged'
    },

    defaultBook: 1,
    defaultChapter: 1,
    value: null,
    bookId: null,
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

        this.$.Book.destroyClientControls();
        this.$.Chapter.destroyClientControls();

        BookList.forEach(function(item) {
            this.$.Book.createComponent({
                content: item.name,
                value: item.id
            });
        }, this);
    }, 

    _createChapterList: function(selected) {
        var bookId = this.$.Book.get('value');

        if(bookId != this.bookId) {
            var Book = this._getBookById(bookId);
            var chapters = parseInt(Book.chapters, 10);
            this.$.Chapter.destroyClientControls();

            for(var i = 1; i <= chapters; i++) {
                this.$.Chapter.createComponent({
                    content: i + '',
                    value: i + '',
                });
            }

            this.bookId = bookId;
        }


        if(selected) {
            this.$.Chapter.setSelectedByValue(selected);
        }
    },

    valueChanged: function(was, is) {
        this.log(was, is);

        if(!this._internalSet) {
            this._populateFromValueHelper(is);
        }
    },

    _populateFromValueHelper: function(value) {
        this.log('value', value);

        if(!value) {
            return;
        }

        var Passages = this.Passage.explodeReferences(value, true);

        if(!Passages) {
            return;
        }

        var Passage = Passages.shift();

        this.$.Book.setSelectedByContent(Passage.book);

        var cv = Passage.chapter_verse.split(':');
        var chapter = cv[0];
        this._createChapterList(chapter);
        this.$.Chapter.render();
    },

    handleBookChange: function(inSender, inEvent) {
        var bookId = inSender.get('value');
        var Book = this._getBookById(bookId);

        this._internalSet = true;
        this.set('value', Book.name);
        this._internalSet = false;
        this._createChapterList();
        this.$.Chapter.render();
    }, 

    handleChapterChange: function(inSender, inEvent) {
        var bookId = this.$.Book.get('value');
        var Book = this._getBookById(bookId);

        this._internalSet = true;
        this.set('value', Book.name + ' ' + inSender.get('value'));
        this._internalSet = false;
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
        this.$.Book.setSelectedByValue(this.defaultBook);
        this._createChapterList(this.defaultChapter);
        var Book = this._getBookById(this.defaultBook);
        this._internalSet = true;
        this.set('value', Book.name + ' ' + this.defaultChapter);
        this._internalSet = false;
    }
});
