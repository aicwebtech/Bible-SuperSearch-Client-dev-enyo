var kind = require('enyo/kind');
var Image = require('./Image');

module.exports = kind({
    name: 'ToggleHtml',
    // tag: 'span',
    
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

        this.falseComponent.name = 'ViewFalse';
        this.falseComponent.tag = this.falseComponent.tag || 'span';
        this.falseComponent.showing = !this.value;
        this.falseComponent.content = this.falseContent;

        var vf = this.createComponent(this.falseComponent);  
        var vt = this.createComponent(this.trueComponent);      

        vf.addClass('false');  
        vt.addClass('true');  

        if(this.falseTitle) {
            vf.setAttribute('title', this.falseTitle);
        }        

        if(this.trueTitle) {
            vt.setAttribute('title', this.trueTitle);
        }
    },

    valueChanged: function(was, is) {        
        if(is) {
            this.$.ViewTrue && this.$.ViewTrue.set('showing', true);
            this.$.ViewFalse && this.$.ViewFalse.set('showing', false);
        }
        else {
            this.$.ViewFalse && this.$.ViewFalse.set('showing', true);
            this.$.ViewTrue && this.$.ViewTrue.set('showing', false);
        }
    },
    toggleValue: function() {
        this.set('value', !this.get('value'));
    }
});
