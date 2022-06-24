var kind = require('enyo/kind');
var AssetLink = require('../components/AssetLink');

module.exports = kind({
    name: 'ErrorView',
    classes: 'biblesupersearch_main biblesupersearch_error',

    published: {
        message: ''
    },

    // bindings: [
    //     {from: 'message', to: '$.Message.content'}
    // ],

    components: [
        {tag: 'h2', content: 'Bible SuperSearch Load Error'},
        // {name: 'Message', allowHtml: true},
        {content: 'Bible SuperSearch was unable to load data that it needs to work.'},
        {content: 'The Bible SuperSearch API may be down or you may be experiencing internet interruptions.  '},
        {tag: 'br'},
        {tag: 'h3', content: 'In the meanwhile, you may download these'},
        {kind: AssetLink, relHref: 'kjv.csv', content: 'CSV Bibles'},
        {tag: 'br'},
        {tag: 'br'},
        {tag: 'b', content: 'Download the Truth, and Delete it Not!'},
        {tag: 'br'},
        {tag: 'br'},
        {tag: 'small', content: 'Webmasters, please see your console for details.'}
    ]
});