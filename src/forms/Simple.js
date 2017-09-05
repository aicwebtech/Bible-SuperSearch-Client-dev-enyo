var kind = require('enyo/kind');

var FormBase = require('./FormBase');
var Button = require('enyo/Button');
var Input = require('enyo/Input');

module.exports = kind({
    name: 'Simple',
    kind: FormBase,

    components: [
        {content: 'Simple FORM'},
        { components: [
            {name: 'request', kind: Input, style: 'width: 80%'},
            {kind: Button, content: 'Go', ontap: 'submitForm'}
        ]}
    ], 

    bindings: [
        {from: '$.request.value', to: 'formData.request', oneWay: false}
    ]
});
