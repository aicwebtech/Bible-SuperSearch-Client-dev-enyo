var kind = require('enyo/kind');
var Signal = require('enyo/Signals');
var Dialog = require('./Dialog');
var HoverDialog = require('./Hover');
var i18n = require('../Locale/i18nContent');

module.exports = kind({
    name: 'AlertDialog',
    kind: Dialog,
    // kind: HoverDialog,
    width: '400px',
    height: '50px',
    classes: 'alert_dialog',
    showing: false,
    alert: '',
    pComponent: null,

    bodyComponents: [
        {kind: Signal, onAlert: 'openAlert', onPositionedAlert: 'openPositionedAlert'},
        {name: 'AlertContainer', allowHtml: true, tag: 'span', classes: 'alert_dialog_container'}
    ],

    bindings: [
        {from: 'alert', to: '$.AlertContainer.content', oneWay: true, transform: function(value, dir) {
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
        this._openAlertHelper(inEvent.alert || 'Alert');
        return;

        // various attempts to get the alert to position near the item clicked, not working
        var oSender = inEvent.inSender,
            oEvent = inEvent.inEvent,
            x = oEvent.clientX || null,
            y = oEvent.clientY || null;

        x += window.scrollX;
        y += window.scrollY;

        // this.log('oSender', oSender);
        this.log('oEvent', oEvent);
        this.log('scrollX', window.scrollX);
        this.log('scrollY', window.scrollY);

        if(x & y) {
            this.applyStyle('position', 'absolute');
            this.applyStyle('left', x + 'px');
            this.applyStyle('top', y + 'px');
            // this.applyStyle('width', this.widthMin + 'px');
            this.mouseX = x;
            this.mouseY = y;
            this._openAlertHelper(inEvent.alert || 'Alert');
            this.reposition();
        }

        // oSender.set('content', )
        // this.pComponent && this.pComponent.destroy();

        // this.pComponent = oSender.parent.createComponent({
        //     classes: 'alert_dialog_container',
        //     // tag:'span'
        //     components: [
        //         {                
        //             tag: 'span',
        //             content: inEvent.alert,
        //             classes: 'alert_dialog',
        //             // style: 'position: absolute; top: -5px'
        //         }
        //     ]
        // });

        // this.pComponent.render();


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
        }, 400);

    }
});
