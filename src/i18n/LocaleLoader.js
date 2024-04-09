module.exports = {
    // ar: require('./ar'), // NEW, trans works, UI needs some work to support RTL languages
    en: require('./en'),
    // en_US: require('./en_US'),
    en_pirate: require('./en_pirate'),
    es: require('./es'),
    et: require('./et'),
    fr: require('./fr'),
    hi: require('./hi'),
    lv: require('./lv'),
    pt: require('./pt'), // NEW
    ro: require('./ro'),
    ru: require('./ru'),
    zh_TW: require('./zh_TW'),
    zh_CN: require('./zh_CN'),

    // Translation strings that allow partial matches.
    // For best results, put longest at top of list
    _partial: [
        'However, verses from this Bible have been included for comparison.',
        'Please remove it, or use it\'s lower case equivalent.',
        'Your search produced no results in',
        'is invalid, and appears to be a passage reference.',
        'You cannot search for these common words',
        'is invalid.',
        'Your search for',
        'Bible text not found',
        'Your search produced no results.',
        'Parallel Bible #',
        'Bible #',
        'Bible text not found',
        'Invalid book in book range',
        'Book not found',
        'Your search was limited to',
        'Please refine your search if necessary',
        'Operators such as',
        'cannot be at the beginning of your search.',
        'cannot be at the end of your search.',
        'searched for',
        'results',
        'faith'
    ]
};