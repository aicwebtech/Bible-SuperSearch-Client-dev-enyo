var FormBase = require('../FormBaseMultiple');
var kind = require('enyo/kind');
var AdvWord = require('./AdvancedWord');
var AdvProximity = require('./AdvancedProximity');
var AdvPower = require('./AdvancedPower');
var EtcButtons = require('../../components/DialogEtcButtons/DialogEtcButtonsHtml');
var Input = require('../../components/Locale/i18nInput');
var Bible = require('../../components/BibleSelect/MultiSelect');

module.exports = kind({
    name: 'Advanced',
    kind: FormBase,
    autoApplyStandardBindings: false,
    formContainer: true,
    formNames: ['AdvWord', 'AdvProximity', 'AdvPower'],

    components: [
        {
            // minimum elements
            showing: false,
            components: [
                { components: [
                    {kind: Input, name: 'request'},
                ]},        
                { components: [
                    {kind: Bible, name: 'bible', parallelLimit: 12, selectorWidth: 500},
                ]},
            ]
        },

        {
            name: 'AdvWord',
            kind: AdvWord,
            classes: 'biblesupersearch_classic_form bss_advanced',
            subForm: true
        },        
        {
            name: 'AdvProximity',
            kind: AdvProximity,
            classes: 'biblesupersearch_classic_form bss_advanced',
            subForm: true
        },        
        {
            name: 'AdvPower',
            kind: AdvPower,
            classes: 'biblesupersearch_classic_form bss_advanced',
            subForm: true,
            defaultForm: true
        },
        {
            kind: EtcButtons
        }
    ]
});
