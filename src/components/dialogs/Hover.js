var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Dialog = require('./Dialog');
var Image = require('../Image');

module.exports = kind({
    name: 'HoverDialog',
    // kind: Dialog,
    classes: 'hover_dialog',
    showing: false,
    // style: '',

    components: [
        {
            classes: 'biblesupersearch_center_element', style: 'width:78px',
            components: [
                {kind: Image, relSrc: '/Spinner.gif', },
            ]
        },
        {content: 'Loading, please wait ...', style: 'padding: 10px; font-weight: bold'},
        {name: 'ContentContainer'}
    ],

    displayPosition: function(top, left, content) {
        this.$.ContentContainer.set('content', content);
        this.applyStyle('top', top + 'px');
        this.applyStyle('left', left + 'px');
        this.set('showing', true);
    }
});
