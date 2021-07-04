var kind = require('enyo/kind');
var Signal = require('enyo/Signals');
var Dialog = require('./Dialog');
var i18n = require('../Locale/i18nContent');

module.exports = kind({
    name: 'AlertDialog',
    // kind: Dialog,
    width: '200px',
    height: '130px',
    classes: 'alert_dialog',
    showing: false,
    alert: '',
    pComponent: null,

    components: [
        {kind: Signal, onAlert: 'openAlert', onPositionedAlert: 'openPositionedAlert'},
        {name: 'Container', allowHtml: true, tag: 'span'}
    ],

    bindings: [
        {from: 'alert', to: '$.Container.content', oneWay: true, transform: function(value, dir) {
            // console.log('FormatButtons advanced_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},   
    ],

    create: function() {
        this.inherited(arguments);
        this.log();
    },

    openAlert: function(inSender, inEvent) {
        this.log();
        this._openAlertHelper(inEvent.alert || 'Alert');
    },
    openPositionedAlert: function(inSender, inEvent) {
        var oSender = inEvent.inSender,
            oEvent = inEvent.inEvent,
            x = oEvent.pageX || null,
            y = oEvent.pageY || null;

        // this.log('oSender', oSender);
        // this.log('oEvent', oEvent);

        // if(x & y) {
        //     this.applyStyle('position', 'absolute');
        //     this.applyStyle('left', x + 'px');
        //     this.applyStyle('top', y + 'px');
        //     // this.applyStyle('width', this.widthMin + 'px');
        // }

        // oSender.set('content', )
        this.pComponent && this.pComponent.destroy();

        this.pComponent = oSender.parent.createComponent({
            classes: 'alert_dialog_container',
            // tag:'span'
            components: [
                {                
                    tag: 'span',
                    content: inEvent.alert,
                    classes: 'alert_dialog',
                    // style: 'position: absolute; top: -5px'
                }
            ]
        });

        this.pComponent.render();


        this._timerHelper();
        // this._openAlertHelper(inEvent.alert || 'Alert');
    },
    _openAlertHelper: function(alert) {
        this.set('alert', alert || 'Alert');
        this.set('showing', true);
        this._timerHelper();
    },
    _timerHelper: function() {
        var t = this;

        this.timer && window.clearTimeout(this.timer);

        this.timer = window.setTimeout( function() {
            t.set('showing', false);
            t.pComponent && t.pComponent.destroy();
        }, 1500);

    }
});
