var Select = require('./Select');
var kind = require('enyo/kind');

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
            var optLabel = (label == 'PDF') ? '<b>' + label + '</b> - ' : '';

            var optgroup = this.createComponent({
                allowHtml: true,
                tag: 'optgroup',
                allowHtml: true,
                attributes: {label: label}
            });

            item.formats.forEach(function(fm) {
                var info = item.renderers[fm];

                optgroup.createComponent({
                    tag: 'option',
                    attributes: {value: fm},
                    allowHtml: true,
                    content: optLabel + info.name
                });
            }, this);
        }, this);        
    }
});
