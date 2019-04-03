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
            // this.inherited(arguments);
            return;
        }

        this.$.ContentContainer.destroyClientControls();
        this.showLoading();
        // this.inherited(arguments);

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
        this.$.ContentContainer.destroyClientControls();
        inResponse.results.forEach(utils.bind(this, function(strong) {
            this.strongsCache[strong.number] = strong;
            // this._addStrongs(strong);
            this.$.ContentContainer._addStrongs(strong);
        }));
        
        // this.strongsCache[this.strongsRaw] = inResponse.results;
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
        // this.strongsCache[strongs].forEach(utils.bind(this, this._addStrongs));
        this._addStrongs(this.strongsCache[strongs]);
        this.$.ContentContainer.render();
        return true;
    },
    _addStrongs: function(item) {
        this.log('strongs item', item);
        var head = '';
        var text = '';

        if(item.number.charAt(0) == "H"){
            var classes = 'hebrew';
            // $pd="5px";
        }
        else {
            // $pd="10px";
            var classes = 'greek';
        }

        if(item.tvm && item.tvm != '') {
            text = item.tvm;

            var comp = this.$.ContentContainer.createComponent({
                classes: classes,
                components: [
                    {classes: 'strongs_tvm', allowHtml: true, content: item.tvm}
                ]
            });
        }
        else {
            head = '<span>' + item.root_word + '</span> &nbsp; (' + item.number + ')<br />' + item.transliteration + ' (' + item.pronunciation + ')';
            text = item.entry;
    
            var comp = this.$.ContentContainer.createComponent({
                classes: classes,
                components: [
                    {classes: 'strongs_head', allowHtml: true, content: head},
                    {classes: 'strongs_body', allowHtml: true, content: text},
                ]
            });
        }
    }

});
