var i18n = require('enyo/i18n');
var locales = require('../i18n/LocaleLoader');
var defaultLocale = 'en';
var locale = biblesupersearch_config_options.locale || defaultLocale;
var fallbackLocale = locale.substring(0, 2);

// var locales = {
//     en: require('../i18n/en'),
//     en_US: require('../i18n/en_US'),
//     es: require('../i18n/es')
// };

i18n.$L = function(string, vars) {
    console.log('locale', locale);

    if(locales[locale] && locales[locale][string]) {
        return locales[locale][string];
    }
    
    if(locales[fallbackLocale] && locales[fallbackLocale][string]) {
        return locales[fallbackLocale][string];
    }

    // return string;
    return 'chicken';
}

module.exports = i18n;