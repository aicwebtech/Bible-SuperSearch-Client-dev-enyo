var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Input = require('enyo/Input');
var Checkbox = require('enyo/Checkbox');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');
var inc = require('../../components/Locale/i18nComponent');
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

        this.log(inEvent);

        var ajax = new Ajax({
            url: this.app.configs.apiUrl + '/statistics',
            method: 'GET'
        });
        
        var formData = inEvent;
        formData.bible = JSON.stringify(this.app.getSelectedBibles());

        ajax.go(formData); // for GET
        ajax.response(this, 'handleResponse');
        ajax.error(this, 'handleError');
    },
    handleResponse: function(inSender, inEvent) {
        this.log(inSender, inEvent);
        this.renderResults(inEvent.results);
        this.$.container.render();
        this.app.setDialogShowing('Statistics', true);
    },
    handleError: function(inSender, inEvent) {
        this.log(inSender, inEvent);
    },
    renderResults: function(results) {
        this.$.container.destroyClientControls();

        for(bible in results) {
            var bibleInfo = this.app.statics.bibles[bible];

            var comp = this.$.container.createComponent({});
            comp.createComponent({tag: 'h2', content: bibleInfo.name});

            this._renderResultsHelper(comp, 'full', 'Full', results[bible]);
            this._renderResultsHelper(comp, 'book', 'Book', results[bible]);
            this._renderResultsHelper(comp, 'chapter', 'Chapter', results[bible]);
            this._renderResultsHelper(comp, 'passage', 'Passage', results[bible]);
        }

    },
    _renderResultsHelper: function(comp, section, label, data) {
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
