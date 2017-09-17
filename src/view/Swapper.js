// test - to be deleted
var kind = require('enyo/kind');
var RandomVerse = require('./widgets/RandomVerse');

module.exports = kind({
    name: 'Swapper',
    classes: 'biblesupersearch_content',
    components: [
        {content: 'welcome to the swapper'},
        {content: 'not what u expected, eh?'}
    ]
});
