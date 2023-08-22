var kind = require('enyo/kind');
var i18n = require('../../components/Locale/i18nComponent');
var Signal = require('../../components/Signal');

module.exports = kind({
    name: 'ResultsReadComponent',
    tag: 'table',
    // attributes:{border: 1},
    classes: 'biblesupersearch_render_table',

    handlers: {
        touchstart: 'handleTouch',
        ontouchstart: 'handleTouch',
        ontouchmove: 'handleTouch',
        ontouchend: 'handleTouch',
        ontouchcancel: 'handleTouch',
        // onType: 'handleKey',
        // onKeyWaterfall: 'handleKey'
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

        // These touch handlers 'work' but are very basic
        this.hasNode().addEventListener('touchstart', function(ev) {
            console.log('RENDER touchstart', ev);
            //ev.preventDefault();
        }, false);        

        this.hasNode().addEventListener('touchend', function(ev) {
            console.log('RENDER touchend', ev);
            ev.preventDefault();
        }, false);
    }, 
    handleTouch: function(inSender, inEvent) {
        this.log(inSender, inEvent);
    },
    handleKey: function(inSender, inEvent) {
        this.log(inEvent);
        // not recieving event from ResultBase

        if(inEvent.key == 'ArrowRight') {
            this.log('Go RIGHT');
            // this.waterfall('onAutoClick', {button: 'nc'});
        }

        if(inEvent.key == 'ArrowLeft') {
            this.log('Go LEFT');
            // this.waterfall('onAutoClick', {button: 'pc'});
        }
    }

});

