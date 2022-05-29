var kind = require('enyo/kind');
var AssetLink = require('../components/AssetLink');

module.exports = kind({
    name: 'ErrorView',
    classes: 'biblesupersearch_main biblesupersearch_error',

    published: {
        message: ''
    },

    bindings: [
        {from: 'message', to: '$.Message.content'}
    ],

    components: [
        {tag: 'h2', content: 'Bible SuperSearch Init Error'},
        {name: 'Message', allowHtml: true},
        {tag: 'br'},
        {tag: 'h3', content: 'In the meanwhile, you may download these'},
        {kind: AssetLink, relHref: 'kjv.csv', content: 'CSV Bibles'},
        {tag: 'br'},
        {tag: 'br'},
        {tag: 'b', content: 'Download the Truth, and Delete it Not!'}
    ]
});