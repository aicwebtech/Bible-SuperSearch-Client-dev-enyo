var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Dialog = require('./Dialog');
var Image = require('../Image');

module.exports = kind({
    name: 'LoadingDialog',
    kind: Dialog,
    width: '200px',
    height: '130px',

    bodyComponents: [
        {
            classes: 'biblesupersearch_center_element', style: 'width:78px',
            components: [
                {kind: Image, relSrc: '/Spinner.gif', },
            ]
        },
        {content: 'Loading, please wait ...', style: 'padding: 10px; font-weight: bold'}
    ]
});
