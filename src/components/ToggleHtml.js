var kind = require('enyo/kind');
var Image = require('./Image');
var i18n = require('./Locale/i18nContent');

module.exports = kind({
    name: 'ToggleHtml',
    // tag: 'span',
    classes: 'is_false',
    
    trueComponent: {},  // Component that displays when value = true
    falseComponent: {}, // Component that displays when value = false,
    trueContent: '',
    falseContent: '',    
    trueTitle: '',
    falseTitle: '',    

    published: {
        value: false,
    },

    handlers: {
        ontap: 'toggleValue'
    },

    create: function() {
        this.inherited(arguments);

        this.trueComponent.name = 'ViewTrue';
        this.trueComponent.tag = this.trueComponent.tag || 'span';
        this.trueComponent.showing = this.value;
        this.trueComponent.content = this.trueContent;
        this.trueComponent.kind = i18n;

        this.falseComponent.name = 'ViewFalse';
        this.falseComponent.tag = this.falseComponent.tag || 'span';
        this.falseComponent.showing = !this.value;
        this.falseComponent.content = this.falseContent;
        this.falseComponent.kind = i18n;

        var vf = this.createComponent(this.falseComponent);  
        var vt = this.createComponent(this.trueComponent);      

        vf.addClass('false');  
        vt.addClass('true');  

        if(this.falseTitle) {
            // vf.setAttribute('title', this.falseTitle);
            vf.set('titleString', this.falseTitle);
        }        

        if(this.trueTitle) {
            // vt.setAttribute('title', this.trueTitle);
            vt.set('titleString', this.trueTitle);
        }
    },

    valueChanged: function(was, is) {        
        this.addRemoveClass('is_true', !!is);
        this.addRemoveClass('is_false', !is);
        this.$.ViewTrue && this.$.ViewTrue.set('showing', !!is);
        this.$.ViewFalse && this.$.ViewFalse.set('showing', !is);
    },
    toggleValue: function() {
        this.set('value', !this.get('value'));
    }
});
