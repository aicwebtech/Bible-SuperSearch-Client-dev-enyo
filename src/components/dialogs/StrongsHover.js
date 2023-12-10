var kind = require('enyo/kind');
var Dialog = require('./Hover');
var Ajax = require('enyo/Ajax');
var utils = require('enyo/utils');
var Image = require('../Image');
var StrongsView = require('../../view/results/StrongsView');

var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');

module.exports = kind({
    name: 'StongsHoverDialog',
    kind: Dialog,
    showing: false,
    classes: 'strongs_hover',
    width: 400,
    height: 300,

    strongsCache: {},
    strongsRaw: null,

    components: [
        {classes: 'inner', components: [
            {name: 'LoadingContainer', showing: false, components: [
                {
                    classes: 'biblesupersearch_center_element', style: 'width:78px',
                    components: [
                        {kind: Image, relSrc: '/Spinner.gif' }
                    ]
                },
                {content: 'Loading, please wait ...', style: 'padding: 10px; font-weight: bold'},
            ]},
            //{style: 'padding: 50px', classes: 'hover_dialog', components: [
                {name: 'ContentContainer', kind: StrongsView},
                {
                    name: 'ButtonContainer',
                    classes: 'buttons biblesupersearch_center_element',
                    components: [
                        {name: 'Link', kind: Button, ontap: 'followLink', components: [
                            {kind: i18n, content: 'Search for'},
                            {tag: 'span', content: '&nbsp;', allowHtml: true},
                            {tag: 'span', name: 'SearchFor'}
                        ]},
                        {name: 'LinkSpacer', tag: 'span', classes: 'spacer'},
                        {name: 'Close', kind: Button, ontap: 'close', components: [
                            {kind: i18n, content: 'Close'},
                        ]}     
                    ]
                }
            //]}
        ]}
    ],

    bindings: [
        {from: 'strongsRaw', to: '$.SearchFor.content'}
    ],

    create: function() {
        this.inherited(arguments);
        this.$.Link.set('showing', this.app.configs.strongsDialogSearchLink);
        this.$.LinkSpacer.set('showing', this.app.configs.strongsDialogSearchLink);
    },
    displayPosition: function(top, left, content, parentWidth, parentHeight, showButtons) {
        this.inherited(arguments);
        this.set('strongsRaw', content);

        if(this._loadFromCache(content)) {
            this.showContent();
            return;
        }

        this.$.ContentContainer.destroyClientControls();
        this.showLoading();

        var postBody = {
            strongs: content,
            key: this.app.configs.apiKey || null
        };

        var ajax = new Ajax({
            url: this.app.configs.apiUrl + '/strongs',
            cacheBust: false,
            method: 'GET'
        });

        ajax.go(postBody); // for GET
        ajax.response(this, 'handleResponse');
        ajax.error(this, 'handleError');
    },
    handleResponse: function(inSender, inResponse) {
        this.set('showing', true);

        if(!this.get('showing')) {
            this.app.debug && this.log('Strongs dialog not showing, exiting');
            return;
        }

        this.$.ContentContainer.destroyClientControls();
        inResponse.results.forEach(utils.bind(this, function(strong) {
            this.strongsCache[strong.number] = strong;
            this.$.ContentContainer._addStrongs(strong);
        }));
        
        this.$.ContentContainer.render();
        this.showContent();
    },
    handleError: function(inSender, inResponse) {
        this.showContent();
        this.$.ContentContainer.set('content', 'An error has occurred');
    },
    _loadFromCache: function(strongs) {
        if(typeof this.strongsCache[strongs] == 'undefined') {
            return false;
        }

        this.$.ContentContainer.destroyClientControls();
        this.$.ContentContainer._addStrongs(this.strongsCache[strongs]);
        this.$.ContentContainer.render();
        return true;
    },
    followLink: function() {
        //http://ui-dev.bss.plsv/#/strongs/kjv_strongs/H5612

        var url = '#/strongs/' + this.app.getSelectedBiblesString() + '/' + this.strongsRaw;
        window.location = url;
    }
});
