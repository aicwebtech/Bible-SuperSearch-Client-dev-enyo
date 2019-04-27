var kind = require('enyo/kind');
var Dialog = require('./Hover');
var Ajax = require('enyo/Ajax');
var utils = require('enyo/utils');
var Image = require('../Image');
var StrongsView = require('../../view/results/StrongsView');

module.exports = kind({
    name: 'StongsHoverDialog',
    kind: Dialog,
    showing: false,
    classes: 'strongs_hover',
    // style: '',
    width: 300,
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
            {name: 'ContentContainer', style: 'width: 400px', kind: StrongsView}
        ]}
    ],

    displayPosition: function(top, left, content, parentWidth, parentHeight) {
        this.inherited(arguments);
        this.strongsRaw = content;

        if(this._loadFromCache(content)) {
            this.showContent();
            return;
        }

        this.$.ContentContainer.destroyClientControls();
        this.showLoading();

        var postBody = {
            strongs: content
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
        if(!this.get('showing')) {
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
    }
});
