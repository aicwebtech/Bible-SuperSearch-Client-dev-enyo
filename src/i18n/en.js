module.exports = {
    // Intentionally empty?
    meta: {
        lang_name: 'English',
        lang_name_en: 'English',
        isRtl: false,
    },

    // Descriptions of special features
    'strongs_numbers_description': 'Strong\'s Concordance Numbers indicate the underlying Hebrew or Greek words.',  // 5.3
    'italics_description': 'Italics indicate words added in translating that were not in the original language.',    // 5.3
    'red_letter_description': 'Words of Christ in Red.', // 5.3
    'highlight_description': 'Highlighting (bold) of keywords in searches.',  // 5.3

    'History Books': 'History',
    'Prophets Books': 'Prophets',

    // Shortcuts - for languages other than English, this is automatically generated from English
    'shortcuts': [
           {
              "id": 1,
              "name": "Old Testament",
              "short1": "OT",
              "short3": "Old",
              "short2": "Tenakh",
              "reference": "Genesis - Malachi",
              "display": 1
            },
            {
              "id": 2,
              "name": "New Testament",
              "short1": "NT",
              "short2": "New",
              "short3": "New_Testament",
              "reference": "Matthew - Revelation",
              "display": 1
            },
            {
              "id": 3,
              "name": "Law",
              "short1": "Torah",
              "short2": "OT Law",
              "short3": "Moses",
              "reference": "Genesis - Deuteronomy",
              "display": 1
            },
            {
              "id": 4,
              "name": "History Books",
              "short1": "History",
              "short2": null,
              "short3": null,
              "reference": "Joshua - Esther",
              "display": 1
            },
            {
              "id": 5,
              "name": "Wisdom & Poetry",
              "short1": "Wisdom",
              "short2": "Poetry",
              "short3": "Wisdom and Poetry",
              "reference": "Job - Song of Solomon",
              "display": 1
            },
            {
              "id": 6,
              "name": "Prophets Books",
              "short1": "Prophets",
              "short2": "All Prophets",
              "short3": null,
              "reference": "Isaiah - Malachi",
              "display": 1
            },
            {
              "id": 7,
              "name": "Major Prophets",
              "short1": "Major",
              "short2": "Major_Prophets",
              "short3": "MajorProphets",
              "reference": "Isaiah - Daniel",
              "display": 1
            },
            {
              "id": 8,
              "name": "Minor Prophets",
              "short1": "Minor",
              "short2": "Minor_Prophets",
              "short3": "MinorProphets",
              "reference": "Hosea - Malachi",
              "display": 1
            },
            {
              "id": 9,
              "name": "Gospels",
              "short1": "Passion",
              "short2": "Gospel",
              "short3": null,
              "reference": "Matthew - John",
              "display": 1
            },
            {
              "id": 10,
              "name": "Epistles",
              "short1": "Doctrine",
              "short2": "NT Epistles",
              "short3": "All Epistles",
              "reference": "Romans - Jude",
              "display": 1
            },
            {
              "id": 11,
              "name": "Pauline Epistles",
              "short1": "Paul",
              "short2": "Pauline",
              "short3": "Pauline Epistles",
              "reference": "Romans - Hebrews",
              "display": 1
            },
            {
              "id": 12,
              "name": "General Epistles",
              "short1": "General",
              "short2": "General_Epistles",
              "short3": "Epistles General",
              "reference": "James - Jude",
              "display": 1
            },
            {
              "id": 13,
              "name": "End Times Prophecy",
              "short1": "Last Days",
              "short2": "End",
              "short3": "End Times",
              "reference": "Revelation; Daniel; Matthew 24",
              "display": 0
            }
    ],

    'bibleBooks': [
        {
          "id": 1,
          "name": "Genesis",
          "shortname": "Gen",
          "matching": ["Gn"],
        },
        {
          "id": 2,
          "name": "Exodus",
          "shortname": "Ex",
          "matching": ["Exo", "Exod"]
        },
        {
          "id": 3,
          "name": "Leviticus",
          "shortname": "Lev",
          "matching": ["Lv"]
        },
        {
          "id": 4,
          "name": "Numbers",
          "shortname": "Num",
          "matching": ["Nm", "Nu"]
        },
        {
          "id": 5,
          "name": "Deuteronomy",
          "shortname": "Deut",
          "matching": ["Dt"]
        },
        {
          "id": 6,
          "name": "Joshua",
          "shortname": "Josh",
          "matching": ["Jos", "Jsh"],
        },
        {
          "id": 7,
          "name": "Judges",
          "shortname": "Judg",
          "matching": ["Jdg", "Jdgs"]
        },
        {
          "id": 8,
          "name": "Ruth",
          "shortname": "Ru",
          "matching": ["Rth"]
        },
        {
          "id": 9,
          "name": "1 Samuel",
          "shortname": "1 Sam",
          "matching": [
                "1Samuel",
                "1Sm",
                "1 Sm", 
                "I Samuel", 
                "First Samuel", 
                "I Sm", 
                "1st Sm",
                "1st Samuel"
            ]
        },
        {
          "id": 10,
          "name": "2 Samuel",
          "shortname": "2 Sam",
            "matching": [
                "2Samuel",
                "2Sm",
                "2 Sm", 
                "II Samuel", 
                "Second Samuel", 
                "II Sm", 
                "2nd Sm",
                "2nd Samuel"
            ]

        },
        {
          "id": 11,
          "name": "1 Kings",
          "shortname": "1 Ki",
          "matching": [
                "1Kings", 
                "1Kgs", 
                "1 Kgs", 
                "First Kings", 
                "I Kings", 
                "1st Ki", 
                "1st Kings"
            ],
        },
        {
          "id": 12,
          "name": "2 Kings",
          "shortname": "2 Ki",
          "matching": [
                "2Kings", 
                "2Kgs", 
                "2 Kgs", 
                "Second Kings", 
                "II Kings", 
                "2nd Ki", 
                "2nd Kings"
            ],
        },
        {
          "id": 13,
          "name": "1 Chronicles",
          "shortname": "1 Chron",
          "matching": [
                "1Chronicles", 
                "First Chronicles", 
                "1st Chron", 
                "1st Chronicles"
            ],
        },
        {
          "id": 14,
          "name": "2 Chronicles",
          "shortname": "2 Chron",
          "matching": [
                "2Chronicles", 
                "Second Chronicles", 
                "2nd Chron", 
                "2nd Chronicles"
            ],
        },
        {
          "id": 15,
          "name": "Ezra",
          "shortname": "Ezra"
        },
        {
          "id": 16,
          "name": "Nehemiah",
          "shortname": "Neh"
        },
        {
          "id": 17,
          "name": "Esther",
          "shortname": "Esth"
        },
        {
          "id": 18,
          "name": "Job",
          "shortname": "Job",
          "matching": ["Jb"],
        },
        {
          "id": 19,
          "name": "Psalms",
          "shortname": "Ps"
        },
        {
          "id": 20,
          "name": "Proverbs",
          "shortname": "Prov",
          "matching": ["Prv"]
        },
        {
          "id": 21,
          "name": "Ecclesiastes",
          "shortname": "Ecc"
        },
        {
          "id": 22,
          "name": "Song of Solomon",
          "shortname": "SOS",
          "matching": ["Song of Songs", "Canticle of Canticles"],
        },
        {
          "id": 23,
          "name": "Isaiah",
          "shortname": "Isa"
        },
        {
          "id": 24,
          "name": "Jeremiah",
          "shortname": "Jer",
          "matching": ["Jr"]
        },
        {
          "id": 25,
          "name": "Lamentations",
          "shortname": "Lam"
        },
        {
          "id": 26,
          "name": "Ezekiel",
          "shortname": "Eze",
          "matching": ["Ezk"]
        },
        {
          "id": 27,
          "name": "Daniel",
          "shortname": "Dan",
          "matching": ["Dn"]
        },
        {
          "id": 28,
          "name": "Hosea",
          "shortname": "Hos"
        },
        {
          "id": 29,
          "name": "Joel",
          "shortname": "Joel"
        },
        {
          "id": 30,
          "name": "Amos",
          "shortname": "Amos"
        },
        {
          "id": 31,
          "name": "Obadiah",
          "shortname": "Obad"
        },
        {
          "id": 32,
          "name": "Jonah",
          "shortname": "Jon"
        },
        {
          "id": 33,
          "name": "Micah",
          "shortname": "Micah"
        },
        {
          "id": 34,
          "name": "Nahum",
          "shortname": "Nah"
        },
        {
          "id": 35,
          "name": "Habakkuk",
          "shortname": "Hab",
        },
        {
          "id": 36,
          "name": "Zephaniah",
          "shortname": "Zeph"
        },
        {
          "id": 37,
          "name": "Haggai",
          "shortname": "Hag",
          "matching": ["Hg"]
        },
        {
          "id": 38,
          "name": "Zechariah",
          "shortname": "Zech"
        },
        {
          "id": 39,
          "name": "Malachi",
          "shortname": "Mal"
        },
        {
          "id": 40,
          "name": "Matthew",
          "shortname": "Matt",
          "matching": ["Mt"]
        },
        {
          "id": 41,
          "name": "Mark",
          "shortname": "Mark",
          "matching": ["Mk"],
        },
        {
          "id": 42,
          "name": "Luke",
          "shortname": "Luke",
          "matching": ["Lk", "Lu"]
        },
        {
          "id": 43,
          "name": "John",
          "shortname": "John",
          "matching": ["Jn"]
        },
        {
          "id": 44,
          "name": "Acts",
          "shortname": "Acts"
        },
        {
          "id": 45,
          "name": "Romans",
          "shortname": "Rom",
          "matching": ["Rm"]
        },
        {
          "id": 46,
          "name": "1 Corinthians",
          "shortname": "1 Cor",
          "matching": ["1Corinthians", "First Corinthians", "I Corinthians", "1st Corinthians"]
        },
        {
          "id": 47,
          "name": "2 Corinthians",
          "shortname": "2 Cor",
          "matching": ["2Corinthians", "Second Corinthians", "II Corinthians", "2nd Corinthians"]
        },
        {
          "id": 48,
          "name": "Galatians",
          "shortname": "Gal"
        },
        {
          "id": 49,
          "name": "Ephesians",
          "shortname": "Eph"
        },
        {
          "id": 50,
          "name": "Philippians",
          "shortname": "Phil",
          "matching": ["Php"],
        },
        {
          "id": 51,
          "name": "Colossians",
          "shortname": "Col"
        },
        {
          "id": 52,
          "name": "1 Thessalonians",
          "shortname": "1 Thess",
          "matching": ["1Thessalonians", "First Thessalonians", "I Thessalonians", "1st Thessalonians"]
        },
        {
          "id": 53,
          "name": "2 Thessalonians",
          "shortname": "2 Thess",
          "matching": ["2Thessalonians", "Second Thessalonians", "II Thessalonians", "2nd Thessalonians"]
        },
        {
          "id": 54,
          "name": "1 Timothy",
          "shortname": "1 Tim",
          "matching": ["1Timothy", "First Timothy", "I Timothy", "1st Timothy"]
        },
        {
          "id": 55,
          "name": "2 Timothy",
          "shortname": "2 Tim",
          "matching": ["2Timothy", "Second Timothy", "II Timothy", "2nd Timothy"]
        },
        {
          "id": 56,
          "name": "Titus",
          "shortname": "Titus"
        },
        {
          "id": 57,
          "name": "Philemon",
          "shortname": "Phm",
          "matching": ["Phlm"]
        },
        {
          "id": 58,
          "name": "Hebrews",
          "shortname": "Heb",
          "matching": ["Hbr"]
        },
        {
          "id": 59,
          "name": "James",
          "shortname": "Jas",
          "matching": ["Jm"]
        },
        {
          "id": 60,
          "name": "1 Peter",
          "shortname": "1 Pet",
          "matching": ["1Peter", "1Pt", "1 Pt", "1st Pt", "I Peter", "First Peter", "1st Peter"]
        },
        {
          "id": 61,
          "name": "2 Peter",
          "shortname": "2 Pet",
          "matching": ["2Peter", "2Pt", "2 Pt", "2nd Pt", "II Peter", "Second Peter", "2nd Peter"]
        },
        {
          "id": 62,
          "name": "1 John",
          "shortname": "1 John",
          "matching": ["1Jn", "1 Jn", "1John", "1st Jn", "I John", "First John", "1st John"]
        },
        {
          "id": 63,
          "name": "2 John",
          "shortname": "2 John",
          "matching": ["2Jn", "2 Jn", "2John", "2nd Jn", "II John", "Second John", "2nd John"]
        },
        {
          "id": 64,
          "name": "3 John",
          "shortname": "3 John",
          "matching": ["3Jn", "3 Jn", "3John", "3rd Jn", "III John", "Third John", "3rd John"]
        },
        {
          "id": 65,
          "name": "Jude",
          "shortname": "Jude"
        },
        {
          "id": 66,
          "name": "Revelation",
          "shortname": "Rev",
          "matching": ["Rv", "Apocalypse", "The Revelation"]
        }
    ]

};
