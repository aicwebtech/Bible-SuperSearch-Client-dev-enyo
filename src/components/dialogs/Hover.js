var kind = require('enyo/kind');
var Dialog = require('./Dialog');
var utils = require('enyo/utils');

module.exports = kind({
    name: 'HoverDialog',
    // kind: Dialog,
    classes: 'hover_dialog',
    showing: false,
    // style: '',
    width: 300,
    height: 300,
    mouseX: null,
    mouseY: null,
    offsetX: 10,
    offsetY: 10,
    content: null,
    debounce: 5,

    handlers: {
        onmouseout: 'mouseOutHandler'
    },

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

    displayPosition: function(mouseX, mouseY, content, parentWidth, parentHeight) {
        this.log('content', content);

        if(this.content == content && this.get('showing')) {
            this.log('already shwoing');
            // return;
        }

        if(this.get('showing') && (
            (mouseX - this.debounce <= this.mouseX) && 
            (mouseX + this.debounce >= this.mouseX) && 
            (mouseY - this.debounce <= this.mouseY) && 
            (mouseY + this.debounce >= this.mouseY)
        )) {
            this.log('debounced!');
            return;
        }

        // this.log('thisWidth', this.width);
        // this.log('parentWidth', parentWidth);        
        this.log('thisHeight', this.height);
        this.log('parentHeight', parentHeight);
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.content = content;

        this.log('mouseX', mouseX);
        this.log('mouseY', mouseY);

        var top = mouseY;
        var left = mouseX;
        this.log('top', top);
        this.log('left', left);

        this.$.ContentContainer.set('content', content);

        // if(true || left + this.width > parentWidth) {
        //     this.log('IGNOREING LEFT');
        //     this.applyStyle('right', '10px');
        //     this.applyStyle('left', null);
        // }
        // else {
            this.log('using left');
            this.applyStyle('left', left + 'px');
            // this.applyStyle('right', null);
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
        this.reposition();
    },    
    showContent: function() {
        this.$.LoadingContainer && this.$.LoadingContainer.set('showing', false);
        this.$.ContentContainer && this.$.ContentContainer.set('showing', true);
        this.reposition();
    },
    reposition: function() {
        var w = this.hasNode().scrollWidth;
        var h = this.hasNode().scrollHeight;
        var wMax = document.body.scrollWidth;
        var hMax = document.body.scrollHeight;

        if(w == 0 || h == 0) {
            this.log('waiting');

            window.setTimeout(utils.bind(this, function() {
                this.reposition();
            }), 100);

            return;
        }

        this.log('w', w, wMax);
        this.log('h', h, hMax);
        var xOuter = this.mouseX + w;
        var yOuter = this.mouseY + h;

        if(xOuter > wMax) {
            this.log('X adjusted');
            posX = wMax - w - this.offsetX;
        }
        else {
            posX = this.mouseX + this.offsetY;
        }        

        if(yOuter > hMax) {
            this.log('Y adjusted');
            posY = hMax - h - this.offsetY;
        }
        else {
            posY = this.mouseY + this.offsetY;
        }

        this.log('posX', posX);
        this.log('posY', posY);

        this.applyStyle('left', posX + 'px');
        this.applyStyle('top', posY + 'px');
    },
    mouseOutHandler: function(inSender, inEvent) {
        this.set('showing', false);
    }
});
