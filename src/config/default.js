var defaultConfig = {
    'target': 'biblesupersearch_container',             // id of HTML div tag
    "apiUrl": "https://api.biblesupersearch.com/api",   // URL to Bible SuperSearch API
    "defaultBible": "kjv",                              // Default Bible selected in first Bible selector
    "bibleGrouping": 'language',                        // Default Bible list grouping
    "bibleSorting": 'rank|name',                        // Default Bible list sorting
    "defaultLanguage": "en",                            // (future) Default Language 
    "enabledBibles": [],                                // Order indicates order Bibles will appear
    "interface": "twentytwenty",                        // Bible SuperSearch skin / interface
    "useJSONP": false                                   // (Future) Use JSONP for cross-site API calls
};

module.exports = defaultConfig;