var kind = require('enyo/kind');
var Base = require('./NavHtml');

module.exports = kind({
    name: 'NavMaterialButtonsKeyboard',
    kind: Base,

    linkClasses: 'bss-material-icons',
    // classesActive: 'bss_active bss-material-icons bss_icon',
    // classesInactive: 'bss_inactive bss-material-icons bss_icon',

    prevBookText: 'keyboard_double_arrow_left',
    prevChapterText: 'keyboard_arrow_left',
    currentChapterText: 'unfold_more',
    nextChapterText: 'keyboard_arrow_right',
    nextBookText: 'keyboard_double_arrow_right',
});
