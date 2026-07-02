var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Anchor = require('enyo/Anchor');
var Input = require('enyo/Input');
var Checkbox = require('enyo/Checkbox');
var Group = require('enyo/Group');
var LanguageSelectorNew = require('../Locale/LocaleSelector');
var LanguageSelector = require('../Locale/LocaleSelectorOld');
var Dialog = require('./Dialog');
var LinkBuilder = require('../Link/LinkBuilder');
var i18n = require('../Locale/i18nContent');
var inc = require('../../components/Locale/i18nComponent');
var Toggle = require('../ToggleHtml');
var ContextHelp = require('../ContextHelp');
var ConfirmDialog = require('./Confirm');

// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
var Signal = (enyo && enyo.Signals) ? enyo.Signals : Signal;

module.exports = kind({
    name: 'SettingsDialog',
    kind: Dialog,
    maxWidth: '350px',
    height: '575px',
    classes: 'bss_help_dialog bss_bible_settings',
    bibleString: null,

    handlers: {
        onActiveChanged: 'handleActiveChanged'
    },
    
    titleComponents: [
        {classes: 'bss_header', components: [
            {kind: i18n, classes: 'bss_dialog_title', content: 'Settings'}, 
        ]}
    ],

    bodyComponents: [
        {name: 'LanguageSelectorBlock', components: [
            {kind: i18n, tag: 'span', content: 'Language'},
            {tag: 'br'},
            {name: 'Language', kind: LanguageSelector, style: 'width:250px'},
        ]},
        {tag: 'br'},
        {
            classes: 'bss_settings_toggle bss_highlight_toggle',
            name: 'highlight_toggle',
            kind: Toggle,         
            trueTitle: 'Disable Highlighting of Keywords',
            falseTitle: 'Enable Highlighting of Keywords',
            trueComponent: {
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'check_box'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Highlight'}
                ]
            },        
            falseComponent: {
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'check_box_outline_blank'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Highlight'}
                ]
            },
            help: true,
            helpComponents: [
                {kind: i18n, tag: 'span', content: 'highlight_description'}
            ]
        },    
        {
            classes: 'bss_settings_toggle bss_redletter_toggle',
            name: 'redletter_toggle',
            kind: Toggle,         
            trueTitle: 'Disable Red Letter',
            falseTitle: 'Enable Red Letter', 
            trueComponent: {
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'check_box'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Red Letter'}
                ]
            },        
            falseComponent: {
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'check_box_outline_blank'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Red Letter'}
                ]
            },
            help: true,
            helpComponents: [
                {tag: 'span', kind: i18n, content: 'red_letter_description'},
                {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;('},
                {tag: 'span', kind: i18n, content: 'Supported Bibles Only'},
                {tag: 'span', content: '.)'}
            ]
        },
        {
            classes: 'bss_settings_toggle bss_italics_toggle',
            name: 'italics_toggle',
            kind: Toggle,         
            trueTitle: 'Disable Italization of Added Words',
            falseTitle: 'Enable Italization of Added Words',
            trueComponent: {
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'check_box'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Italics'}
                ]
            },        
            falseComponent: {
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'check_box_outline_blank'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {kind: i18n, tag: 'span', content: 'Italics'}
                ]
            },
            help: true,
            helpComponents: [
                {tag: 'span', kind: i18n, content: 'italics_description'},
                {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;('},
                {tag: 'span', kind: i18n, content: 'Supported Bibles Only'},
                {tag: 'span', content: '.)'}
            ]
        },        
        {
            classes: 'bss_settings_toggle bss_strongs_toggle',
            name: 'strongs_toggle',
            kind: Toggle,        
            trueTitle: 'Disable Strong\'s Numbers',
            falseTitle: 'Enable Strong\'s Numbers',
            trueComponent: {
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'check_box'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {tag: 'span', content: 'Strong&rsquo;s', allowHtml: true}
                ]
            },        
            falseComponent: {
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'check_box_outline_blank'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},       
                    {tag: 'span', content: 'Strong&rsquo;s', allowHtml: true}         
                ]
            },
            help: true,
            helpComponents: [
                {tag: 'span', kind: i18n, content: 'strongs_numbers_description'},
                {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;('},
                {tag: 'span', kind: i18n, content: 'Supported Bibles Only'},
                {tag: 'span', content: '.)'}
            ]
        },               
        {
            classes: 'bss_settings_toggle bss_parallel_search_error_toggle',
            name: 'parallel_search_error_toggle',
            kind: Toggle,        
            showing: false,
            trueTitle: 'Show Parallel Search Errors',
            falseTitle: 'Hide Parallel Search Errors',
            trueComponent: {
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'check_box'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},
                    {tag: 'small', kind: i18n, content: 'Hide Parallel Search Errors', _allowHtml: true} // unnecessary
                ]
            },        
            falseComponent: {
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'check_box_outline_blank'},
                    {tag: 'span', allowHtml: true, content: '&nbsp;&nbsp;'},       
                    {tag: 'small', kind: i18n, content: 'Hide Parallel Search Errors', _allowHtml: true} // unnecessary
                ]
            },
            help: true,
            helpComponents: [
                {tag: 'span', content: '"'},
                {tag: 'span', kind: i18n, content: 'However, verses from this Bible have been included for comparison.'},
                {tag: 'span', content: '"'}
            ]
        },
        {
            classes: 'bss_section',
            name: 'CrossReferencesContainer',
            components: [
                {kind: inc, content: 'Cross References', classes: 'bss_header'},
                {
                    kind: Group,
                    name: 'cross_references_mode_group',
                    onActiveChanged: 'handleActiveChanged',
                    classes: 'bss_settings_container',
                    components: [
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'cross_references_hidden', id: 'cross_references_hidden', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'cross_references_hidden'}, classes: 'bss_label', content: 'Hidden'}
                        ]},
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'cross_references_toggle', id: 'cross_references_toggle', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'cross_references_toggle'}, classes: 'bss_label', content: 'Toggle'}
                        ]},
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'cross_references_show', id: 'cross_references_show', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'cross_references_show'}, classes: 'bss_label', content: 'Show'}
                        ]},
                    ]
                },
                {kind: inc, content: 'Cross Reference Format', classes: 'bss_header'},
                {
                    kind: Group,
                    name: 'cross_references_format_group',
                    onActiveChanged: 'handleActiveChanged',
                    classes: 'bss_settings_container',
                    components: [
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'cross_references_format_compact', id: 'cross_references_format_compact', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'cross_references_format_compact'}, classes: 'bss_label', content: 'Compact'}
                        ]},
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'cross_references_format_auto', id: 'cross_references_format_auto', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'cross_references_format_auto'}, classes: 'bss_label', content: 'Auto'}
                        ]},
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'cross_references_format_expand', id: 'cross_references_format_expand', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'cross_references_format_expand'}, classes: 'bss_label', content: 'Expand'}
                        ]},
                    ]
                }
            ]
        },
        {tag: 'br'},
        {
            classes: 'bss_section', 
            name: 'RenderStyleContainer',
            components: [
                {kind: inc, content: 'Text Display', classes: 'bss_header'},
                {
                    kind: Group,
                    name: 'render_style',
                    onActiveChanged: 'handleActiveChanged',
                    classes: 'bss_settings_container',
                    components: [
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'paragraph', id: 'paragraph', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'paragraph'}, classes: 'bss_label', content: 'Paragraph Display'}
                        ]},                
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'passage', id: 'passage', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'passage'}, classes: 'bss_label', content: 'Passage Display'}
                        ]},                
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'verse', id: 'verse', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'verse'}, classes: 'bss_label', content: 'Verse Display'}
                        ]},                         
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'verse_passage', id: 'verse_passage', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'verse_passage'}, classes: 'bss_label', content: 'Verse as Passage Display'}
                        ]},                
                    ]
                }      
            ]
        },        
        {tag: 'br'},
        {
            classes: 'bss_section', 
            components: [
                {kind: inc, content: 'Font Style', classes: 'bss_header'},
                {
                    kind: Group,
                    name: 'font',
                    onActiveChanged: 'handleActiveChanged',
                    classes: 'bss_settings_container',
                    components: [
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'serif', id: 'serif', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'serif'}, classes: 'bss_label bss_font_serif', content: 'Serif'}
                        ]},                
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'sans-serif', id: 'sans-serif', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'sans-serif'}, classes: 'bss_label bss_font_sans_serif', content: 'Sans-Serif'}
                        ]},                
                        {classes: 'bss_checkbox_container bss_checkbox_first', components: [
                            {classes: 'bss_element', components: [
                                {kind: Checkbox, name: 'monospace', id: 'monospace', type: 'radio'}
                            ]},
                            {kind: i18n, tag: 'label', attributes: {for: 'monospace'}, classes: 'bss_label bss_font_monospace', content: 'Monospace'}
                        ]},                
                    ]
                }      
            ]
        },

        // TODO: future
        // {tag: 'br'},
        // {components: [
        //    {kind: i18n, content: 'Results per Page'},
        //    {tag: 'span', allowHtml: true, content: ':&nbsp;'},
        //    {kind: Input, name: 'page_limit', attributes: {size: 1}},
        //    {tag: 'span', allowHtml: true, content: '&nbsp;'},
        //    {kind: i18n, content: 'verses'}     
        // ]},
        // {components: [
        //    {kind: i18n, content: 'Context Range'},
        //    {tag: 'span', allowHtml: true, content: ':&nbsp;'},
        //    {kind: Input, name: 'context_range', attributes: {size: 1}},
        //    {tag: 'span', allowHtml: true, content: '&nbsp;'},
        //    {kind: i18n, content: 'verses'}     
        // ]},        
        // {tag: 'br'},
        // {tag: 'br'},

        // {classes: 'bss_center', components: [            
        //     {name: 'Reset', kind: Button, ontap: 'close', components: [
        //         {kind: i18n, content: 'Reset'},
        //     ]}
        // ]}
    ],

    buttonComponents: [
        {name: 'Reset', kind: Button, ontap: 'reset', _classes: 'bss_float_left', components: [
            {kind: i18n, content: 'Reset'},
        ]},
        // {tag: 'span', classes: 'bss_spacer'}, 
        // {tag: 'span', classes: 'bss_spacer'}, 
        {name: 'Save', kind: Button, ontap: 'save', components: [
            {kind: i18n, content: 'Save'},
        ]},
        // {tag: 'span', classes: 'bss_spacer'}, 
        // {tag: 'span', classes: 'bss_spacer'}, 
        {name: 'Close', kind: Button, ontap: 'close', components: [
            {kind: i18n, content: 'Close'},
        ]}
    ],

    bindings: [    
        {from: 'app.UserConfig.italics', to: '$.italics_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons italics', value, dir);

            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
            return value;
        }},         
        {from: 'app.UserConfig.strongs', to: '$.strongs_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons strongs', value, dir);
            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
            return value;
        }},             
        {from: 'app.UserConfig.red_letter', to: '$.redletter_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons red_letter', value, dir);
            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
            return value;
        }},
        {from: 'app.UserConfig.highlight', to: '$.highlight_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons red_letter', value, dir);
            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
            return value;
        }},        
        {from: 'app.UserConfig.parallel_search_error_suppress', to: '$.parallel_search_error_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('Settings parallel_search_error_suppress', value, dir);
            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
            return value;
        }},
        {from: 'app.UserConfig.context_range', to: '$.context_range.value', oneWay: false, transform: function(value, dir) {
            // console.log('Settings context_range', value, dir);
            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
            return value;
        }},        
        {from: 'app.UserConfig.page_limit', to: '$.page_limit.value', oneWay: false, transform: function(value, dir) {
            // console.log('Settings page_limit', value, dir);
            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
            return value;
        }},        
        // We hide the render style selector when in copy mode, re: it will collide with the pre-set copy settingss
        // Users can assess it under the 'custom' copy settings
        {from: 'app.UserConfig.copy', to: '$.RenderStyleContainer.showing', oneWay: true, transform: function(value, dir) {
            // console.log('Settings COPY renderstyle', value, dir);
            return value ? false : true;
        }},

        {from: 'app.UserConfig.render_style', to: 'renderStyle', oneWay: false, transform: function(value, dir) {
            // console.log('SETTINGS renderStyle', value, dir);

            if(dir == 1 && this.$[value]) {
            // if( this.$[value]) {
                this.$.render_style.set('active', this.$[value]); //.render();
                this.$[value].set('checked', true);
            }

            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 

            return value;
        }},         
        {from: 'app.UserConfig.font', to: 'font', oneWay: false, transform: function(value, dir) {
            // console.log('SETTINGS font', value, dir);

            if(dir == 1 && this.$[value]) {
                this.$.font.set('active', this.$[value]);
                this.$[value].set('checked', true);
            }

            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 

            return value;
        }},
        {from: 'app.UserConfig.crossReferencesShow', to: 'crossReferencesShow', oneWay: false, transform: function(value, dir) {
            value = this.app.normalizeCrossReferencesShow(value);

            if(dir == 1) {
                var selected = 'cross_references_' + value;

                if(this.$[selected]) {
                    this.$.cross_references_mode_group.set('active', this.$[selected]);
                    this.$[selected].set('checked', true);
                }
            }

            dir == 2 && this.app.userConfigChanged();
            return value;
        }},
        {from: 'app.UserConfig.crossReferenceFormat', to: 'crossReferenceFormat', oneWay: false, transform: function(value, dir) {
            value = this.app.normalizeCrossReferenceFormat(value);

            if(dir == 1) {
                var selected = 'cross_references_format_' + value;

                if(this.$[selected]) {
                    this.$.cross_references_format_group.set('active', this.$[selected]);
                    this.$[selected].set('checked', true);
                }
            }

            dir == 2 && this.app.userConfigChanged();
            return value;
        }},
    ],

    handlers: {
        onLocaleChange: 'localeChanged',
    },

    create: function() {
        if(this.multiColumn) {
            this.width = '1200px';
        }

        if(this.app.get('useNewSelectors')) {
            this.bodyComponents[0].components[2].kind = LanguageSelectorNew;
        }

        this.inherited(arguments);

        if(
           !this.app.configs.saveUserSettingsManual || 
            this.app.configs.saveUserSettingsManual == 'false' ||
            !this.app.configs.saveUserSettings ||
            this.app.configs.saveUserSettings == 'false'
        ) {
            this.$.Save.hide();
        }

        if(!this.app.configs.languageSelectionEnable || this.app.configs.languageSelectionEnable == 'false') {
            this.$.LanguageSelectorBlock.hide();
        }

        this.$.parallel_search_error_toggle.set('showing', this.app.configs.parallelSearchErrorSuppressUserConfig);
        this.$.CrossReferencesContainer.set('showing', this.app.crossReferencesEnabled());

        this.createComponent({
            name: 'ConfirmDialog',
            kind: ConfirmDialog,
            showing: false
        });
    },
    close: function() {
        this.app.set('settingsShowing', false);
    },
    save: function() {
        var t = this,
            msg = this.app.t('Do you want to save the settings for future use?');

        this.$.ConfirmDialog.confirm(msg, function(confirm) {
            if(confirm) {
                t.app.set('_blockAutoScroll', true);
                t.app.UserConfig.save();
            }
        });
    },
    reset: function() {
        var t = this,
            msg = this.app.t('Are you sure?') + ' ' +
                this.app.t('This will reset the settings to defaults.');

        this.$.ConfirmDialog.confirm(msg, function(confirm) {
            if(confirm) {
                t.app.set('_blockAutoScroll', true);
                t.app.UserConfig.reset();
            }
        });
    },
    showingChanged: function(was, is) {
        this.inherited(arguments);

        if(is) {
            this.$.Language.handleLocaleChange();
            //this.$.render_style.render(); // :X
        }
    },
    listChanged: function(was, is) {
        this.populateList();
        this.$.ListContainer.render();
    },
    ignoreTap: function(inSender, inEvent) {
        inEvent.preventDefault();
        return true;
    },
    localeChanged: function(inSender, inEvent) {
        // this.render();
    },
    handleActiveChanged: function(inSender, inEvent) {
        this.app.debug && this.log(inEvent);
        var value = (inEvent.active) ? inEvent.active.name : null;       

        if(inEvent.originator.name == 'render_style') {
            if(!this.app.UserConfig.get('copy')) {
                this.set('renderStyle', value);
            } else {
                this.set('renderStyle', this.get('renderStyle'));
            }
        }             

        if(inEvent.originator.name == 'font') {
            this.set('font', value);
        }

        if(inEvent.originator.name == 'cross_references_format_group') {
            switch(value) {
                case 'cross_references_format_compact':
                    this.set('crossReferenceFormat', 'compact');
                    break;
                case 'cross_references_format_expand':
                    this.set('crossReferenceFormat', 'expand');
                    break;
                case 'cross_references_format_auto':
                default:
                    this.set('crossReferenceFormat', 'auto');
                    break;
            }
        }

        if(inEvent.originator.name == 'cross_references_mode_group') {
            switch(value) {
                case 'cross_references_hidden':
                    this.set('crossReferencesShow', 'hidden');
                    break;
                case 'cross_references_show':
                    this.set('crossReferencesShow', 'show');
                    break;
                case 'cross_references_toggle':
                default:
                    this.set('crossReferencesShow', 'toggle');
                    break;
            }
        }
    },
});
