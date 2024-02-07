var biblesupersearch_config_options = {
   
    
    // URL of Bible SuperSearch API         (string)
    //      Note:  You can install the Bible SuperSearch API on your own server
    //             If you do, you will need to change this
    //             Default: https://api.biblesupersearch.com
    
    "apiUrl": "https://api.biblesupersearch.com",


    // API Key, if needed.  (Not required.)
    "apiKey": '',

    // Language code for user interface language
    // If language selected is not supported, English will display
    // Supported language:
    // * en : English
    // * es : Español / Spanish
    // * et : Eesti / Estonian
    // * fr: Français / French
    // * fr: हिन्दी, हिंदी / Hindi
    // * lv: Latviešu / Latvian
    // * ro: Română / Romanian
    // * ru: Русский / Russian
    // * zh_TW: 繁體中文 / Chinese - Traditional
    // * zh_CN: 简体中文 / Chinese - Simplfied

    'language' : 'en',

    // Languages available to be selected by user
    // Comment out to show all available languages.
    // See supported languages above
    'languageList': ['en', 'ru', 'lv', 'es'],

    // Bible books language source
    // 'ui': Display book names in language selected in UI (Reccomended) (Default)
    // 'bible' : Display book names in language of First selected Bible (Legacy - was never fully implemented)
    'bibleBooksLanguageSource': 'ui', 


    // Default Bible                        (string)
    //
    //      Automatically selected in first Bible selector
    //      Must be the 'module' of the desired Bible version
    //      See the API documentation for a list of available Bibles
    //          https://api.biblesupersearch.com/documentation

    "defaultBible": "kjv",                              
    
    // Enabled Bibles                       (array of strings)
    //
    //      List of Bible 'modules' to show in the Bible selectors
    //      Comment out to enable all Bibles available
    //      Order indicates order Bibles will appear
    //      See the API documentation for a list of available Bibles
    //          https://api.biblesupersearch.com/documentation

    // "enabledBibles": ["kjv", "tr", "bishops"], 

    // Bible Change Update Navigation (v5.3)
    // Whether to update navigation (ie paging and browsing buttons) immediately when the selected 
    // Bible(s) are changed to reflect the new Bible selections.
    // Otherwise, the navication will not update until the search or look up is performed.
    "bibleChangeUpdateNavigation": false,

    // Bible List Grouping
    // Options: 
    // 'language' - Group by language (endonym) (Not supported if API version is < 4.2, and will fall back to English name)
    // 'language_english' - Group by language's English name
    // 'language_and english' - Group by language (endonym), with language's English name
    //  'none' - no grouping
    "bibleGrouping": 'language',          

    // Bible List Sorting
    // Specified as a string of options, separated by |
    // Options:
    // 'name' - Bible full name
    // 'shortname' - Bible short name
    // 'lang_name' - Language (endonym)
    // 'lang_name_english' - Language (English name)
    // 'rank' - Rank / Sort Order specified on API

    // Default: 'rank|name',
    "bibleSorting": 'rank|name',       

    // If bible list is being sorted or grouped by language, 
    // this places the default langauge at top of Bible list.
    "bibleDefaultLanguageTop": false,

    // If the parallel Bible limit is dynamically changed (ie by an expanding interface, or by limits set by parallelBibleLimitByWidth below)
    // should we remove Bible selections above the new limit?
    'parallelBibleCleanUpForce': false,

    // If true, the number of parallel Bible selectors displayed initially ALWAYS equals the start Bibles number
    // Regardless to the number of Bibles selected as default
    'parallelBibleStartSuperceedsDefaultBibles': false,

    // Controls the number of parallel Bibles available based on screen width
    // set to false to completely disable.
    // minWidth and maxBibles must be in ascending order across each config, otherwise the entire config is ignored
    "parallelBibleLimitByWidth": [
        // {
        //     'minWidth': 0,       // Minimum width, in pixels.  Default: 0,
        //     'maxBibles': 2,     // Maximum number of parallel Bible selectors displayed.  Default: 1.
        //     'minBibles': 1,     // Minimum number of parallel Bible selectors displayed.  Default: 1.
        //     'startBibles': 1    // Number of parallel Bible selectors to be displayed when first page first loaded.  Default: 1.
        // },
        // {
        //     'minWidth': 250, 
        //     'maxBibles': 3,
        //     'minBibles': 1,
        //     'startBibles': 1
        // },
        // {
        //     'minWidth': 500, 
        //     'maxBibles': 4,
        //     'minBibles': 1,
        //     'startBibles': 2
        // },        
        // {
        //     'minWidth': 1000, 
        //     'maxBibles': 6,
        //     'minBibles': 2,
        //     'startBibles': 2
        // },
        // {
        //     'minWidth': 1500, 
        //     'maxBibles': 'max',   // 'max' presents the maximim parallel Bibles allowed by the selected skin
        //     'minBibles': 2,
        //     'startBibles': 4
        // },
    ],


    // Include Testament ("Old Testament" or "New Testament") in some references
    "includeTestament": false,  // true or false   

    // Landing Reference(s), 
    // Any valid Bible reference, ie 'John 3:16; Romans 3:23; Genesis 1'
    // When app is first loaded, these reference(s) will automatically be retrieved
    // Form will remain blank, and URL will not change.
    "landingReference": '',

    // Autocomplete Settings

    // Whether to enable auto-complete
    "autocompleteEnable": false,

    // Minimum characters for autocomplete to be triggered
    "autocompleteThreshold": 2,

    // Whether to match anywhere in the given option / Book name
    // If false, we only match at the beginning of the name
    "autocompleteMatchAnywhere": true,

    // Maximum number of autocomplete options to show at once.
    "autocompleteMaximumOptions": 10,

    // Bible SuperSearch skin / interface   (string)
    //      Select an interface below by uncommenting the one that you want to use
    //      For a complete list, please see our demo page
    //          http://www.biblesupersearch.com/skins/
    
    "interface": "Expanding",   

        // Expanding interfaces
        //      Modern interfaces with a minimal amounts of fields showing initially, but can be expanded to show more
            
            // Basic expanding form - new default form
            // "interface": 'Expanding',

            // Expanding form having larger text entry boxes
            "interface": 'ExpandingLargeInput',

        // Bible Browsing / reading interfaces.
        //      Modern interfaces designed for reading and browsing the Bible.
        //      These only have a minimal amount of fields, and no search fields.
            // Has a down selector to select book, then chapter.
            // "interface": 'BrowsingBookSelector',            
            // Has a down selector to select book, then chapter.  Fields presented horizontally.
            // "interface": 'BrowsingBookSelectorHorizontal',

            // Lists out all the books
            // "interface": 'BrowsingBookList,


        // Minimal interfaces
        //      Forms with very few elements
        
            // Minimal - Minimal
            //      Form with only a text input and a submit button
            // "interface": 'Minimal',
            
            // Minimal form with Bible selector (varying size)
            // "interface": 'MinimalWithBible',  

            // Minimal form with Bible selector (Wide but varying size)
            // "interface": 'MinimalWithBibleWide',
            
            // Minimal form with Bible selector (always short)
            // "interface": 'MinimalWithShortBible',

            // Minimal with Parallel Bible
            //      Has only text input, multiple Bible selector and submit button 
            // "interface": 'MinimalWithParallelBible',
            
            // Minimal Go Random
            //      Has only text input, submit button and random chapter button
            // "interface": 'MinimalGoRandom',
            
            // Minimal Go Random with Bible
            //      Has only text input, single Bible selector, submit button and random chapter button
            // "interface": 'MinimalGoRandomBible',

            // Minimal Go Random with Parallel Bible
            //      Has only text input, multiple Bible selector, submit button and random chapter button
            // "interface": 'MinimalGoRandomParallelBible',            


        // Classic forms - migrated from legacy

            // Classic - Classic (alias of 'Classic User Friendly 2')
            // "interface": 'Classic',
            
            // Classic User Friendly 1
            // "interface": 'ClassicUserFriendly1',     

            // Classic User Friendly 2
            // "interface": 'ClassicUserFriendly2', 

            // Classic Parallel 2
            // "interface": 'ClassicParallel2',
            
            // Classic Advanced 
            //      Advanced form used by classic forms
            // "interface": 'ClassicAdvanced',

        // Custom Forms - made per customer request
        
            // Classic User Friendly 2 with Book Selector
            // "interface": 'CustomUserFriendly2BookSel', 

    // (End interface options)

    // hide format buttons when there is no active search
    "formatButtonsToggle": true,

    // Which formating buttons to use?
    //      default - for skin default
    //      Classic - (legacy classic icons from v2 - deprecated)
    //      Stylable - Pure HTML / CSS buttons that are readily stylable
    //      StylableNarrow - Stylable buttons wrapped onto multiple lines even on wide screens
    //      StylableMinimal - A minimal set of stylable buttons, with an settings dialog containging the rest of the settings
    //      none - Format buttons disabled, never show
    "formatButtons": 'default',        

    // How to display extra buttons?
    //      Extra buttons include help, SOS dialog, download dialog
    //      default for skin default
    //      format - Display with format buttons 
    //      separate - Display separatly on the form (some interfaces don't support this)
    //      none - do not display at all
    //      Note: for backward compatiblity, if extraButtonsSeparate is provided, that value will be used and this will be ignored.
    //          (extraButtonsSeparate must be //commented out below for this to work.)
    "extraButtonsDisplay": 'default',       

    // (Deprecated, use extraButtonsDisplay) Display extra buttons seprately from format buttons?
    //      Extra buttons include help, SOS dialog, download dialog
    //      'default' for skin default
    //      true
    //      false
    //      none - do not display at all
    // "extraButtonsSeparate": 'default',                         
    
    // Which navigation buttons to use?
    //      default for skin default
    //      Classic
    //      Stylable
    "navigationButtons": 'default',      

    // Which pager to use?
    //      default for skin default
    //      Classic
    //      Clean
    "pager": 'default',         

    // Page Scroll 
    //      When the page loads or query executes, 
    //      how to scroll the page up to top of results
    //      instant (default)
    //      smooth
    //      none (no scroll)
    'pageScroll' : 'instant',                   

    // Page Scroll Top Padding
    //      When page scrolls, scroll down by this amount 
    //      Usefull to prevent hiding behind menus, ect
    'pageScrollTopPadding': 0,           
    
    // Default Text Display.
    // Users can change this via general settings or copy settings
    // Options: paragraph, passage, verse, verse_passage
    'textDisplayDefault': 'passage',

    // Enable changing chapter and search page via horizontal touchscreen swipe gesture 
    "swipePageChapter": false,

    // Experimental, not yet production ready!
    // Enable changing chapter and search page via horizontal arrow keys
    'arrowKeysPageChapter': false,

    // Time, in milliseconds, to wait after hovering before opening a hover dialog (ie Strongs)
    'hoverDelayThreshold': 500,

    // Click to open Strong's dialog
    // Whether clicking on Strong's number will open the dialog, otherwise clicking the link will search for the Strong's
    // Options: 
    //  'none': Clicking link always searches
    //  'mobile': Clicking link opens dialog for mobile devices only
    //  'always': Clicking link always opens dialog
    'strongsOpenClick': 'mobile',

    // When clicking the Strongs # opens the dialog, should we show a button to access the original search by Strongs # link?
    'strongsDialogSearchLink': false,

    'historyLimit': 50, // Maximum number of history items.

    // Bookmarks
    'bookmarkLimit': 20, // Maximum number of bookmarks.
    

    // Include toggling to an 'advanced search' form
    // Some interfaces may force this to false
    // Also, this is disabled when formatButtonsToggle above is true
    'toggleAdvanced': false,  

    // Whether to include a link to the legacy User's Manual (English only) from the quick start dialog
    'legacyManual': false,
    
    // id of target HTML div tag            (string)
    
    'target': 'biblesupersearch_container',

    // Styles for form sections
    'formStyles': {
        // 'background-color': '#dddddd'
    },

    // URL of destination page
    // If specified, you will be redirected here after submitting form to see results.
    // You will need to have Bible SuperSearch on the destination page for this to work.
    // Destination Page MUST be on the same domain

    "destinationUrl" : null
};
