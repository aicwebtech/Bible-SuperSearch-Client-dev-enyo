var FormBase = require('../FormBase');
var kind = require('enyo/kind');
var AdvWord = require('./AdvancedWord');
var AdvProximity = require('./AdvancedProximity');
var AdvPower = require('./AdvancedPower');

module.exports = kind({
    name: 'Advanced',
    kind: FormBase,

    components: [
        {
            name: 'AdvWord',
            kind: AdvWord,
            classes: 'biblesupersearch_classic_form',
            subForm: true
        },        
        {
            name: 'AdvProximity',
            kind: AdvProximity,
            classes: 'biblesupersearch_classic_form',
            subForm: true
        },        
        {
            name: 'AdvPower',
            kind: AdvPower,
            classes: 'biblesupersearch_classic_form',
            subForm: true
        }
    ]

});