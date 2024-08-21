var kind = require('enyo/kind');
var Base = require('./NavHtml');

module.exports = kind({
    name: 'NavMaterialButtonsArrows',
    kind: Base,

    linkClasses: 'material-icons',
    // classesActive: 'active material-icons icon',
    // classesInactive: 'inactive material-icons icon',

    prevBookText: 'first_page',
    prevChapterText: 'keyboard_arrow_left',
    currentChapterText: 'unfold_more',
    nextChapterText: 'keyboard_arrow_right',
    nextBookText: 'last_page',
});
