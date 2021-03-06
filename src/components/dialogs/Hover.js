var kind = require('enyo/kind');
// var Dialog = require('./Dialog');
var utils = require('enyo/utils');
var Image = require('../Image');

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
    waitCount: 0,
    parentHeight: null,
    parentWidth: null,
    widthMin: 400,

    handlers: {
        onmouseout: 'mouseOutHandler'
    },

    components: [
        {name: 'LoadingContainer', showing: false, components: [
            {
                classes: 'biblesupersearch_center_element', style: 'width:78px',
                components: [
                    {kind: Image, relSrc: '/Spinner.gif' }
                ]
            },
            {content: 'Loading, please wait ...', style: 'padding: 10px; font-weight: bold'},
        ]},
        {name: 'ContentContainer'}
    ],

    displayPosition: function(mouseX, mouseY, content, parentWidth, parentHeight) {
        // this.log('content', content);
        this.app.debug && this.log('mouseX', mouseX);
        this.app.debug && this.log('mouseY', mouseY);
        this.app.debug && this.log('parentWidth', parentWidth);        
        this.app.debug && this.log('parentHeight', parentHeight);

        this.parentHeight = parentHeight;
        this.parentWidth = parentWidth;

        var bounds = this.getOwnerBounds();

        // determine mouse position within 'owner' (container)
        mouseX -= bounds.left;
        mouseY -= bounds.top;

        this.app.debug && this.log('mouse bounds', bounds);

        this.app.debug && this.log('adjusted mouseX', mouseX);
        this.app.debug && this.log('adjusted mouseY', mouseY);

        if(this.content == content && this.get('showing')) {
            this.app.debug && this.log('already shwoing');
            // return;
        }

        if(this.get('showing') && (
            (mouseX - this.debounce <= this.mouseX) && 
            (mouseX + this.debounce >= this.mouseX) && 
            (mouseY - this.debounce <= this.mouseY) && 
            (mouseY + this.debounce >= this.mouseY)
        )) {
            this.app.debug && this.log('debounced!');
            return;
        }

        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.content = content;

        var top = mouseY;
        var left = mouseX;

        this.$.ContentContainer.set('content', content);

        this.applyStyle('left', left + 'px');
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
        this.set('showing', true);
        var w = this.widthMin; // this.hasNode().scrollWidth;
        var h = this.hasNode().scrollHeight;
        var myBounds = this.hasNode().getBoundingClientRect();
       
        w = myBounds.width;
        h = Math.min(h, myBounds.height);

        var bounds = this.getOwnerBounds();

        // var wMaxOld = document.body.scrollWidth;
        // var hMaxOld = document.body.scrollHeight;
        // var wMax = this.parent.hasNode().clientWidth;
        // var hMax = this.parent.hasNode().clientHeight;

        // var wMax = window.innerWidth  + window.scrollX;
        // var hMax = window.innerHeight + window.scrollY;

        var wMax = bounds.width || this.owner.hasNode().clientWidth + window.scrollX;
        var hMax = bounds.height || this.owner.hasNode().clientHeight + window.scrollY;

        if(window.innerHeight < hMax) {
            this.app.debug && this.log('hMax adjusted due to windowHeight');
            hMax = window.innerHeight - bounds.top;
        }

        if(w == 0 || h == 0) {
            window.setTimeout(utils.bind(this, function() {
                if(this.waitCount < 10) {
                    this.waitCount ++;
                    this.reposition();
                }
            }), 100);

            return;
        }

        this.waitCount = 0;
        var xOuter = this.mouseX + w;
        var yOuter = this.mouseY + h;
        this.app.debug && this.log('mouseX', this.mouseX, 'w', w, 'wMax', wMax, 'xOuter', xOuter);
        this.app.debug && this.log('mouseY', this.mouseY, 'h', h, 'hmax', hMax, 'yOuter', yOuter);
        posX = this.mouseX + this.offsetX;
        posY = this.mouseY + this.offsetY;

        if(xOuter > wMax) {
            this.app.debug && this.log('X adjusted');
            // posX = wMax - w - this.offsetX;
            posX = this.mouseX - w - this.offsetX;
        }

        if(yOuter > hMax) {
            this.app.debug && this.log('Y adjusted');

            if(hMax > h) {
                posY = hMax - h - this.offsetY;
                posY = this.mouseY - h - this.offsetY;
                this.app.debug && this.log('greater than');
            }
            // else {
            //     posY = this.mouseY + this.offsetY;
            //     // posY = yOuter - hMax - this.offsetY;
            //     this.app.debug && this.log('less than');
            // }
        }

        this.app.debug && this.log('posX', posX);
        this.app.debug && this.log('posY', posY);

        this.applyStyle('left', posX + 'px');
        this.applyStyle('top', posY + 'px');
        this.applyStyle('width', this.widthMin + 'px');
        this.render();
    },
    mouseOutHandler: function(inSender, inEvent) {
        // this.set('showing', false);
    },
    getOwnerBounds: function() {
        if(!this.owner) {
            return {};
        };

        var rect = this.owner.hasNode().getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        return { 
            top: rect.top + scrollTop, 
            left: rect.left + scrollLeft,
            width: rect.width || null,
            height: rect.height || null
        };
    }
});
