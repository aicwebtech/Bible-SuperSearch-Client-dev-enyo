var kind = require('enyo/kind');
var Image = require('./Image');
var i18n = require('./Locale/i18nContent');

module.exports = kind({
    name: 'LoadingInline',
    classes: 'biblesupersearch_main biblesupersearch_loading_inline',

    components: [
        {
            classes: 'biblesupersearch_center_element', style: 'width:78px',
            components: [
                {kind: Image, relSrc: 'Spinner.gif'},
            ]
        },
        {
            classes: 'biblesupersearch_center_element', 
            content: 'Loading, please wait ...', 
            style: 'padding: 10px; font-weight: bold', 
            components: [
                {kind: i18n, content: 'Loading, please wait'},
                {tag: 'span', content: ' ...'}
            ]
        }
    ]
});
