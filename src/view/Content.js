var kind = require('enyo/kind');
var RandomVerse = require('./widgets/RandomVerse');

var Content = kind({
    name: 'Content',
    classes: 'biblesupersearch_content',
    components: [
        {kind: RandomVerse},
        {kind: RandomVerse, bible: 'rvg', label: 'Random Verse - Spanish'},
        {kind: RandomVerse, bible: 'epee', label: 'Random Verse - Frence'},
    ]
});

module.exports = Content;