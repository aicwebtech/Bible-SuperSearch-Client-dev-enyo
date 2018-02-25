var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');

module.exports = kind({
    name: 'Minimal',
    kind: FormBase,

    components: [
        { classes: 'single_line', components: [
            {kind: Input, name: 'request', placeholder: 'Enter passage reference(s) or search keyword(s)'},
            {kind: Button, content: 'Go', ontap: 'submitForm'}
        ]}
        // {classes: 'single_line', content: 'Enter a passage reference(s) or search keyword(s) above. Example: Jn 3:16 or faith'}
    ]
});
