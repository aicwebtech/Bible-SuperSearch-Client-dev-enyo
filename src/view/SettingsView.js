var kind = require('enyo/kind');
var RandomVerse = require('./widgets/RandomVerse');

module.exports = kind({
    name: 'SettingsView',
    classes: 'biblesupersearch_content',
    components: [
        {content: 'settings view'},
        {kind: RandomVerse},
        {kind: RandomVerse, bible: 'rvg', label: 'Random Verse - Spanish'},
        {kind: RandomVerse, bible: 'epee', label: 'Random Verse - French'},
    ]
});
