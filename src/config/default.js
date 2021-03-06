var defaultConfig = {
    'target': 'biblesupersearch_container',             // id of HTML div tag
    "apiUrl": "https://api.biblesupersearch.com",       // URL to Bible SuperSearch API
    "defaultBible": "kjv",                              // Default Bible selected in first Bible selector
    "bibleGrouping": 'language',                        // Default Bible list grouping
    "bibleSorting": 'rank|name',                        // Default Bible list sorting
    "defaultLanguage": "en",                            // (future) Default Language 
    "enabledBibles": [],                                // Order indicates order Bibles will appear
    "interface": "twentytwenty",                        // Bible SuperSearch skin / interface
    "useJSONP": false,                                  // (Future) Use JSONP for cross-site API calls


    _urlDefaultNotice: function() {
        if(window.console) {
            console.log('----------------------------------------------------------------------');
            console.log('NOTE TO WEBMASTER: You are using the primary Bible SuperSearch API.');
            console.log('This requires a connection between your website and ours.');
            console.log('We recommend installing the Bible SuperSearch API on your website.');
            console.log('For details, please visit: https://www.biblesupersearch.com/api');
            console.log('Download for FREE: https://www.biblesupersearch.com/downloads/');
            console.log('----------------------------------------------------------------------');
            console.log();
        }
    },
    _urlLocalNotice: function() {
        if(window.console) {
            console.log('Congratulations, you are successfully using your own instance of the Bible SuperSearch API!');
        }
    }
};

module.exports = defaultConfig;