var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Input = require('enyo/Input');
var utils = require('enyo/utils');
var Dialog = require('./Dialog');
var i18n = require('../Locale/i18nComponent');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'ConfirmDialog',
    kind: Dialog,
    maxWidth: '400px',
    height: '300px',
    classes: 'help_dialog bss_confirm_dialog',
    isConfirming: false,
    callback: null,

    // bindings: [
    //     {from: 'controller.title', to: '$.Title.value', oneWay: false, transform: function(value, dir) {
    //         console.log('Bookmark title', value, dir);
    //         return value || null;
    //     }},                

    //     {from: 'controller.pageTitle', to: '$.PageTitle.value', oneWay: true, transform: function(value, dir) {
    //         console.log('Bookmark pageTitle', value, dir);
    //         return value || null;
    //     }},                
    // ],

    // titleComponents: [
    //     {classes: 'header', components: [
    //         {name: 'Header', kind: i18n, classes: 'bss_dialog_title', content: 'Bookmark'}
    //     ]}
    // ],

    bodyComponents: [
        {kind: Signal, onConfirm: 'handleConfirm', onPrompt: 'handlePrompt', onPromptAlert: 'handleAlert'},
        {tag: 'br'},
        {tag: 'br'},

        {name: 'Content', allowHtml: true},

        {tag: 'br'},
        {tag: 'br'},
    ],

    buttonComponents: [
        {name: 'Save', kind: Button, ontap: 'save', components: [
            {kind: i18n, content: 'Save'},
        ]},        
        // {name: 'DeleteSpacer', tag: 'span', classes: 'spacer'},
        // {name: 'Delete', kind: Button, ontap: 'delete', components: [
        //     {kind: i18n, content: 'Delete'},
        // ]},
        // {name: 'RestoreSpacer', tag: 'span', classes: 'spacer'},
        // {name: 'Restore', kind: Button, ontap: 'restore', components: [
        //     {kind: i18n, content: 'Restore'},
        // ]},        
        {name: 'MoveSpacer', tag: 'span', classes: 'spacer'},
        {name: 'Move', kind: Button, ontap: 'moveToCurrent', components: [
            {kind: i18n, content: 'Move to Current'},
        ]},
        {tag: 'span', classes: 'spacer'},
        {name: 'Cancel', kind: Button, ontap: 'cancel', components: [
            {kind: i18n, content: 'Cancel'},
        ]}
    ],

    handlers: {
        onLocaleChange: 'localeChanged',
    },

    close: function() {
        this.set('showing', false);
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);
    },
    handleAlert: function(inSender, inEvent) {
        this.alert(inEvent.message, inEvent.callback);
    },
    handleConfirm: function(inSender, inEvent) {
        this.alert(inEvent.message, inEvent.callback);
    },
    handlePrompt: function(inSender, inEvent) {
        this.alert(inEvent.message, inEvent.buttons, inEvent.callback);
    },
    alert: function(message, callback) {
        this.isConfirming = false;
        this._init(message, callback, ['Okay']);
    },
    confirm: function(message, callback) {
        this.isConfirming = true;
        this.callback = callback || null;
        this._init(message, callback, ['Okay', 'Cancel']);
    },
    prompt: function(message, buttons, callback) {
        this.isConfirming = false;
        buttons = buttons || [];
        this._init(message, buttons, callback);
    },
    _init: function(message, callback, buttons) {
        this.callback = callback || null;
        this.setButtons(buttons);
        this.$.Content.set('content', message);
        this.set('showing', true);
    },
    handleButtonTap: function(inSender, inEvent) {
        var value = inSender.get('value');

        if(this.isConfirming) {
            value = (value == 'cancel') ? false : true;
        }

        this.callback && this.callback(value);
        this.close();
    },
    setButtons: function(buttons) {
        this.$.ButtonBar.destroyClientControls();
        var components = [],
            label = null,
            value = null;

        for(i in buttons) {
            if(i > 0) {
               components.push({tag: 'span', classes: 'spacer'});
            }

            if(typeof buttons[i] == 'string') {
                label = buttons[i];
                value = buttons[i].toLowerCase();
            } else {
                label = buttons[i].label;
                value = buttons[i].value;
            }

            // this.log(buttons[i], label, value);

            components.push({
                kind: Button, ontap: 'handleButtonTap', owner: this, value: value, components: [
                    {kind: i18n, content: this.app.t(label)},
                ]
            });
        }

        // this.log(components);

        this.$.ButtonBar.createComponents(components);
        this.$.ButtonBar.render();
    }
});
