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
    hideTimeout: null,
    preventHide: false,

    _lastTapTarget: null, // private
    _showButtons: false, // private

    handlers: {
        onmouseout: 'mouseOutHandler',
        onmouseover: 'mouseOverHandler',
        ontap: 'handleTap',
        onGlobalTap: 'handleGlobalTap',
        onmousedown: 'handleClick',
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

    displayPosition: function(mouseX, mouseY, content, parentWidth, parentHeight, showButtons) {
        this._showButtons = showButtons || false;
        this.log('_showButtons', this._showButtons);

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

        // this.applyStyle('left', left + 'px');
        // this.applyStyle('top', top + 'px');
        // this.set('showing', true);
    },
    showLoading: function() {
        this.$.LoadingContainer && this.$.LoadingContainer.set('showing', true);
        this.$.ContentContainer && this.$.ContentContainer.set('showing', false);
        this.$.ButtonContainer && this.$.ButtonContainer.set('showing', false);
        this.reposition();
    },    
    showContent: function() {
        this.$.LoadingContainer && this.$.LoadingContainer.set('showing', false);
        this.$.ContentContainer && this.$.ContentContainer.set('showing', true);
        this.log('_showButtons', this._showButtons);
        this.$.ButtonContainer && this.$.ButtonContainer.set('showing', this._showButtons);
        this.reposition();
    },
    reposition: function() {
        if(!this.owner) {
            return;
        };

        // this.set('showing', true);

        var containerBounds = this.getOwnerBounds(),
            myBounds = this.hasNode().getBoundingClientRect(),
            scrollHeight = this.hasNode().scrollHeight,
            viewportHeight = window.innerHeight,
            viewportWidth = window.innerWidth,
            mouseX = posX = this.mouseX,
            mouseY = posY = this.mouseY,
            maxX = Math.min(containerBounds.width, viewportWidth),
            maxYcontainer = containerBounds.topOrig + containerBounds.height,
            // maxYviewport = scrollHeight + viewportHeight,
            maxYviewport = viewportHeight,
            maxY = Math.min(maxYviewport, maxYcontainer),
            smallScreen = false,
            width = myBounds.width || this.width,
            height = myBounds.height || this.height;

        this.log('containerBounds', containerBounds);
        this.log('viewport', viewportWidth, viewportHeight);
        this.log('width/height', width, height);
        this.log('mouse', mouseX, mouseY);
        this.log('maxY', maxY, maxYcontainer, maxYviewport);
        this.log('posY', posY, height, posY + height);

        //if(height > viewportHeight || width > viewportWidth) {
        if(viewportHeight < 400 || viewportWidth < 400) {
            // height = viewportHeight;
            smallScreen = true;
        }

        this.log('smallScreen', smallScreen);

        if(smallScreen) {
            width = 300;
            posX = (maxX - width)  / 2;
            posY = (maxY - height) / 2;
        } else {            
            
            if(posX + width > maxX) {
                // posX = maxX - width;
                posX = posX - width;
            }

            if(posY + myBounds.height > maxY) {
                posY = posY - height;
            }
        }

        this.set('showing', true);
        this.log('pos', posX, posY);
        this.applyStyle('left', posX + 'px');
        this.applyStyle('top', posY + 'px');
        this.applyStyle('width', width + 'px');
        this.render();
    },

    repositionOld: function() {
        this.set('showing', true);
        var w = widthNew = this.widthMin; // this.hasNode().scrollWidth;
        var h = this.hasNode().scrollHeight;
        var myBounds = this.hasNode().getBoundingClientRect();
        var bodyWidth = document.body.clientWidth;
        var bodyHeight = document.body.clientHeight;

        var docWidth = document.documentElement.clientWidth,
            docHeight = document.documentElement.clientHeight,
            maxHeightDoc = docHeight - 10;
            style = '',
            height = parseInt(this.height, 10),
            headerHeight = 0,
            smallScreen = false,
            n = this.name;
       
        w = myBounds.width;
        h = Math.min(h, myBounds.height);
        hRaw = myBounds.height;

        var bounds = this.getOwnerBounds();

        // var wMaxOld = document.body.scrollWidth;
        // var hMaxOld = document.body.scrollHeight;
        // var wMax = this.parent.hasNode().clientWidth;
        // var hMax = this.parent.hasNode().clientHeight;

        // var wMax = window.innerWidth  + window.scrollX;
        // var hMax = window.innerHeight + window.scrollY;

        var wMax = bounds.width || this.owner.hasNode().clientWidth + window.scrollX;
        var hMax = bounds.height || this.owner.hasNode().clientHeight + window.scrollY;
        // var yMax = document.body.clientHeight + window.scrollY;
        var yMax = window.innerHeight;


        // if(window.innerHeight < hMax) {
        //     this.app.debug && this.log('hMax adjusted due to windowHeight');
        //     hMax = window.innerHeight - bounds.top;
        // }

        this.log('yMax START -------');
        this.log('yMax mouseY', this.mouseY);
        this.log('yMax document.body.clientHeight', document.body.clientHeight);
        this.log('yMax window.scrollY', window.scrollY);
        this.log('yMax window.innerHeight', window.innerHeight);
        this.log('yMax END -------');

        // this.log('hMax START -------------');
        // this.log('hMax bounds.height', bounds.height);
        // this.log('hMax owner clientHeight', this.owner.hasNode().clientHeight);
        // this.log('hMax window.scrollY', window.scrollY);
        // this.log('hMax window.innerHeight', window.innerHeight);
        // this.log('hMax bounds.height', bounds.height);
        // this.log('hMax bounds.top', bounds.top);
        // this.log('hMax', hMax);
        // this.log('hMax END -------------');

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

        if(bodyWidth < widthNew) {
            posX = 0;
            widthNew = bodyWidth;
        }

        posX = (posX < 0) ? 0 : posX;

        if(posX + widthNew > bodyWidth) {
            posX = bodyWidth - widthNew;
        }

        if(posY + hRaw > yMax) {
            poxY = yMax - hRaw;
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
        this.app.debug && this.log('posY', posY, 'yMax', yMax, 'h', h, 'bounds', bounds.height, this.owner.hasNode().clientHeight + window.scrollY);

        this.applyStyle('left', posX + 'px');
        this.applyStyle('top', posY + 'px');
        this.applyStyle('width', widthNew + 'px');
        this.render();
    },
    mouseOutHandler: function(inSender, inEvent) {
        this.set('showing', false);
    },
    mouseOverHandler: function(inSender, inEvent) {
        this.log();
        this.cancelHide();
        this.set('showing', true);
    },
    hideDelay: function() {
        var t = this;

        this.cancelHide();
        this.preventHide = false;

        this.hideTimeout = setTimeout(function() {
            t.set('showing', false);
        }, 1000);
    },
    cancelHide: function() {
        this.hideTimeout && clearTimeout(this.hideTimeout);
    },
    handleTap: function(inSender, inEvent) {
        this._lastTapTarget = inEvent.target;
    },
    hidePrevent: function() {
        this.cancelHide();

        this.preventHide = true;
        var t = this;

        this.hideTimeout = setTimeout(function() {
            t.preventHide = false;
        }, 1000);
    },
    handleGlobalTap: function(inSender, inEvent) {
        if(inEvent.e.target == this._lastTapTarget) {
            // do nothing, tap was within the hover dialog, keep it open!
        } else if(inEvent.e.target.tagName == 'A' && inEvent.e.target.className == 'strongs') {
            // do nothing, tap was on a hover dialog link
            this._lastTapTarget = null;
        } else {
            this._lastTapTarget = null;
            this.set('showing', false);
        }
    },
    handleClick: function(inSender, inEvent) {
        this.log('button', inEvent.button);
        this.log('buttons', inEvent.buttons);
        this.log('which', inEvent.which);
        this.log(this.app.client);

        if(inEvent.which == 3 && this.app.client.browser == 'Firefox') {
            this.hidePrevent();
            // inEvent.preventDefault();
            // return true;
        }
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
            topOrig: rect.top,
            leftOrig: rect.left,
            width: rect.width || null,
            height: rect.height || null
        };
    },
    close: function() {
        this.set('showing', false);
    },
    set: function(name, value) {
        // Ugly Firefox hack :P
        if(this.preventHide && name == 'showing' && value == false) {
            return;
        }

        this.inherited(arguments);
    }
});
