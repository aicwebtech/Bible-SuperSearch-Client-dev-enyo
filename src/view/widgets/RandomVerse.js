// Random Verse Widget
// Built mainly for testing Enyo 2.7
// Will not actually be used by the app

var Ajax = require('enyo/Ajax');
var kind = require('enyo/kind');
var Button = require('enyo/Button');

var RandomVerse = kind({
    name: 'RandomVerse',
    classes: 'random_verse_widget',
    bible: 'kjv',
    label: 'Random Verse',
    components: [
        {name: 'Label', tag:'h2'},
        {kind: Button, content: "Fetch", ontap: "fetch"},
        {name: 'Container'}
    ],
    create: function() {
        this.inherited(arguments);
        this.$.Label.setContent(this.label);
    },
    fetch: function(inSender, inEvent) {
        var formData = {
            'reference': 'Random Verse',
            'bible': this.bible
        };

        var ajax = new Ajax({
            url: this.app.configs.apiUrl,
            method: 'GET'
        });

        ajax.go(formData); // for GET
        ajax.response(this, 'handleResponse');
        ajax.error(this, 'handleError');
    },
    handleResponse: function(inSender, inResponse) {
        this.showResults(inResponse.results);
    },
    handleError: function(inSender, inResponse) {
        var response = JSON.parse(inSender.xhrResponse.body);

        if(response.error_level == 5) {
            this.$.Container.setContent('An error has occurred');
        }
        else {
            this.showResults(response.results);
        }
    },
    showResults: function(results) {
        this.log(results);
        var text = results[0].book_name + ' ' + results[0].chapter_verse;
        
        for(chapter in results[0].verse_index) {
            this.log(chapter);
            
            results[0].verse_index[chapter].forEach(function(verse) {
                this.log('verse', verse);
                var module = this.bible;

                if(results[0].verses[module] && results[0].verses[module][chapter] && results[0].verses[module][chapter][verse]) {
                    this.log(results[0].verses[module][chapter][verse]);
                    text += ' ' + results[0].verses[module][chapter][verse].text;
                }
            }, this);
        }

        this.$.Container.setContent(text);
    }
 });

module.exports = RandomVerse;