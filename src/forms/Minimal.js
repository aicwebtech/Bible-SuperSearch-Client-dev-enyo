var kind = require('enyo/kind');
var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');

module.exports = kind({
    name: 'Minimal',
    kind: FormBase,

    components: [
        { components: [
            {kind: Input, name: 'request'},
            {kind: Button, content: 'Go', ontap: 'submitForm'}
        ]}
    ]
});
