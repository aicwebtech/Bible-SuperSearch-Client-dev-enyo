var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Dialog = require('./Dialog');
var Image = require('../Image');
var i18n = require('../Locale/i18nContent');

module.exports = kind({
    name: 'LoadingDialog',
    kind: Dialog,
    width: '200px',
    height: '130px',

    bodyComponents: [
        {
            classes: 'biblesupersearch_center_element', style: 'width:78px',
            components: [
                {kind: Image, relSrc: '/Spinner.gif' },
            ]
        },
        {style: 'padding: 10px; font-weight: bold', components: [
            {kind: i18n, content: 'Loading, please wait'},
            {tag: 'span', content: ' ...'}
        ]}
    ]
});
