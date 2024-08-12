var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Input = require('enyo/Input');
var Checkbox = require('enyo/Checkbox');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');
var inc = require('../../components/Locale/i18nComponent');
var FormBase = require('../../forms/FormBase');
var Ajax = require('enyo/Ajax');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'StatisticsDialog',
    kind: Dialog,
    maxWidth: '800px',
    height: '575px',
    classes: 'help_dialog',
    bibleString: null,

    titleComponents: [
        {classes: 'header', components: [
            {kind: i18n, classes: 'bss_dialog_title', name: 'title', content: 'Settings'}, 
        ]}
    ],

    bodyComponents: [
        {
            name: 'container',
            style: 'text-align: justify',
            classes: 'bss_bible_info_container',
            allowHtml: true,
            attributes: {dir: 'auto'},
            // attributes: {border: 1}
            tag: 'table',
        },    
        {
            name: 'FormBase', kind: FormBase,
        },
        {
            kind: Signal,
            onStatistics: 'handleOpen'
        }
    ],

    buttonComponents: [
        {name: 'Close', kind: Button, ontap: 'close', components: [
            {kind: i18n, content: 'Close'},
        ]}
    ],

    close: function() {
        this.app.setDialogShowing('Statistics', false);
    },
    handleOpen: function(inSender, inEvent) {
        this.$.title.set('content', inEvent.reference);

        var ajax = new Ajax({
            url: this.app.configs.apiUrl + '/statistics',
            method: 'GET'
        });
        
        var formData = inEvent;
        formData.reference = this.$.FormBase.mapPassages(formData.reference, false);
        formData.bible = JSON.stringify(this.app.getSelectedBibles());

        this.app.set('ajaxLoadingDelay', 100);

        ajax.go(formData); // for GET
        ajax.response(this, 'handleResponse');
        ajax.error(this, 'handleError');
    },
    handleResponse: function(inSender, inEvent) {
        this.app.set('ajaxLoadingDelay', false);
        this.renderResults(inEvent.results);
        this.$.container.render();
        this.app.setDialogShowing('Statistics', true);
    },
    handleError: function(inSender, inEvent) {
        this.app.set('ajaxLoadingDelay', false);
    },
    renderResults: function(results) {
        this.$.container.destroyClientControls();
        var numBibles = 0;
        var bibleHeader = [];

        for(bible in results) {
            numBibles ++;
        }

        var compact = numBibles > 3;

        for(bible in results) {
            var bibleInfo = this.app.statics.bibles[bible];

            if(compact) {
                bibleHeader.push(bibleInfo.shortname);
            } else {
                bibleHeader.push(bibleInfo.name);
            }
        }

        if(!compact) {
            var width = Math.floor(99 / numBibles);
            var props = 'colspan=\'2\' style=\'width:' + width + '%\' class=\'bss_center\'';
            var header = '<th ' + props + '>' + bibleHeader.join('</th><th ' + props + '>') + '</th>';
        } else if(bibleHeader.length > 1) {
            var header = '<th>&nbsp;</th><th>' + bibleHeader.join('</th><th>') + '</th>';
        } else {
            var header = '<th colspan=\'2\'>' + bibleHeader[0] + '</th>';
        }
        
        this.$.container.createComponent({tag: 'tr', content: header, allowHtml: true});

        this._renderResultsHelper('passage', 'Passage', results, bibleHeader.length, compact);
        this._renderResultsHelper('chapter', 'Chapter', results, bibleHeader.length, compact);
        this._renderResultsHelper('book', 'Book', results, bibleHeader.length, compact);
        this._renderResultsHelper('full', 'Full', results, bibleHeader.length, compact);
    },
    _renderResultsHelper: function(section, label, results, numBibles, compact) {

        var rows = [];
        var possible = [
            ['num_books', 'Books'],
            ['num_chapters', 'Chapters'],
            ['num_verses', 'Verses'],

            ['num_length', 'Characters'],
            ['num_letters', 'Letters'],
            ['num_words', 'Words'],
            ['num_syllables', 'Syllables'],
            ['num_sentences', 'Sentences'],
            // ['read_fk_ease', 'Flesch-Kincaid Reading Ease'],
            // ['read_fk_grade_level', 'Flesch-Kincaid Grade Level'],

            ['book_position', 'Book Position'],
            ['chapter_position', 'Chapter Position'],
            ['verse_position', 'Verse Position'],
        ];

        var hasReference = false,
            reference = null;

        for(bible in results) {
            if(typeof results[bible][section] == 'undefined') {
                return;
            }

            if(results[bible][section].reference) {
                reference = this._assembleReference(results[bible][section].reference, results[bible][section].type);
                break;
            }
        }

        if(compact) {
            var blankRow = '<td colspan=\'' + (numBibles + 1) + '\'>&nbsp;</td>';
        } else {
            var blankRow = '<td colspan=\'' + (numBibles * 2) + '\'>&nbsp;</td>';
        }

        rows.push(blankRow);

        if(compact) {
            if(reference) {
                rows.push('<th>' + this.app.t(label) + '</th><td colspan=\'' + numBibles + '\'>' + reference + '</td>');
            } else {
                rows.push('<th>' + this.app.t(label) + '</th>');
            }
        } else {
            if(reference) {
                rows.push('<th>' + this.app.t(label) + '</th><td colspan=\'' + (numBibles * 2 - 1) + '\'>' + reference + '</td>');
            } else {
                rows.push('<th>' + this.app.t(label) + '</th>');
            }
        }

        rows.push(blankRow);

        for(i in possible) {            
            var row = [];
            var idx = possible[i][0];
            var label = this.app.t(possible[i][1]);
            var has = false;

            for(bible in results) {
                if(typeof results[bible][section] == 'undefined') {
                    return;
                }

                if(!compact) {
                    row.push(label);
                }

                if(!results[bible][section][idx]) {
                    row.push('&nbsp;');
                } else {
                    row.push(results[bible][section][idx]);
                    has = true;
                }
            }

            if(has) {                
                compact && row.unshift(label);
                rows.push('<td>' + row.join('</td><td>') + '</td>');
            }
        }

        for(i in rows) {
            this.$.container.createComponent({tag: 'tr', content: rows[i], allowHtml: true});
        }
    },

    _assembleReference: function(reference, type) {
        switch(type) {
            case 'chapter':
            case 'passage':
                var book = this.app.getLocaleBookName(reference.book);
                break;
            case 'book':
                var book = this.app.getLocaleBookName(reference.book_st);

                if(reference.book_en) {
                    book += ' - ' + this.app.getLocaleBookName(reference.book_en);
                }

                break;
            case 'full':
            default:
                var book = null;
        }

        if(!book) {
            return '';
        }

        return reference.chapter_verse ? book + ' ' + reference.chapter_verse : book;
    },

    _renderResultsHelperVertical: function(comp, section, label, data) {
        if(typeof data[section] == 'undefined') {
            return;
        }

        var components = [];
        var possible = [
            ['num_books', 'Books'],
            ['num_chapters', 'Chapters'],
            ['num_verses', 'Verses'],
            ['book_position', 'Book Position'],
            ['chapter_position', 'Chapter Position'],
            ['verse_position', 'Verse Position'],
        ];

        components.push({tag: 'h3', kind: i18n, content: label});

        for(i in possible) {            
            var idx = possible[i][0];

            if(!data[section][idx]) {
                continue;
            }

            components.push({
                components: [
                    {kind: i18n, content: possible[i][1] + ': '},
                    {tag: 'span', content: data[section][idx]}
                ]
            });
        }

        comp.createComponents(components);
    }
});
