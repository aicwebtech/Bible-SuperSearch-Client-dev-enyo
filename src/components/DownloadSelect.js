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
            content: 'Select a Download Format',
            allowHtml: true,
            value: '0'
        });

        formats.forEach(function(item) {
            this.log(item);
            var unit = (item == 1) ? this.rangeUnit : this.rangeUnitPlural;
            var label = item.name;


            var optgroup = this.createComponent({
                allowHtml: true,
                tag: 'optgroup',
                allowHtml: true,
                // value: item
                attributes: {label: label}
            });

            var optLabel = '<b>' + label + '</b> - ';

            item.formats.forEach(function(fm) {
                var info = item.renderers[fm];

                this.log(info);



                optgroup.createComponent({
                    tag: 'option',
                    value: fm,
                    allowHtml: true,
                    content: optLabel + info.name
                });
            }, this);


        }, this);        
    }
});
