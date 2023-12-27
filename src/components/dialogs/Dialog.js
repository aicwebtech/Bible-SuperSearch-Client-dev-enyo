var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Signal = require('../Signal');

module.exports = kind({
    name: 'Dialog',
    showing: false,
    width: '300px',
    height: '200px',
    varyingHeight: false,
    maxWidth: null,
    maxHeight: null,
    classes: 'biblesupersearch_dialog',

    titleBarHeight: 36, // private
    buttonBarHeight: 36, // private

    published: {
        title: null,
    },

    handlers: {
        resize: 'handleResize'
    },

    bodyComponents: [],
    titleComponents: [],
    buttonComponents: [],

    components: [
        {name: 'Container', classes: 'biblesupersearch_center_element super_container', components: [
            {name: 'SubContainer', classes: 'dialog', components: [
                {name: 'TitleBar', classes: 'title', showing: false},
                {name: 'Body', classes: 'content', showing: true},
                {name: 'ButtonBar', classes: 'buttons', showing: false}
            ] },
        ]},
        {
            kind: Signal, 
            onkeyup: 'handleKey'
        }
    ],

    create: function() {
        this.inherited(arguments);
        this.processDimensions();

        if(this.titleComponents.length > 0) {
            this.$.TitleBar.createComponents(this.titleComponents);
            this.$.TitleBar.set('showing', true);
        }

        this.$.Body.createComponents(this.bodyComponents, {owner: this});

        if(this.buttonComponents.length > 0) {
            this.$.ButtonBar.createComponents(this.buttonComponents, {owner: this});
            this.$.ButtonBar.set('showing', true);
        }
    }, 
    // showingChanged: function(was, is) {
    //     this.inherited(arguments);
    // },
    close: function() {
        if(!this._safeToClose()) {
            return;
        }

        this.set('showing', false);
    },
    _safeToClose: function() {
        return true;
    },
    handleResize: function(inSender, inEvent) {
        this.processDimensions();
    },
    processDimensions: function() {
        var docWidth = document.documentElement.clientWidth,
            docHeight = document.documentElement.clientHeight,
            myHeight = 0;
            maxHeightDoc = docHeight - 10;
            style = '',
            height = parseInt(this.height, 10),
            headerHeight = 0,
            smallScreen = false,
            n = this.name;

        if(this.hasNode()) {
            myBounds = this.hasNode().getBoundingClientRect();
            myHeight = myBounds.height;
        }

        this.log(n, 'docHeight', docHeight);
        this.log(n, 'raw Height', this.height);
        this.log(n, 'parsed Height', height);
        
        if(this.maxWidth) {
            style += 'max-width: ' + this.maxWidth + '; ';
        }
        else if(this.width) {
            style += 'width: ' + this.width + '; ';
        }

        if(this.maxHeight) {
            style += 'max-height: ' + this.maxHeight + '; ';
            height = this.maxHeight;
        }

        if(height > maxHeightDoc) {
            height = maxHeightDoc;
            smallScreen = true;
        }
        
        var headerItems = [
            'TitleBar', 
            'ButtonBar', 
        ];

        headerItems.forEach(function(item) {
            var element = this.$[item] ? this.$[item].hasNode() : null;

            if(!element) {
                return;
            }

            var style = element.currentStyle || window.getComputedStyle(element);
            headerHeight += element.offsetHeight;
            headerHeight += parseInt(style.marginTop, 10);
            headerHeight += parseInt(style.marginBottom, 10);
        }, this);

        var minHeaderHeight = this.titleBarHeight + this.buttonBarHeight + 10;
        headerHeight = headerHeight < minHeaderHeight ? minHeaderHeight : headerHeight;

        // height = height > docHeight ? docHeight : height;
        this.log(n, 'headerHeight', headerHeight);

        var bodyHeight = height - headerHeight;

        this.log(n, 'adusted h', height);

        if(this.varyingHeight) {
            height = Math.max(height, myHeight);
        }

        style += 'height: ' + height + 'px; ';
        
        if(smallScreen) {
            style += 'margin-top: 5px; margin-bottom: 5px';
            // style += 'top: 5px; bottom: 5px;';
        } else {
            //style += 'margin-top: calc(50vh - ' + height + 'px / 2);'; // Vertical align using height
            style += 'margin-top: calc(50vh - ' + height / 2 + 'px);'; // Vertical align using height
        }


        this.$.Container.setStyle(style);

        var bodyStyle = 'max-height: ' + bodyHeight + 'px; ';
        this.$.Body.setStyle(bodyStyle);

        this.log(n, 'smallScreen', smallScreen);
        this.log(n, 'Container style', style);
        this.log(n, 'Body style', bodyStyle);
    },
    handleKey: function(inSender, inEvent) {
        if(inEvent.code == 'Escape') {
            this.close();
        }
    }

});
