var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var Base = require('./FormatButtonsHtml');
var Toggle = require('../ToggleHtml');
var Image = require('../Image');
var i18n = require('../Locale/i18nContent');
var LocaleSelector = require('../Locale/LocaleSelector');

module.exports = kind({
    name: 'FormatButtonsHtmlMinimal',
    kind: Base,
    classes: 'format_buttons_html',
    font: null,
    
    create: function() {
        this.inherited(arguments);
        this.$.settings_button.set('showing', true);
        this.$.TextEmbGroup1.set('showing', false);
        this.$.TextEmbGroup2.set('showing', false);
        this.$.language_selector.set('showing', false);
    }
});
