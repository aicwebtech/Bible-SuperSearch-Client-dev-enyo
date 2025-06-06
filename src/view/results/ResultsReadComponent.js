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
    sideButtons: false,
    passage: null,
    type: 'normal',

    // Published
    singleVerse: false,

    handlers: {
        onGlobalScroll: 'handleGlobalScroll',
        onGlobalScrollEnd: 'handleGlobalScrollEnd',
        onResultsComponentShowingChange: 'handleShowingChange',
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
    handleShowingChange: function(s, e) {
        if(e.type != this.type) {
            return;
        }

        this.set('showing', !!e.showing);
    },
    handleGlobalScroll: function(inSender, inEvent) {
        this.scrolling = true;
        this.handleGenericReposition(inSender, inEvent);
    },    
    handleGlobalScrollEnd: function(inSender, inEvent) {
        this.scrolling = false;
    },
    handleGenericReposition: function(inSender, inEvent) {
        var visible = false,
            navVisible = false,
            hasPaging = this.owner.hasPaging,
            navVisOffset1 = 30 + parseInt(this.app.configs.sideSwipeNavHideThresholdTop, 10),
            navVisOffset2 = 30 + parseInt(this.app.configs.sideSwipeNavHideThresholdBottom, 10),
            copyMode = this.app.UserConfig.get('copy') || false,
            pagVisOffset = 5,
            navType = null,
            nav = null;

        if(hasPaging) {
            nav = this.owner.paging;
            navType = 'paging';
            this.owner.$.SideButtonPrev.set('showing', nav.current_page != 1);
            this.owner.$.SideButtonNext.set('showing', nav.current_page != nav.last_page);

        } else if (this.passage && this.passage.nav) {
            nav = this.passage.nav;
            navType = 'browsing';
            this.owner.$.SideButtonPrev.set('showing', nav.pcb != null);
            this.owner.$.SideButtonNext.set('showing', nav.ncb != null);
        } 

        if(this.app.configs.sideSwipePageChapter && this.app.configs.sideSwipePageChapter != 'false') {

            if(!this.get('active') || copyMode) {
                this.set('sideButtons', false);
            } else if(this.app.configs.sideSwipeHideWithNavigationButtons && this.app.configs.sideSwipeHideWithNavigationButtons != 'false') {
                if(this.$.VerseContainer) {
                    visible = this._isElementPartiallyInViewport(this.$.VerseContainer.hasNode());
                } else {
                    visible = this.isVisible();
                }

                // NEED TO DETERMINE IF NAV/PAGING IS ACCESIBLE (IE TOP LEVEL).  IF IT'S IN THE VIEWPORT BUT NOT ACCESSIBLE, THEN THE BUTTONS SHOLD SHOW!
                if(hasPaging) {
                    if(this.owner.$.Pager_1 && this._isElementPartiallyInViewport(this.owner.$.Pager_1.hasNode())) {
                        navVisible = true;
                    }                    

                    if(this.owner.$.Pager_2 && this._isElementPartiallyInViewport(this.owner.$.Pager_2.hasNode())) {
                        navVisible = true;
                    }
                } else {                    
                    // Prevent side buttons showing if (only) Testament or Reference showing 
                    if(this.$.TestamentRow && this._isElementPartiallyInViewport(this.$.TestamentRow.hasNode())) {
                        // this.log('TestamentRow Showing');
                        navVisible = true;
                    }                    

                    if(this.$.ReferenceRow && this._isElementPartiallyInViewport(this.$.ReferenceRow.hasNode())) {
                        // this.log('ReferenceRow Showing');
                        navVisible = true;
                    }

                    if(this.navButton_1 && this._isElementPartiallyInViewport(this.navButton_1.hasNode(), navVisOffset1)) {
                        navVisible = true;
                    }        

                    if(this.navButton_2 && this._isElementPartiallyInViewport(this.navButton_2.hasNode(), navVisOffset2)) {
                        navVisible = true;
                    }
                }

                if(this.get('singleVerse')) {
                    this.set('sideButtons', visible && hasPaging && !navVisible);
                } else {
                    this.set('sideButtons', visible && !navVisible);
                }
            } else {
                visible = this.isVisible();

                if(this.get('singleVerse')) {
                    this.set('sideButtons', visible && hasPaging);
                } else {
                    this.set('sideButtons', visible);
                }
            }
        }
    },
    handleFocus: function(inSender, inEvent) {
        // this.log();
    },    
    handleBlur: function(inSender, inEvent) {
        // this.log();
    },
    activeChanged: function(was, is) {
        this.addRemoveClass('bss_render_active', is);
    },
    isVisible: function() {
        if(this.type != 'normal' || !this.get('showing') || !this.hasNode()) {
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
    _isElementPartiallyInViewport: function(el, offset) {
        if(!el) {
            return false;
        }

        offset = (typeof offset == 'undefined') ? 0 : offset;

        var rect = el.getBoundingClientRect(),
            h = (window.innerHeight || document.documentElement.clientHeight) - offset,
            w = (window.innerWidth || document.documentElement.clientWidth) - offset;

        return (
            (
                rect.top >= offset && rect.top <= h ||
                rect.bottom >= offset && rect.bottom <= h ||
                rect.top < offset && rect.bottom > h ||
                rect.top > offset && rect.bottom < h
            ) && 
            (
                rect.left >= offset && rect.left <= w ||
                rect.right >= offset && rect.right <= w ||
                rect.left < offset && rect.right > w ||
                rect.left > offset && rect.right < w
            )
        );        
    },
    _pushNavButtons: function(component) {
        if(!this.navButton_1) {
            this.navButton_1 = component;
        } else if(!this.navButton_2) {
            this.navButton_2 = component;
        } else {
            this.log('TOO MANY NAVBUTTONS');
        }
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
    },
    sideButtonsChanged: function(was, is) {
        // this.$.SideSwipeButtons.set('showing', !!is);
        this.owner.set('sideButtons', is);

        // this.owner.$.SideSwipeButtons.addRemoveClass('bss_fadein', !!is);
        // this.$.SideSwipeButtons.set('showing', is);

        // if(is) {
        //     // this.$.SideSwipeButtons.set('showing', true);
        //     this.$.SideSwipeButtons.hasNode().classList.toggle('bss_fadein');
        // } else {
        //     this.$.SideSwipeButtons.hasNode().classList.toggle('bss_fadein');
        //     // this.$.SideSwipeButtons.set('showing', false);
        // }
    }
});

