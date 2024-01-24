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
    navButton_1: null,
    navButton_2: null,

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
                    t.scrolling = false; /// ?? either need this or a timeout on t.scrolling
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
                this.clickNext();
            }

            if(inEvent.key == 'ArrowLeft') {
                this.clickPrev();
            }
        }
    },
    handleGlobalScroll: function(inSender, inEvent) {
        this.log();

        this.scrolling = true;

        this.handleGenericReposition(inSender, inEvent);
    },    
    handleGlobalScrollEnd: function(inSender, inEvent) {
        this.log();
        this.scrolling = false;
    },
    handleGenericReposition: function(inSender, inEvent) {
        this.log();

        var visible = false
            navVisible = false;

        if(this.app.configs.sideSwipePageChapter && this.app.configs.sideSwipePageChapter != 'false') {
            // todo, make with with search pagination
            // need to ensure buttons only appear ONCE though

            if(!this.get('active')) {
                this.$.SideSwipeButtons.set('showing', false);
            } else if(this.app.configs.sideSwipeHideWithNavigationButtons && this.app.configs.sideSwipeHideWithNavigationButtons != 'false') {

                visible = this._isElementPartiallyInViewport(this.$.VerseContainer.hasNode());

                if(this.navButton_1 && this._isElementPartiallyInViewport(this.navButton_1.hasNode())) {
                    navVisible = true;
                }        

                if(this.navButton_2 && this._isElementPartiallyInViewport(this.navButton_2.hasNode())) {
                    navVisible = true;
                }

                this.log('navButton_1', this.navButton_1);
                this.log('navButton_2', this.navButton_2);
                this.log('navVisible', navVisible);
                this.$.SideSwipeButtons.set('showing', visible && !navVisible);
            } else {
                visible = this.isVisible();
                this.$.SideSwipeButtons.set('showing', visible);
            }

        }
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

        if(!this._canPrevNext()) {
            return;
        }

        this.waterfall('onAutoClick', {button: '_next'});
        Signal.send('onAutoClick', {button: '_next'});
    },
    clickPrev: function() {
        this.app.debug && this.log();

        if(!this._canPrevNext()) {
            return;
        }

        this.waterfall('onAutoClick', {button: '_prev'});
        Signal.send('onAutoClick', {button: '_prev'});
    }, 

    _canPrevNext: function() {
        if(this.get('active')) {
            return true;
        }

        if(this.owner.hasPaging) {
            return true;
        }

        return false;
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
        this.log(component);

        if(!this.navButton_1) {
            this.navButton_1 = component;
            this.log('NavButton 1 set');
        } else if(!this.navButton_2) {
            this.navButton_2 = component;
            this.log('NavButton 2 set');
        } else {
            this.log('TOO MANY NAVBUTTONS');
        }

        // var navButtons = utils.clone(this.navButtons);

        // navButtons.push(component);

        // this.navButtons = utils.clone(navButtons);
    }

});

