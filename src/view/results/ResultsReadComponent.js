var kind = require('enyo/kind');
var i18n = require('../../components/Locale/i18nComponent');
var Signal = require('../../components/Signal');

module.exports = kind({
    name: 'ResultsReadComponent',
    tag: 'table',
    // attributes:{border: 1},
    classes: 'biblesupersearch_render_table',

    handlers: {
        // touchstart: 'handleTouch',
        // ontouchstart: 'handleTouch',
        // ontouchmove: 'handleTouch',
        // ontouchend: 'handleTouch',
        // ontouchcancel: 'handleTouch',
        // ondragstart: 'handleTouch',  // no touchscreen
        // ondragfinish: 'handleTouch', // no touchscreen
        // onflick: 'handleTouch', // no touchscreen
        // onmove: 'handleTouch',
        // ondown: 'handleTouch',
        // onup: 'handleTouch',
        // ontap: 'handleTouch'

        // onType: 'handleKey',
        // onKeyWaterfall: 'handleKey'
    },

    touch: {
        startX: null,
        startY: null,
        startTime: null,
    },

    components: [
        {
            kind: Signal, 
            onkeyup: 'handleKey', // Keyboard events need to be handled by Signal per docs
            isChrome: true
        },
    ],

    rendered: function() {
        this.inherited(arguments);

        var t = this;

        // WARNING: something with these touch handlers BREAKS touch events on mobile
        // Be careful when implementing!
        // These touch handlers 'work' but are very basic

        var listenerOptions = {
            capture: false,
            once: false,
            passive: true
        };
        
        if(this.app.configs.changeChapterSwipe) {
            this.hasNode().addEventListener('touchstart', function(ev) {

                console.log('RENDER touchstart', ev);
                var touch = ev.changedTouches[0];
                t.touch.startX = touch.pageX;
                t.touch.startY = touch.pageY;
                t.touch.startTime = new Date().getTime();
                //ev.preventDefault();
                return true;
            }, listenerOptions);        

            this.hasNode().addEventListener('touchend', function(ev) {

                console.log('RENDER touchend', ev);
                var touch = ev.changedTouches[0],
                    distX = touch.pageX - t.touch.startX,
                    distY = touch.pageY - t.touch.startY,
                    distXabs = Math.abs(distX),
                    distYabs = Math.abs(distY),
                    XYdistRatio = distXabs / distYabs,
                    elapsedTime = new Date().getTime() - t.touch.startTime,
                    yMax = 10,
                    xMin = 30

                // t.app.alert('touchend time: '+ elapsedTime +'<br>dx:' + distX + '<br>dy:' + distY);

                // console.log('touch distXAbs', distXabs);
                // console.log('touch distYAbs', distYabs);
                // console.log('touch ratio', XYdistRatio);

                if(distXabs >= xMin && XYdistRatio >= 3) {
                    if(distX < 0) {
                        t.clickNextChapter();
                    } else {
                        t.clickPrevChapter();
                    }
                }

                t.touch.startX = null;
                t.touch.startY = null;
                t.touch.startTime = null;
                //ev.preventDefault();
                return false;
            }, listenerOptions);
        }

        if(this.app.client.isMobile) {
            // this.app.alert('mobile!!');
        }
    }, 
    handleTouch: function(inSender, inEvent) {
        this.log('event type', inEvent.type);
        // this.log(inSender, inEvent);
        this.log('client', this.app.client);

        if(this.app.client.isMobile) {
            this.app.alert('handleTouch mobile touched!' + inEvent.type);
        }
    },
    handleKey: function(inSender, inEvent) {
        if(this.app.configs.changeChapterArrowKeys) {            
            if(inEvent.key == 'ArrowRight') {
                this.log('Go RIGHT');
                this.clickNextChapter();
            }

            if(inEvent.key == 'ArrowLeft') {
                this.log('Go LEFT');
                this.clickPrevChapter();
            }
        }

    },
    clickNextChapter: function() {
        this.log();
        this.waterfall('onAutoClick', {button: 'nc'});
    },
    clickPrevChapter: function() {
        this.log();
        this.waterfall('onAutoClick', {button: 'pc'});
    }

});

