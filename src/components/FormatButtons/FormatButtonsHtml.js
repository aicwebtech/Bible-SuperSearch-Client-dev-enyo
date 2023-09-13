var kind = require('enyo/kind');
var Button = require('enyo/Button');
var Input = require('enyo/Input');
var TextArea = require('enyo/TextArea');
var Checkbox = require('enyo/Checkbox');
var Base = require('./FormatButtonsBase');
var Toggle = require('../ToggleHtml');
var Image = require('../Image');
var i18n = require('../Locale/i18nContent');

var LocaleSelectorNew = require('../Locale/LocaleSelector');
var LocaleSelectorOld = require('../Locale/LocaleSelectorOld');

module.exports = kind({
    name: 'FormatButtonsHtml',
    kind: Base,
    classes: 'format_buttons_html',
    font: null,
    
    components: [
        {classes: 'bss_button_group', name: 'TextSizeGroup', components: [
            {
                kind: i18n,
                classes: 'item size size_plus',
                name: 'size_plus',
                tag: 'span',
                val: 'plus',
                ontap: 'handleSizeChange',
                components: [
                    {kind: i18n, content: 'A'},
                    {tag: 'span', content: '+'},
                ],
                attributes: {
                    title: 'Enlarge Text'
                }
            },      
            {
                kind: i18n,
                classes: 'item size size_reg',
                name: 'size_reg',
                val: 'reg',
                ontap: 'handleSizeChange',
                tag: 'span',
                attributes: {
                    title: 'Default Text Size',
                },
                components: [
                    {tag: 'span', content: '&nbsp;', allowHtml: true},
                    {kind: i18n, content: 'A'},
                    {tag: 'span', content: '&nbsp;', allowHtml: true},
                ]
            },  
            {
                kind: i18n,
                classes: 'item size size_minus',
                name: 'size_minus',
                val: 'minus',
                ontap: 'handleSizeChange',
                tag: 'span',
                components: [
                    {kind: i18n, content: 'A'},
                    {tag: 'span', content: '-'},
                ],
                attributes: {
                    title: 'Shrink Text'
                }
            },
        ]},

        {classes: 'bss_button_group', name: 'FontStyleGroup', components: [
            {
                kind: i18n,
                classes: 'item font font_serif',
                name: 'font_serif',
                ontap: 'handleFontChange',
                val: 'serif',
                tag: 'span',
                attributes: {
                    title: 'Serif'
                },
                components: [
                    {kind: i18n,  content: 'Abc'}
                ]
            },        
            {
                kind: i18n,
                classes: 'item font font_sans_serif',
                name: 'font_sans_serif',
                ontap: 'handleFontChange',
                val: 'sans_serif',
                tag: 'span',
                attributes: {
                    title: 'Sans-Serif',
                },
                components: [
                    {kind: i18n, content: 'Abc'}
                ]
            },
            {
                kind: i18n,
                classes: 'item font font_monospace',
                name: 'font_monospace',
                ontap: 'handleFontChange',
                val: 'monospace',
                tag: 'span',
                attributes: {
                    title: 'Monospace',
                },
                components: [
                    {kind: i18n, content: 'Abc'}
                ],
            },
        ]},

        {classes: 'bss_button_group', name: 'TextDisplayGroup', components: [
            {
                kind: i18n,
                classes: 'item renderstyle paragraph',
                name: 'renderstyle_paragraph',
                val: 'paragraph',
                tag: 'span',
                content: '&para;',
                allowHtml: true,
                ontap: 'handleRenderStyle',
                attributes: {
                    title: 'Paragraph Display'
                }
            },        
            {
                kind: i18n,
                classes: 'item renderstyle passage',
                name: 'renderstyle_passage',
                val: 'passage',
                tag: 'span',
                ontap: 'handleRenderStyle',
                components: [
                    {tag: 'span', content: '&nbsp;&nbsp;---- -', allowHtml: true},
                    {tag: 'span', content: '', allowHtml: true},
                    {tag: 'span', content: '- -------', allowHtml: true},
                    {tag: 'span', content: '- -------', allowHtml: true},
                    {tag: 'span', content: '- -------', allowHtml: true},
                    {tag: 'span', content: '- -------', allowHtml: true},
                ],
                attributes: {
                    title: 'Passage Display'
                }
            },        
            {
                kind: i18n,
                classes: 'item renderstyle verse',
                name: 'renderstyle_verse',
                val: 'verse',
                tag: 'span',
                ontap: 'handleRenderStyle',
                components: [
                    {tag: 'span', content: '- -.- -----', allowHtml: true},
                    {tag: 'span', content: '- -.- -----', allowHtml: true},
                    {tag: 'span', content: '- -.- -----', allowHtml: true},
                    {tag: 'span', content: '- - - -----', allowHtml: true},
                    {tag: 'span', content: ''},
                    {tag: 'span', content: ''},
                    {tag: 'span', content: ''}
                ],
                attributes: {
                    title: 'Verse Display'
                }
            },            
            {
                kind: i18n,
                classes: 'item renderstyle verse_passage',
                name: 'renderstyle_verse_passage',
                val: 'verse_passage',
                tag: 'span',
                ontap: 'handleRenderStyle',
                components: [
                    {tag: 'span', content: '&nbsp; &nbsp;---- -', allowHtml: true},
                    {tag: 'span', content: '----------', allowHtml: true},
                    {tag: 'span', content: '&nbsp; &nbsp;---- -', allowHtml: true},
                    {tag: 'span', content: '----------', allowHtml: true},
                    {tag: 'span', content: '&nbsp; &nbsp;---- -', allowHtml: true},
                    {tag: 'span', content: '----------', allowHtml: true},
                    {tag: 'span', content: '', allowHtml: true},
                ],
                attributes: {
                    title: 'Verse As Passage Display'
                }
            },

        ]},
        
        {classes: 'bss_button_group', name: 'TextEmbGroup1', components: [
            {
                classes: 'item italics_toggle',
                name: 'italics_toggle',
                kind: Toggle,         
                trueTitle: 'Disable Italization of Added Words',
                falseTitle: 'Enable Italization of Added Words',
                trueComponent: {
                    components: [
                        {tag: 'span', classes: 'block_enabled', content: '&#10003;', allowHtml: true},
                        {kind: i18n, tag: 'span', content: 'Italics'}
                    ]
                },        
                falseComponent: {
                    components: [
                        {tag: 'span', classes: 'block_disabled', allowHtml: true},
                        {kind: i18n, tag: 'span', content: 'Italics'}
                    ]
                }
            },        
            {
                classes: 'item strongs_toggle',
                name: 'strongs_toggle',
                kind: Toggle,        
                trueTitle: 'Disable Strong\'s Numbers',
                falseTitle: 'Enable Strong\'s Numbers',
                trueComponent: {
                    components: [
                        {tag: 'span', classes: 'block_enabled', content: '&#10003;', allowHtml: true},
                        {tag: 'span', content: 'Strong&rsquo;s', allowHtml: true}
                    ]
                },        
                falseComponent: {
                    components: [
                        {tag: 'span', classes: 'block_disabled', allowHtml: true},
                        {tag: 'span', content: 'Strong&rsquo;s', allowHtml: true}
                    ]
                }
            },   
        ]},
        {classes: 'bss_button_group', name: 'TextEmbGroup2', components: [     
            {
                classes: 'item redletter_toggle',
                name: 'redletter_toggle',
                kind: Toggle,         
                trueTitle: 'Disable Red Letter',
                falseTitle: 'Enable Red Letter', 
                trueComponent: {
                    components: [
                        {tag: 'span', classes: 'block_enabled', content: '&#10003;', allowHtml: true},
                        {kind: i18n, tag: 'span', content: 'Red Letter'}
                    ]
                },        
                falseComponent: {
                    components: [
                        {tag: 'span', classes: 'block_disabled', allowHtml: true},
                        {kind: i18n, tag: 'span', content: 'Red Letter'}
                    ]
                }
            },
            {
                classes: 'item highlight_toggle',
                name: 'highlight_toggle',
                kind: Toggle,         
                trueTitle: 'Disable Highlighting of Keywords',
                falseTitle: 'Enable Highlighting of Keywords',
                trueComponent: {
                    components: [
                        {tag: 'span', classes: 'block_enabled', content: '&#10003;', allowHtml: true},
                        // {tag: 'span', classes: 'material-icons icon', content: 'highlight'}
                        {kind: i18n, tag: 'span', content: 'Highlight'}
                    ]
                },        
                falseComponent: {
                    components: [
                        {tag: 'span', classes: 'block_disabled', allowHtml: true},
                        // {tag: 'span', classes: 'material-icons icon', content: 'highlight'}
                        {kind: i18n, tag: 'span', content: 'Highlight'}
                    ]
                }
            },    
        ]},
        {classes: 'bss_button_group', name: 'SmallButtonsGroup1', components: [
            // copy instantly button
            {tag: 'span', components: [
                {
                    classes: 'item',
                    name: 'copy_instant',
                    kind: i18n,
                    content: 'Copy',
                    ontap: 'handleCopyInstant',
                    style: 'position: relative',
                    // title: 'Copy with given copy settings', 
                    attributes: {title: 'Copy'},
                    components: [
                        {
                            kind: i18n, 
                            tag: 'span', 
                            classes: 'material-icons icon', 
                            content: 'content_copy',
                            // title: 'Copy'
                        }
                    ]
                },
            ]},
            {
                classes: 'item copy_toggle_new',
                name: 'copy_toggle',
                kind: Toggle,            
                trueTitle: 'Read Display',
                falseTitle: 'EZ Copy',
                trueComponent: {
                    components: [
                        // {tag: 'span', classes: 'buttons', content: '<< < = > >>', allowHtml: true},
                        // {tag: 'span', content: '', allowHtml: true},
                        // {tag: 'span', content: '- &ndash;&mdash;&ndash;', allowHtml: true},
                        // {tag: 'span', content: '- &ndash;&mdash;&ndash;', allowHtml: true}

                        {tag: 'span', classes: 'material-icons icon', content: 'book'}
                        // {tag: 'span', classes: 'material-icons icon', content: 'bookvisibility'}
                    ]
                },
                falseComponent: {
                    components: [
                        /*
                        {tag: 'span', content: '- ------', allowHtml: true},
                        {tag: 'span', content: '- ------', allowHtml: true},
                        {tag: 'span', content: '- ------', allowHtml: true},
                        {tag: 'span', content: '- ------', allowHtml: true},
                        // {tag: 'span', content: '- &mdash;&ndash;-&ndash;', allowHtml: true},
                        // {tag: 'span', content: '- &mdash;&ndash;-&ndash;', allowHtml: true},
                        // {tag: 'span', content: '- -&ndash;&mdash;&ndash;', allowHtml: true},
                        // {tag: 'span', content: '- &ndash;&ndash;&mdash;-', allowHtml: true},
                        {tag: 'span', content: ''},
                        {tag: 'span', content: ''},
                        {tag: 'span', content: ''},
                        */

                        {tag: 'span', classes: 'material-icons icon', content: 'content_copypageview'}
                    ]
                },
            },  
            {
                kind: i18n,
                classes: 'item clear_form',
                name: 'clear',
                tag: 'span',
                ontap: 'handleClearForm',
                attributes: {title: 'Clear Form'},
                components: [
                    {tag: 'span', classes: 'material-icons icon', content: 'clear'}
                ]
            },
            {
                kind: i18n,
                classes: 'item print text_only',
                name: 'print_button',
                ontap: 'handlePrint',
                attributes: {title: 'Print'},
                components: [
                    {tag: 'span', classes: 'material-icons icon', content: 'print'}
                ],
            },        
            {
                kind: i18n,
                classes: 'item share text_only',
                name: 'share_button',
                ontap: 'handleShare',
                attributes: {title: 'Share'},
                components: [
                    {tag: 'span', classes: 'material-icons icon', content: 'share'}
                ],
            },        
            {
                kind: i18n,
                classes: 'item link text_only',
                name: 'link_button',
                ontap: 'handleLink',
                attributes: {title: 'Link'},
                components: [
                    {tag: 'span', classes: 'material-icons icon', content: 'link'}
                ],
            },
            {
                kind: i18n,
                showing: false,
                classes: 'item settings text_only',
                name: 'settings_button',
                ontap: 'handleSettings',
                attributes: {title: 'Settings'},
                components: [
                    {tag: 'span', classes: 'material-icons icon', content: 'settings'}
                ],
            },      
        ]},

        {classes: 'bss_button_group', components: [
            // 'Extra' (non-formatting) buttons
            {
                kind: i18n,
                classes: 'item help',
                name: 'help',
                tag: 'span',
                ontap: 'handleHelp',
                attributes: {title: 'Help'},
                components: [
                    {tag: 'b', content: '?'}
                ]
            },
            {
                classes: 'item advanced_toggle',
                name: 'advanced_toggle',
                kind: Toggle,
                trueTitle: 'Basic',
                falseTitle: 'Advanced',
                trueContent: 'Basic',
                falseContent: 'Advanced'
            },
            {
                kind: i18n,
                classes: 'item sos',
                name: 'sos_button',
                content: 'Bible SOS',
                ontap: 'handleSos',
                attributes: {title: 'Emergency Help from the Bible'}
            },        
            {
                kind: i18n,
                classes: 'item start',
                name: 'start_button',
                content: 'Start',
                ontap: 'handleStart',
                attributes: {title: 'Bible Start Guide'}
            },        
            {
                kind: i18n,
                classes: 'item download',
                name: 'download_button',
                ontap: 'handleDownload',
                attributes: {title: 'Bible Downloads'},
                components: [
                    {tag: 'span', classes: 'material-icons icon', content: 'download'}
                ]
            },        
            // End Extra buttons
        ]}, 
        {
            classes: 'item language',
            name: 'language_selector',
            // components: [
            //     {name: 'Locale', kind: LocaleSelector}
            // ]
        }

        // {classes: 'input_row_wide', components: [
        // ]}
    ],

    bindings: [    
        {from: 'app.UserConfig.paragraph', to: '$.paragraph_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons paragraph_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},         
        {from: 'app.UserConfig.copy', to: '$.copy_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons copy_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},        
        {from: 'app.UserConfig.single_verses', to: '$.single_verse_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons copy_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},             
        {from: 'app.UserConfig.advanced_toggle', to: '$.advanced_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons advanced_toggle', value, dir);
            return value;
            // return (value && value != 0 && value != false) ? true : false;
        }},           
        {from: 'app.UserConfig.italics', to: '$.italics_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons italics', value, dir);
            return value;
        }},         
        {from: 'app.UserConfig.strongs', to: '$.strongs_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons strongs', value, dir);
            return value;
        }},             
        {from: 'app.UserConfig.red_letter', to: '$.redletter_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons red_letter', value, dir);
            return value;
        }},
        {from: 'app.UserConfig.highlight', to: '$.highlight_toggle.value', oneWay: false, transform: function(value, dir) {
            // console.log('FormatButtons red_letter', value, dir);
            return value;
        }}, 
        {from: 'app.UserConfig.font', to: 'font', oneWay: true, transform: function(value, dir) {
            // console.log('FormatButtons font', value, dir);
            this.$.font_serif.addRemoveClass('selected', value == 'serif');
            this.$.font_sans_serif.addRemoveClass('selected', value == 'sans_serif' || value == 'sans-serif');
            this.$.font_monospace.addRemoveClass('selected', value == 'monospace');
            return value;
        }}
    ],

    create: function() {
        this.inherited(arguments);

        if(!this.app.statics.download_enabled) {
            this.$.download_button.set('showing', false);
        }

        // todo - use new selector for locale selector here (needs styling)
        //var LS = this.app.get('useNewSelectors') ? LocaleSelectorNew : LocaleSelectorOld;
        var LS = LocaleSelectorOld;

        this.$.language_selector.createComponent({
            name: 'Locale',
            kind: LS,
            owner: this
        });
    }, 
    rendered: function() {
        this.inherited(arguments);

        if(this._hideExtras()) {
            this.$.sos_button && this.$.sos_button.set('showing', false);
            this.$.start_button && this.$.start_button.set('showing', false);
            this.$.download_button && this.$.download_button.set('showing', false);
            this.$.advanced_toggle && this.$.advanced_toggle.set('showing', false);
            this.$.help && this.$.help.set('showing', false);
        }
    }
});
