var kind = require('enyo/kind');
var Select = require('./Select');
var Passage = require('./Passage');
var Option = require('enyo/Option');

module.exports = kind({
    name: 'BookSelect',
    tag: 'span',
    classes: 'bookselect',

    components: [
        {name: 'Book', kind: Select, onchange: 'handleBookChange', classes: 'book'}, 
        {tag: 'span', content: ''},
        {name: 'Chapter', kind: Select, onchange: 'handleChapterChange', classes: 'chapter'}
    ],

    handlers: {
        onLocaleChange: 'localeChanged',
        onClearFormWaterfall: 'clear'
    },

    defaultBook: 1,
    defaultChapter: 1,
    includeBlankValue: false,
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

        if(this.includeBlankValue) {
            this.$.Book.createComponent({
                content: '',
                value: '0',
            });
        }

        // var tgroup = this.$.Book.createComponent({
        //     tag: 'optgroup',
        //     attributes: {
        //         label: this.app.t('Old Testament')
        //     }
        // });

        BookList.forEach(function(item) {
            // if(item.id == '40') {
            //     tgroup = this.$.Book.createComponent({
            //         tag: 'optgroup',
            //         attributes: {
            //             label: this.app.t('New Testament')
            //         }
            //     });
            // }

            // tgroup.createComponent({
            //     kind: Option,
            //     content: item.name,
            //     value: item.id,
            //     owner: this.$.Book
            // });

            this.$.Book.createComponent({
                content: item.name,
                value: item.id,
                style: item.id == 39 ? 'border-bottom: 2px solid black' : null
            });
        }, this);
    }, 

    _createChapterList: function(selected) {
        var bookId = this.$.Book.get('value');
        selected = typeof selected != 'undefined' ? selected : '1';

        if(bookId != this.bookId) {
            this.$.Chapter.destroyClientControls();

            if(bookId == 0) {
                if(this.includeBlankValue) {
                    this.$.Chapter.createComponent({
                        content: '',
                        value: '0',
                    });
                }
            } else {            
                var Book = this.app.getBook(bookId);
                var chapters = parseInt(Book.chapters, 10);
                this.$.Chapter.destroyClientControls();
                
                for(var i = 1; i <= chapters; i++) {
                    this.$.Chapter.createComponent({
                        content: i + '',
                        value: i + '',
                    });
                }
            }


            this.bookId = bookId;
        }


        if(selected) {
            this.$.Chapter.setSelectedByValue(selected);
        } else {
            this.$.Chapter.setSelected(0);
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

        if(!Passage || !Passage.chapter_verse || Passage.chapter_verse.match(/[;,:-]/)) {
            return this._selectNoneRender();
        }

        Passage.book && this.$.Book.setSelectedByContent(Passage.book);

        var cv = Passage.chapter_verse.split(':');
        var chapter = cv[0];
        this._createChapterList(chapter);
        this.$.Chapter.render();
        this.$.Chapter.setSelectedByValue(chapter);
    },

    handleBookChange: function(inSender, inEvent) {
        var bookId = inSender.get('value');

        if(bookId && bookId != '0') {
            var Book = this._getBookById(bookId);
            this._internalSet = true;
            this.set('value', Book.name + ' 1');
            this._internalSet = false;
            this._createChapterList();
            this.$.Chapter.render();
            this.$.Chapter.setSelectedByValue('1');
        } else {
            this._internalSet = true;
            this.set('value', '');
            this._internalSet = false;
            this._createChapterList();
            this.$.Chapter.render();
        }
    }, 

    handleChapterChange: function(inSender, inEvent) {
        var bookId = this.$.Book.get('value');
        var Book = this._getBookById(bookId);

        this._internalSet = true;
        this.set('value', Book.name + ' ' + inSender.get('value'));
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
            this.$.Book.setSelectedByValue(this.defaultBook);
            this._createChapterList(defaultChapter);
            var Book = this._getBookById(this.defaultBook);
            var val = Book.name + ' ' + defaultChapter;
        } else {
            var val = '';
            this.$.Book.setSelected(0);
            this._createChapterList();
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
    
        this._internalSet = true;
        this.set('value', '');
        this._internalSet = false;
    },
    _selectNoneRender: function() {
        this._selectNone();
        this.render();
    }
});
