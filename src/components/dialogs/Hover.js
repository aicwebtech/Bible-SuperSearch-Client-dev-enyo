var kind = require('enyo/kind');
var Dialog = require('./Dialog');

module.exports = kind({
    name: 'HoverDialog',
    // kind: Dialog,
    classes: 'hover_dialog',
    showing: false,
    // style: '',
    width: 300,
    height: 300,

    components: [
        {name: 'LoadingContainer', showing: false, components: [
            {
                classes: 'biblesupersearch_center_element', style: 'width:78px',
                components: [
                    {kind: Image, relSrc: '/Spinner.gif', },
                ]
            },
            {content: 'Loading, please wait ...', style: 'padding: 10px; font-weight: bold'},
        ]},
        {name: 'ContentContainer'}
    ],

    displayPosition: function(top, left, content, parentWidth, parentHeight) {
        // var thisWidth  = this.hasNode().offsetWidth;
        // var thisHeight = this.hasNode().offsetHeight;

        // this.log('thisWidth', this.width);
        // this.log('left', left);
        // this.log('parentWidth', parentWidth);        
        this.log('thisHeight', this.height);
        this.log('top', top);
        this.log('parentHeight', parentHeight);

        this.$.ContentContainer.set('content', content);

        // if(true || left + this.width > parentWidth) {
        //     this.log('IGNOREING LEFT');
        //     this.applyStyle('right', '10px');
        //     this.applyStyle('left', null);
        // }
        // else {
            this.log('using left');
            this.applyStyle('left', left + 'px');
            this.applyStyle('right', null);
        // }

        if(top + this.height > parentHeight) {
            // this.log('adjusting top');
            // top -= this.height - 30;
        }

        this.applyStyle('top', top + 'px');
        this.set('showing', true);
    },
    showLoading: function() {
        this.$.LoadingContainer && this.$.LoadingContainer.set('showing', true);
        this.$.ContentContainer && this.$.ContentContainer.set('showing', false);
    },    
    showContent: function() {
        this.$.LoadingContainer && this.$.LoadingContainer.set('showing', false);
        this.$.ContentContainer && this.$.ContentContainer.set('showing', true);
    },
});
