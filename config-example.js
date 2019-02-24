var biblesupersearch_config_options = {
    
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
    
    
    // Bible SuperSearch skin / interface   (string)
    //      For a complete list, please see our demo page
    //          http://www.biblesupersearch.com/skins/
    
    "interface": "Classic",   

    // hide format buttons when there is no active search
    "formatButtonsToggle": true,

    // Which formating buttons to use?
    //      default for skin default
    //      Classic
    //      Stylable
    "formatButtons": 'default',                          
    
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
    'toggleAdvanced': false,  
    
    // id of target HTML div tag            (string)
    
    'target': 'biblesupersearch_container',

    // Styles for form sections
    'formStyles': {
        // 'background-color': '#dddddd'
    },
    
    // URL of Bible SuperSearch API         (string)
    
    "apiUrl": "https://api.biblesupersearch.com",

    // URL of destination page
    // If specified, you will be redirected here after submitting form to see results.
    // You will need to have Bible SuperSearch on the destination page for this to work.
    // Destination Page MUST be on the same domain

    "destinationUrl" : null
};
