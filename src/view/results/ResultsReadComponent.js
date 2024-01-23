var kind = require('enyo/kind');
var i18n = require('../../components/Locale/i18nComponent');
var Signal = require('../../components/Signal');
var utils = require('enyo/utils');

module.exports = kind({
    name: 'ResultsReadComponent',
    tag: 'table',
    // attributes:{border: 1},
    classes: 'biblesupersearch_render_table',
    scrolling: false,
    visible: false,
    active: false,
    navButtons: [],

    handlers: {
        onGlobalScroll: 'handleGlobalScroll',
        onGlobalScrollEnd: 'handleGlobalScrollEnd',
        blur: 'handleBlur',
        focus: 'handleFocus'
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
        {
            name: 'SideSwipeButtons',
            isChrome: true,
            showing: false,
            classes: 'bss_side_swipe_button_container',

            components: [
                {classes: 'bss_side_swipe_button', content: '&lt;', allowHtml: true, style: 'float:left', ontap: 'clickPrev'},
                {classes: 'bss_side_swipe_button', content: '&gt;', allowHtml: true, style: 'float:right', ontap: 'clickNext'},
            ]
        }
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

        this.handleGenericReposition(inSender, inEvent);
    },    
    handleGlobalScrollEnd: function(inSender, inEvent) {
        this.scrolling = false;
    },
    handleGenericReposition: function(inSender, inEvent) {
        this.log();

        var visible = this.isVisible();
            navButtons = utils.clone(this.navButtons),
            navVisible = false;

        if(visible) {
            this.log('its VISIBLE');
        }

        this.log('active', this.get('active'));

        // if(!this.get('active')) {
        //     this.$.SideSwipeButtons.set('showing', false);
        //     return;
        // }



        navButtons.forEach(function(item, idx) {
            this.log('NavButtons', idx, item);

            if(this._isElementPartiallyInViewport(item.hasNode())) {
                this.log('NavButtons visible', idx);
                navVisible = true;
            }
        }, this);

        this.log('navCount', navButtons.length);
        this.log('navVisible', navVisible);

        this.$.SideSwipeButtons.set('showing', visible && !navVisible);
    },
    handleFocus: function(inSender, inEvent) {
        this.log();
    },    
    handleBlur: function(inSender, inEvent) {
        this.log();
    },
    activeChanged: function(was, is) {
        this.addRemoveClass('bss_render_active', is);
    },
    clickNext: function() {
        this.app.debug && this.log();

        if(!this.get('active')) {
            return;
        }

        this.waterfall('onAutoClick', {button: '_next'});
        Signal.send('onAutoClick', {button: '_next'});
    },
    clickPrev: function() {
        this.app.debug && this.log();

        if(!this.get('active')) {
            return;
        }

        this.waterfall('onAutoClick', {button: '_prev'});
        Signal.send('onAutoClick', {button: '_prev'});
    }, 

    isVisible: function() {
        if(!this.hasNode()) {
            return false;
        } else {
            return this._isElementPartiallyInViewport(this.hasNode());
        }
    },
    _isElementInViewport: function(el) {
        if(!el) {
            return false;
        }

        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
        );
    },    
    _isElementPartiallyInViewport: function(el) {
        if(!el) {
            return false;
        }

        var rect = el.getBoundingClientRect(),
            h = (window.innerHeight || document.documentElement.clientHeight),
            w = (window.innerWidth || document.documentElement.clientWidth);

        return (
            (
                rect.top >= 0 && rect.top <= h ||
                rect.bottom >= 0 && rect.bottom <= h ||
                rect.top < 0 && rect.bottom > h ||
                rect.top > 0 && rect.bottom < h
            ) && 
            (
                rect.left >= 0 && rect.left <= w ||
                rect.right >= 0 && rect.right <= w ||
                rect.left < 0 && rect.right > w ||
                rect.left > 0 && rect.right < w
            )
        );
    },
    _pushNavButtons: function(component) {
        // this.log(component);

        var navButtons = utils.clone(this.navButtons);

        navButtons.push(component);

        this.navButtons = utils.clone(navButtons);
    }

});

