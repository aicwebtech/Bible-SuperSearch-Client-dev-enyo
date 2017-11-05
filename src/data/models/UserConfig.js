var kind = require('enyo/kind');
var Model = require('enyo/Model');
var LocalStorageSource = require('../sources/LocalStorage');

module.exports = kind({
    name: 'UserConfig',
    kind: Model,
    source: LocalStorageSource,
    primaryKey: 'id',
    url: '', ///,
    
    attributes: {
        id: null,
                                // Configs used by the formatting buttons:
        paragraph: false,       //  - Paragraph render on or off
        copy: false,            //  - Render mode: copy if true, read if fals
        text_size: 0,           //  - Text size: translated to ...
        font: 'sans-serif',     //  - Font: serif, sans-serif, or monospace
        advanced_toggle: false, //  - (Classic interfaces): indicates if the advanced form is toggled to display
        something: 'else',
        mmm: 'bacon'
    },

    getUrl: function() {
        // do something?
    }
});

