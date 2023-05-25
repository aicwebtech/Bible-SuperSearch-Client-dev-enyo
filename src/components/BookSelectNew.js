var kind = require('enyo/kind');
var Select = require('./PseudoSelect/PseudoSelect');
var Passage = require('./Passage');
var Option = require('./PseudoSelect/PseudoOption');
var OptGroup = require('./PseudoSelect/PseudoOptGroup');

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
        onLocaleChange: 'localeChanged'
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

        this.$.Book.destroyOptionControls();
        this.$.Chapter.destroyOptionControls();

        if(this.includeBlankValue) {
            this.$.Book.createOptionComponent({
                content: '&nbsp;',
                allowHtml: true,
                value: '0',
            });
        }  

        // if(this.includeBlankValue) {
        //     this.$.Book.createOptionComponent({
        //         content: ' ',
        //         allowHtml: true,
        //         value: '0',
        //     });
        // }             

        // if(this.includeBlankValue) {
        //     this.$.Book.createOptionComponent({
        //         content: '(blank)',
        //         allowHtml: true,
        //         value: '0',
        //     });
        // }

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
                //style: item.id == 39 ? 'border-bottom: 2px solid black' : null,
                grouped: true
            });
        }, this);

        this.$.Book.initOptions();
        this.$.Chapter.initOptions();
    }, 

    _createChapterList: function(selected) {
        var bookId = this.$.Book.get('value');
        selected = typeof selected != 'undefined' ? selected : '1';

        // this.log('bookId', bookId);
        // this.log('this.bookId', this.bookId);

        if(bookId != this.bookId) {
            this.$.Chapter.destroyOptionControls();
                // this.log('book changed');

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
                var Book = this._getBookById(bookId);
                var chapters = parseInt(Book.chapters, 10);
                //this.$.Chapter.destroyClientControls();
                
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

        // this.log('selected', selected);

        if(selected) {
            this.$.Chapter.setSelectedByValue(selected);
        } else if(selected == null) {
            //this.$.Chapter.resetValue();
        } else {
            //this.$.Chapter.setSelected(0);
            //this.$.Chapter.resetValue();
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
            this._initDefault();
            this.render();
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
        this.$.Chapter.renderOptionComponents();
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
            this.$.Chapter.renderOptionComponents();
            this.$.Chapter.setSelectedByValue('1');
        } else {
            this._internalSet = true;
            this.set('value', '');
            this._internalSet = false;
            this._createChapterList();
            this.$.Chapter.renderOptionComponents();
        }
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
        if(this.defaultBook) {
            defaultChapter = this.defaultChapter || 1;
            this.$.Book.setSelectedByValue(this.defaultBook);
            this._createChapterList(defaultChapter);
            var Book = this._getBookById(this.defaultBook);
        } else {
            var val = '';
            //this.$.Book.setSelected(0);
            this.$.Book.resetValue();
            this._createChapterList();
        }

        this._internalSet = true;
        this.set('value', val);
        this._internalSet = false;
    }
});
