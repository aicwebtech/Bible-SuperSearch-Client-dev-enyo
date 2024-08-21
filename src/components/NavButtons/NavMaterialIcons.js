var kind = require('enyo/kind');
var Base = require('./NavHtml');

module.exports = kind({
    name: 'NavMaterialButtonsKeyboard',
    kind: Base,

    linkClasses: 'material-icons',
    // classesActive: 'active material-icons icon',
    // classesInactive: 'inactive material-icons icon',

    prevBookText: 'keyboard_double_arrow_left',
    prevChapterText: 'keyboard_arrow_left',
    currentChapterText: 'unfold_more',
    nextChapterText: 'keyboard_arrow_right',
    nextBookText: 'keyboard_double_arrow_right',
});
