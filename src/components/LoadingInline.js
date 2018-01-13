var kind = require('enyo/kind');
var Image = require('./Image');

module.exports = kind({
    name: 'LoadingInline',
    classes: 'biblesupersearch_container biblesupersearch_loading_inline',

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
            style: 'padding: 10px; font-weight: bold'
        }
    ]
});
