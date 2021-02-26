var Select = require('./Select');
var kind = require('enyo/kind');
var i18n = require('./Locale/i18nComponent');

module.exports = kind({
    name: 'DownloadSelect',
    kind: Select,

    create: function() {
        this.inherited(arguments);

        var statics = this.app.get('statics'),
            formats = statics.download_formats,
            configs = this.app.get('configs'),
            enabled = configs.enabledBibles,
            noSelectLabel = 'Select a Bible',
            width = (this.isShort) ? this.shortWidthWidth : this.width;

        this.createComponent({
            content: 'Select one ...',
            allowHtml: true,
            value: '0'
        });

        formats.forEach(function(item) {
            var unit = (item == 1) ? this.rangeUnit : this.rangeUnitPlural;
            var label = item.name;
            var optLabel = (label == 'PDF') ? label + ' - ' : '';
            var labelNoHtml = label.replace(/(<([^>]+)>)/gi, "");

            var optgroup = this.createComponent({
                kind: i18n,
                tag: 'optgroup',
                allowHtml: true,
                attributes: {label: labelNoHtml}
            });

            item.formats.forEach(function(fm) {
                var info = item.renderers[fm];
                var content = optLabel + info.name;
                content = content.replace(/(<([^>]+)>)/gi, "");

                optgroup.createComponent({
                    kind: i18n,
                    tag: 'option',
                    attributes: {value: fm},
                    content: content
                });
            }, this);
        }, this);        
    }
});
