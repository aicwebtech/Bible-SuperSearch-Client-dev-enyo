var kind = require('enyo/kind');
var Base = require('./NavHtml');

module.exports = kind({
    name: 'NavMaterialButtonsArrows',
    kind: Base,

    linkClasses: 'bss-material-icons',
    // classesActive: 'bss_active bss-material-icons bss_icon',
    // classesInactive: 'bss_inactive bss-material-icons bss_icon',

    prevBookText: 'first_page',
    prevChapterText: 'keyboard_arrow_left',
    currentChapterText: 'unfold_more',
    nextChapterText: 'keyboard_arrow_right',
    nextBookText: 'last_page',
});
