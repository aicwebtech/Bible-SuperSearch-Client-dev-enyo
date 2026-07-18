var defaultConfig = {
    'target': 'biblesupersearch_container',             // id of HTML div tag
    "apiUrl": "https://api.biblesupersearch.com",       // URL to Bible SuperSearch API
    "apiKey": null,                                     // API access key
    "defaultBible": "kjv",                              // Default Bible selected in first Bible selector
    "bibleGrouping": 'language',                        // Default Bible list grouping
    "bibleSorting": 'rank|name',                        // Default Bible list sorting
    "bibleDefaultLanguageTop": false,                   // Default Bible list sorting
    "languageSelectionEnable": true,                    // Enable Language selection
    "defaultLanguage": "en",                            // (future) Default Language 
    "enabledBibles": [],                                // Order indicates order Bibles will appear
    "interface": "twentytwenty",                        // Bible SuperSearch skin / interface
    "useJSONP": false,                                  // (Future) Use JSONP for cross-site API calls
    "pageScroll": 'instant',
    "pageScrollTopPadding": 0,
    "swipePageChapter": false,
    "arrowKeysPageChapter": false,
    "textDisplayDefault": 'passage',
    "parallelBibleStartSuperceedsDefaultBibles": false,
    'contextLinksAsButtons': true,                      // Whether to show context links as buttons (ie Copy, Share, Context, Cross References) (default: true)
    'landingReferenceDefault': false,
    'hoverDelayThreshold': 500,
    'strongsDialogSearchLink': false,
    'limitSearchManual': false,
    'legacyManual': false,
    'strongsOpenClick': 'mobile',
    'sideSwipeNavHideThresholdTop': 0,
    'sideSwipeNavHideThresholdBottom': 0,
    'useNavigationShare': 'never',
    'historyLimit': 50,
    'bookmarkLimit': 20,
    'testOnLoad': false,
    'testVerbose': false,
    'resultsList': false,
    'resultsListClickScroll': false,
    'changeLanguageClearForm': true,
    'saveUserSettings': false,
    'omitUserLanguage': false,
    'saveUserSettingsManual': false,                   // Whether to require user to save their settings manually (ie via a button)
    'saveUserBibleSelections': false,                  // Whether to save user's selected Bibles with user settings
    'audioBible': false,                               // Enables audio Bible features
    'audioBibleApi': 'biblesupersearch',               // Audio Bible API to use
    'audioBibleApiKey': null,                          // Audio Bible API key
    'audioBibleDisplay': 'threshold',                  // Audio Bible display style: 'narrow' or 'wide' or 'threshold'
    'audioBibleDisplayThreshold': 3,                   // Width threshold for audioBibleDisplay 'threshold' option
    'crossReferenceEnable': false,                     // Enables cross references globally when API feature is available
    'crossReferenceShowDefault': 'toggle',             // Default user setting: hidden | toggle | show
    'crossReferenceFormatDefault': 'auto',             // Default user setting for cross reference list layout: compact | auto | expand
    'crossReferenceLinkIncludeParent': false,          // When true, prepend the "from" (parent) reference first to each cross reference link and "Open All" link
    'crossReferenceLinkNewTab': false,                 // When true, open cross reference links in a new browser tab
    'disableCache': false,                             // When TRUE, breaks cache on API calls (appends random param); FALSE allows caching

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
    },
    _downloadDisabledNotice: function() {
        if(window.console) {
            console.log('----------------------------------------------------------------------');
            console.log('NOTE TO WEBMASTER: Your Bible SuperSearch API instance has Bible downloads disabled.');
            console.log('Please enable this, otherwise important features such as the downloads dialog won\'t work.');
            console.log('----------------------------------------------------------------------');
            console.log();
        }
    }
};

module.exports = defaultConfig;