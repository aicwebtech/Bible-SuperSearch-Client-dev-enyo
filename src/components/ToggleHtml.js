var kind = require('enyo/kind');
var Image = require('./Image');
var Help = require('./ContextHelp');
var i18n = require('./Locale/i18nContent');

module.exports = kind({
    name: 'ToggleHtml',
    classes: 'bss_toggle bss_is_false',
    
    trueComponent: {},  // Component that displays when value = true
    falseComponent: {}, // Component that displays when value = false,
    trueContent: '',
    falseContent: '',    
    trueTitle: '',
    falseTitle: '',   

    help: false,
    helpComponents: [], 
    helpShowing: false,

    published: {
        value: false,
    },

    handlers: {
        ontap: 'handleTap',
        onmouseout: 'handleMouseOut'
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

        vf.addClass('bss_false');  
        vt.addClass('bss_true');  

        if(this.falseTitle) {
            vf.set('titleString', this.falseTitle);
        }        

        if(this.trueTitle) {
            vt.set('titleString', this.trueTitle);
        }

        if(this.help)  {
            var c = 'biblesupersearch_toggle_help ';
            c += this.app.configs.contextHelpInline ? 'bss_inline' : 'bss_tooltip'

            if(this.app.client.isMobile) {
                this.createComponent({
                    tag: 'span',
                    content: '&nbsp;&nbsp;',
                    allowHtml: true,
                    noTap: true
                });
            }

            this.createComponent({
                tag: 'sup',
                content: '?',
                classes: 'biblesupersearch_toggle_help',
                onmouseover: 'handleMouseOver',
                ontap: 'handleHelpTab',
                helpTap: true
            });

            if(this.app.client.isMobile) {
                this.createComponent({
                    tag: 'span',
                    content: '&nbsp;&nbsp;',
                    allowHtml: true,
                    helpTap: true
                });
            }

            this.createComponent({
                name: 'Help',
                showing: false,
                classes: c,
                components: this.helpComponents,
            });
        }
    },

    valueChanged: function(was, is) {        
        this.addRemoveClass('bss_is_true', !!is);
        this.addRemoveClass('bss_is_false', !is);
        this.$.ViewTrue && this.$.ViewTrue.set('showing', !!is);
        this.$.ViewFalse && this.$.ViewFalse.set('showing', !is);
        this.$.Help && this.$.Help.set('showing', false);
    },
    handleTap: function(inSender, inEvent) {
        if(inEvent.originator) {
            if(inEvent.originator.noTap) {
                return true;
            }

            if(inEvent.originator.helpTap) {
                this.handleHelpTab();
                return true;
            }
        }
        
        this.toggleValue();
    },
    handleHelpTab: function() {
        if(!this.$.Help) {
            return true;
        }
        
        this.$.Help && this.$.Help.set('showing', !this.$.Help.get('showing'));
        return true;
    },
    toggleValue: function() {
        this.set('value', !this.get('value'));
    },
    handleMouseOver: function() {
        if(this.app.client.isMobile) {
            return true;
        }
        
        this.$.Help && this.$.Help.set('showing', true);
    }, 
    handleMouseOut: function() {
        if(this.app.client.isMobile) {
            return true;
        }
        
        this.$.Help && this.$.Help.set('showing', false);
    }
});
