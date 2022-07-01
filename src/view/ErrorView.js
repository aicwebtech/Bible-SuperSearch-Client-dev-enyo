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

    // todo - localize this!!

    components: [
        {classes: 'biblesupersearch_content', components: [
            {_tag: 'h2', classes:'biblesupersearch_error_header', content: 'Bible SuperSearch Load Error'},
            // {name: 'Message', allowHtml: true},
            {content: 'Bible SuperSearch was unable to load data that it needs to work.'},
            {content: 'You may be experiencing internet interruptions.  '},
            {content: 'Please try refreshing this page.  If the problem persists, please try again later.'},
            {tag: 'br'},
            {tag: 'small', content: '(Webmasters, please see your console for error details.)'},
            {tag: 'br'},
            {tag: 'br'},
            {tag: 'h3', components: [
                {tag: 'span', content: 'In the meanwhile, you may download these '},
                {kind: AssetLink, relHref: 'text_bibles.zip', content: 'Plaintext Bibles'}
            ]},
            {tag: 'br'},
            {tag: 'b', content: 'Download the Truth, and Delete it Not!'}
        ]}
    ]
});
