var kind = require('enyo/kind');
var i18n = require('../../components/Locale/i18nComponent');
var Signal = require('../../components/Signal');

module.exports = kind({
    name: 'ResultsReadComponent',
    tag: 'table',
    // attributes:{border: 1},
    classes: 'biblesupersearch_render_table',
    scrolling: false,

    handlers: {
        onGlobalScroll: 'handleGlobalScroll',
        onGlobalScrollEnd: 'handleGlobalScrollEnd'
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
        
        if(this.app.configs.swipePageChapter) {
            this.hasNode().addEventListener('touchstart', function(ev) {

                t.app.debug && console.log('RENDER touchstart', ev);
                var touch = ev.changedTouches[0];
                t.touch.startX = touch.pageX;
                t.touch.startY = touch.pageY;
                t.touch.startTime = new Date().getTime();
                //ev.preventDefault();
                return true;
            }, listenerOptions);        

            this.hasNode().addEventListener('touchend', function(ev) {
                if(t.scrolling) {
                    t.app.debug && console.log('TOUCHEND BLOCKED BY SCROLL');
                    return;
                }

                t.app.debug && console.log('RENDER touchend', ev);

                var touch = ev.changedTouches[0],
                    distX = touch.pageX - t.touch.startX,
                    distY = touch.pageY - t.touch.startY,
                    distXabs = Math.abs(distX),
                    distYabs = Math.abs(distY),
                    XYdistRatio = distXabs / distYabs,
                    elapsedTime = new Date().getTime() - t.touch.startTime,
                    yMax = 10,
                    xMin = 30

                if(distXabs >= xMin && XYdistRatio >= 3) {
                    if(distX < 0) {
                        t.clickNext();
                    } else {
                        t.clickPrev();
                    }
                }

                t.touch.startX = null;
                t.touch.startY = null;
                t.touch.startTime = null;
                //ev.preventDefault();
                return false;
            }, listenerOptions);
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
        if(this.app.configs.arrowKeysPageChapter) {            
            if(inEvent.key == 'ArrowRight') {
                // this.log('Go RIGHT');
                this.clickNext();
            }

            if(inEvent.key == 'ArrowLeft') {
                // this.log('Go LEFT');
                this.clickPrev();
            }
        }
    },
    handleGlobalScroll: function(inSender, inEvent) {
        this.scrolling = true;
    },    
    handleGlobalScrollEnd: function(inSender, inEvent) {
        this.scrolling = false;
    },
    clickNext: function() {
        this.app.debug && this.log();
        this.waterfall('onAutoClick', {button: '_next'});
        Signal.send('onAutoClick', {button: '_next'});
    },
    clickPrev: function() {
        this.app.debug && this.log();
        this.waterfall('onAutoClick', {button: '_prev'});
        Signal.send('onAutoClick', {button: '_prev'});
    }

});

