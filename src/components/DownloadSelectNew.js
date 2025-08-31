var Select = require('./PseudoSelect/PseudoSelect');
var OptGroup = require('./PseudoSelect/PseudoOptGroup');
var Opt = require('./PseudoSelect/PseudoOption');
var kind = require('enyo/kind');
var i18n = require('./Locale/i18nComponent');

module.exports = kind({
    name: 'DownloadSelectNew',
    kind: Select,

    create: function() {
        this.inherited(arguments);

        var statics = this.app.get('statics'),
            formats = statics.download_formats,
            width = (this.isShort) ? this.shortWidthWidth : this.width;

        this.createOptionComponent({
            content: 'Select one ...',
            //allowHtml: true, // unnessessary?
            value: '0'
        });

        formats.forEach(function(item) {
            var unit = (item == 1) ? this.rangeUnit : this.rangeUnitPlural;
            var label = item.name;
            var optLabel = (label == 'PDF') ? label + ' - ' : '';
            var labelNoHtml = label.replace(/(<([^>]+)>)/gi, "");

            this.$.Toggle.createComponent({
                kind: OptGroup,
                label: labelNoHtml,
                attributes: {label: labelNoHtml},
            });

            item.formats.forEach(function(fm) {
                var info = item.renderers[fm];
                var content = optLabel + info.name;
                content = content.replace(/(<([^>]+)>)/gi, "");

                this.$.Toggle.createComponent({
                    kind: Opt,
                    content: content, 
                    value: fm,
                    grouped: true
                });
            }, this);
        }, this);        

        this.initOptions();
    }
});
