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
    classes: 'bss_format_buttons_html',
    font: null,
    
    components: [
        {classes: 'bss_button_group', name: 'TextSizeGroup', components: [
            {
                kind: i18n,
                classes: 'bss_item bss_size bss_size_plus',
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
                classes: 'bss_item bss_size bss_size_reg',
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
                classes: 'bss_item bss_size bss_size_minus',
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
                classes: 'bss_item bss_font bss_font_serif',
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
                classes: 'bss_item bss_font bss_font_sans_serif',
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
                classes: 'bss_item bss_font bss_font_monospace',
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
                classes: 'bss_item bss_renderstyle bss_paragraph',
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
                classes: 'bss_item bss_renderstyle bss_passage',
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
                classes: 'bss_item bss_renderstyle bss_verse',
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
                classes: 'bss_item bss_renderstyle bss_verse_passage',
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
                    title: 'Verse as Passage Display'
                }
            },

        ]},
        
        {classes: 'bss_button_group', name: 'TextEmbGroup1', components: [
            {
                classes: 'bss_item bss_italics_toggle',
                name: 'italics_toggle',
                kind: Toggle,         
                trueTitle: 'Disable Italization of Added Words',
                falseTitle: 'Enable Italization of Added Words',
                trueComponent: {
                    components: [
                        {tag: 'span', classes: 'bss_block_enabled', content: '&#10003;', allowHtml: true},
                        {kind: i18n, tag: 'span', content: 'Italics'}
                    ]
                },        
                falseComponent: {
                    components: [
                        {tag: 'span', classes: 'bss_block_disabled', allowHtml: true},
                        {kind: i18n, tag: 'span', content: 'Italics'}
                    ]
                }
            },        
            {
                classes: 'bss_item bss_strongs_toggle',
                name: 'strongs_toggle',
                kind: Toggle,        
                trueTitle: 'Disable Strong\'s Numbers',
                falseTitle: 'Enable Strong\'s Numbers',
                trueComponent: {
                    components: [
                        {tag: 'span', classes: 'bss_block_enabled', content: '&#10003;', allowHtml: true},
                        {tag: 'span', content: 'Strong&rsquo;s', allowHtml: true}
                    ]
                },        
                falseComponent: {
                    components: [
                        {tag: 'span', classes: 'bss_block_disabled', allowHtml: true},
                        {tag: 'span', content: 'Strong&rsquo;s', allowHtml: true}
                    ]
                }
            },   
        ]},
        {classes: 'bss_button_group', name: 'TextEmbGroup2', components: [     
            {
                classes: 'bss_item bss_redletter_toggle',
                name: 'redletter_toggle',
                kind: Toggle,         
                trueTitle: 'Disable Red Letter',
                falseTitle: 'Enable Red Letter', 
                trueComponent: {
                    components: [
                        {tag: 'span', classes: 'bss_block_enabled', content: '&#10003;', allowHtml: true},
                        {kind: i18n, tag: 'span', content: 'Red Letter'}
                    ]
                },        
                falseComponent: {
                    components: [
                        {tag: 'span', classes: 'bss_block_disabled', allowHtml: true},
                        {kind: i18n, tag: 'span', content: 'Red Letter'}
                    ]
                }
            },
            {
                classes: 'bss_item bss_highlight_toggle',
                name: 'highlight_toggle',
                kind: Toggle,         
                trueTitle: 'Disable Highlighting of Keywords',
                falseTitle: 'Enable Highlighting of Keywords',
                trueComponent: {
                    components: [
                        {tag: 'span', classes: 'bss_block_enabled', content: '&#10003;', allowHtml: true},
                        // {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'highlight'}
                        {kind: i18n, tag: 'span', content: 'Highlight'}
                    ]
                },        
                falseComponent: {
                    components: [
                        {tag: 'span', classes: 'bss_block_disabled', allowHtml: true},
                        // {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'highlight'}
                        {kind: i18n, tag: 'span', content: 'Highlight'}
                    ]
                }
            },    
        ]},
        {classes: 'bss_button_group', name: 'SmallButtonsGroup1', components: [
            // copy instantly button
            {tag: 'span', components: [
                {
                    classes: 'bss_item',
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
                            classes: 'bss-material-icons bss_icon', 
                            content: 'content_copy',
                            // title: 'Copy'
                        }
                    ]
                },
            ]},
            {
                classes: 'bss_item bss_copy_toggle_new',
                name: 'copy_toggle',
                kind: Toggle,            
                trueTitle: 'Read Display',
                falseTitle: 'EZ Copy',
                trueComponent: {
                    components: [
                        // {tag: 'span', classes: 'bss_buttons', content: '<< < = > >>', allowHtml: true},
                        // {tag: 'span', content: '', allowHtml: true},
                        // {tag: 'span', content: '- &ndash;&mdash;&ndash;', allowHtml: true},
                        // {tag: 'span', content: '- &ndash;&mdash;&ndash;', allowHtml: true}

                        {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'book'}
                        // {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'bookvisibility'}
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

                        {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'content_copypageview'}
                    ]
                },
            },  
            {
                kind: i18n,
                classes: 'bss_item bss_clear_form',
                name: 'clear',
                tag: 'span',
                ontap: 'handleClearForm',
                attributes: {title: 'Clear Form'},
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'clear'}
                ]
            },
        ]},
        {classes: 'bss_button_group', name: 'PrintShareGroup', components: [
            {
                kind: i18n,
                classes: 'bss_item bss_print bss_text_only',
                name: 'print_button',
                ontap: 'handlePrint',
                attributes: {title: 'Print'},
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'print'}
                ],
            },        
            {
                kind: i18n,
                classes: 'bss_item bss_share bss_text_only',
                name: 'share_button',
                ontap: 'handleShare',
                attributes: {title: 'Share'},
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'share'}
                ],
            },        
            {
                kind: i18n,
                classes: 'bss_item bss_link bss_text_only',
                name: 'link_button',
                ontap: 'handleLink',
                attributes: {title: 'Link'},
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'link'}
                ],
            },
            {
                kind: i18n,
                classes: 'bss_item bss_link bss_text_only',
                name: 'history_button',
                ontap: 'handleHistory',
                attributes: {title: 'History'},
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'history'}
                ],
            },            
            {
                kind: i18n,
                classes: 'bss_item bss_link bss_text_only',
                name: 'bookmark_add_button',
                ontap: 'handleBookmarkCurrent',
                attributes: {title: 'Bookmark'},
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'bookmark_add'}
                ],
            },            
            {
                kind: i18n,
                classes: 'bss_item bss_link bss_text_only',
                name: 'bookmark_button',
                ontap: 'handleBookmark',
                attributes: {title: 'Bookmarks'},
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'bookmarks'}
                ],
            },
            {
                kind: i18n,
                classes: 'bss_item bss_link bss_text_only',
                showing: false,
                name: 'settings_reset_button',
                ontap: 'handleResetSetting',
                attributes: {title: 'Reset'},
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'restart_alt'}
                ],
            },
            {
                kind: i18n,
                showing: false,
                classes: 'bss_item bss_settings bss_text_only',
                name: 'settings_button',
                ontap: 'handleSettings',
                attributes: {title: 'Settings'},
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'settings'}
                ],
            },      
        ]},

        {classes: 'bss_button_group', components: [
            // 'Extra' (non-formatting) buttons
            {
                kind: i18n,
                classes: 'bss_item bss_help',
                name: 'help',
                tag: 'span',
                ontap: 'handleHelp',
                attributes: {title: 'Help'},
                components: [
                    {tag: 'b', content: '?'}
                ]
            },
            {
                classes: 'bss_item bss_advanced_toggle',
                showing: false,
                name: 'advanced_toggle',
                kind: Toggle,
                trueTitle: 'Basic',
                falseTitle: 'Advanced',
                trueContent: 'Basic',
                falseContent: 'Advanced'
            },
            {
                kind: i18n,
                classes: 'bss_item bss_sos',
                name: 'sos_button',
                content: 'Bible SOS',
                ontap: 'handleSos',
                attributes: {title: 'Emergency Help from the Bible'}
            },        
            {
                kind: i18n,
                classes: 'bss_item bss_start',
                name: 'start_button',
                content: 'Start',
                ontap: 'handleStart',
                attributes: {title: 'Bible Start Guide'}
            },        
            {
                kind: i18n,
                classes: 'bss_item bss_download',
                name: 'download_button',
                ontap: 'handleDownload',
                attributes: {title: 'Bible Downloads'},
                components: [
                    {tag: 'span', classes: 'bss-material-icons bss_icon', content: 'download'}
                ]
            },        
            // End Extra buttons
        ]}, 
        {
            classes: 'bss_item bss_language',
            name: 'language_selector',
            // components: [
            //     {name: 'Locale', kind: LocaleSelector}
            // ]
        }

        // {classes: 'bss_input_row_wide', components: [
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

            if(dir == 2) {
                var rscache = value ? 'read_render_style' : 'copy_render_style';
                var rs = this.app.UserConfig.get('render_style');
                this.app.UserConfig.set(rscache, rs);
            }

            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 

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
        {from: 'app.UserConfig.font', to: 'font', oneWay: true, transform: function(value, dir) {
            // console.log('FormatButtons font', value, dir);
            this.$.font_serif.addRemoveClass('selected', value == 'serif');
            this.$.font_sans_serif.addRemoveClass('selected', value == 'sans_serif' || value == 'sans-serif');
            this.$.font_monospace.addRemoveClass('selected', value == 'monospace');
            dir == 2 && this.app.userConfigChanged(); // Shouldn't have to do this, but model change event NOT working on WP ... 
            return value;
        }}
    ],

    create: function() {
        this.inherited(arguments);

        if(!this.app.statics.download_enabled) {
            this.$.download_button.set('showing', false);
        }

        if(!this.app.configs.bookmarksEnable || this.app.configs.bookmarksEnable == 'false') {
            this.$.bookmark_add_button.set('showing', false);
            this.$.bookmark_button.set('showing', false);
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
