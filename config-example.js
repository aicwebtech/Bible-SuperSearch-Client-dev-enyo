var biblesupersearch_config_options = {
    
    // Language code for user interface language
    // If language is not supported, English will display
    // Supported language:
    // * en : English
    // * es : Español
    // * fr: Français
    'language' : 'en',

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

    // Bible SuperSearch skin / interface   (string)
    //      Select an interface below by uncommenting the one that you want to use
    //      For a complete list, please see our demo page
    //          http://www.biblesupersearch.com/skins/
    
    "interface": "Expanding",   

        // Epanding interfaces
        //      Modern interfaces with a minimal amounts of fields showing initially, but can be expanded to show more
            
            // Basic expanding form - new default form
            // "interface": 'Expanding',

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

    // (End interface options)

    // hide format buttons when there is no active search
    "formatButtonsToggle": true,

    // Which formating buttons to use?
    //      default for skin default
    //      Classic
    //      Stylable
    "formatButtons": 'default',        

    // Display extra buttons seprately from format buttons?
    //      Extra buttons include help, SOS dialog, download dialog
    //      'default' for skin default
    //      true
    //      false
    "extraButtonsSeparate": 'default',                         
    
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
    
    // Include toggling to an 'advanced search' form
    // Some interfaces may force this to false
    // Also, this is disabled when formatButtonsToggle above is true
    'toggleAdvanced': false,  
    
    // id of target HTML div tag            (string)
    
    'target': 'biblesupersearch_container',

    // Styles for form sections
    'formStyles': {
        // 'background-color': '#dddddd'
    },
    
    // URL of Bible SuperSearch API         (string)
    //      Note:  You can install the Bible SuperSearch API on your own server
    //             If you do, you will need to change this
    //             Default: https://api.biblesupersearch.com
    
    "apiUrl": "https://api.biblesupersearch.com",

    // URL of destination page
    // If specified, you will be redirected here after submitting form to see results.
    // You will need to have Bible SuperSearch on the destination page for this to work.
    // Destination Page MUST be on the same domain

    "destinationUrl" : null
};
