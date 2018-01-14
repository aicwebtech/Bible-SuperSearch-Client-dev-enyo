var biblesupersearch_config_options = {
    
    // Default Bible                        (string)
    //
    //      Automatically selected in first Bible selector
    //      Must be the 'module' of the desired Bible version
    //      See the API documentation for a list of Bibles
    //          https://api.biblesupersearch.com/documentation

    "defaultBible": "kjv",                              
    
    
    // Enabled Bibles                       (array of strings)
    //
    //      List of Bible 'modules' to show in the Bible selectors
    //      Comment out to enable all Bibles available
    //      Order indicates order Bibles will appear

    // "enabledBibles": ["kjv", "tr", "bishops"],                                
    
    
    // Bible SuperSearch skin / interface   (string)
    
    "interface": "Classic",                             
    
    
    // id of target HTML div tag            (string)
    
    'target': 'biblesupersearch_container',
    
    
    // URL of Bible SuperSearch API         (string)
    
    "apiUrl": "https://api.biblesupersearch.com/api",

};
