module.exports = {
    success: {
        'Basic Reference': {
            formData: {
                '_reference': 'Romans 1',
                bible: ['kjv']
            },
            resultsContain: {
                results: {               
                    0: {
                        book_id: 45,
                        verses_count: 32,
                    }
                }
            }
        },
        'Search With Page': {
            formData: {
                '_search': 'faith',
                page_limit: 30,
                // page: 3,
                bible: ['kjv']
            },
            willFailOnInterface: [
                // Browsing interfaces will fail on any test that performs a search
                'BrowsingBookSelector',
                'BrowsingBookSelectorHorizontal'
            ],
            resultsContain: {
                paging: {
                    "current_page": 1,
                    // "current_page": 3,
                    "last_page": 12,
                    "per_page": 30,
                    "from": 1,
                    "to": 30,
                    "total": 338
                }
            }
        },    
        'Basic Search': {
            formData: {
                '_search': 'Faith hope',
                page_limit: 30,
                bible: ['kjv']
            },
            willFailOnInterface: [
                // Browsing interfaces will fail on any test that performs a search
                'BrowsingBookSelector',
                'BrowsingBookSelectorHorizontal',
                'ClassicAdvanced'
            ],
            resultsContain: {
                paging: {
                    "current_page": 1,
                    "last_page": 1,
                    "per_page": 30,
                    "from": 1,
                    "to": 9,
                    "total": 9
                }
            }
        },       
        // BROKE - any test search with a search_type other than and/boolean!
        // 'Search with Search Type': {
        //     formData: {
        //         '_search': 'Faith hope',
        //         search_type: 'any_word',
        //         page_limit: 30,
        //         bible: ['kjv']
        //     },
        //     willFailOnInterface: [
        //         // Browsing interfaces will fail on any test that performs a search
        //         'BrowsingBookSelector',
        //         'BrowsingBookSelectorHorizontal'
        //     ],
        //     resultsContain: {
        //         paging: {
        //             "current_page": 1,
        //             "last_page": 16,
        //             "per_page": 30,
        //             "from": 1,
        //             "to": 30,
        //             "total": 462
        //         }
        //     }
        // },            
        'Search with Whole Words': {
            formData: {
                '_search': 'Faith hope',
                whole_words: true,
                page_limit: 30,
                bible: ['kjv']
            },
            willFailOnInterface: [
                // Browsing interfaces will fail on any test that performs a search
                'BrowsingBookSelector',
                'BrowsingBookSelectorHorizontal'
            ],
            resultsContain: {
                paging: {
                    "current_page": 1,
                    "last_page": 1,
                    "per_page": 30,
                    "from": 1,
                    "to": 8,
                    "total": 8
                }
            }
        },             
        // 'Search with Exact Case': {
        //     formData: {
        //         '_search': 'Faith hope',
        //         exact_case: true,
        //         search_type: 'any_word',
        //         page_limit: 30,
        //         bible: ['kjv']
        //     },
        //     willFailOnInterface: [
        //         // Browsing interfaces will fail on any test that performs a search
        //         'BrowsingBookSelector',
        //         'BrowsingBookSelectorHorizontal'
        //     ],
        //     resultsContain: {
        //         paging: {
        //             "current_page": 1,
        //             "last_page": 5,
        //             "per_page": 30,
        //             "from": 1,
        //             "to": 30,
        //             "total": 135
        //         }
        //     }
        // },         
        'Proximity Search: Mixed Limits': {
            formData: {
                '_search': 'faith PROX(2) joy PROX(5) love',
                page_limit: 30,
                search_type: 'boolean',
                bible: ['kjv']
            },
            willFailOnInterface: [
                // Browsing interfaces will fail on any test that performs a search
                'BrowsingBookSelector',
                'BrowsingBookSelectorHorizontal',
                'ClassicAdvanced',
            ],
            resultsContain: {
                paging: {
                    "total": 37
                }
            }
        },        
        // 'Search Page': {
        //     formData: {
        //         '_search': 'faith',
        //         // page_limit: 50,
        //         page: 3
        //     },
        //     resultsContain: {
        //         paging: {
        //             "current_page": 3,
        //             "last_page": 12,
        //             "per_page": 30,
        //             "from": 61,
        //             "to": 90,
        //             "total": 338
        //         }
        //     }
        // },       
        'Search and Reference': {
            formData: {
                '_search': 'faith',
                '_reference': 'Romans',
                bible: ['kjv']
            },
            willFailOnInterface: [
                // Browsing interfaces will fail on any test that performs a search
                // 'BrowsingBookSelector',
                // 'BrowsingBookSelectorHorizontal',
                // // Minimal interfaces will fail on any test combining search and reference
                // 'Minimal',
                // 'MinimalWithBible',
                // 'MinimalWithBibleWide',
                // 'MinimalWithShortBible',
                // 'MinimalWithParallelBible',
                // 'MinimalGoRandom',
                // 'MinimalGoRandomBible',
                // 'MinimalGoRandomParallelBible',
            ],
            resultsContain: {
                paging: {
                    "current_page": 1,
                    "last_page": 2,
                    "per_page": 30,
                    "from": 1,
                    "to": 30,
                    "total": 34
                }
            }
        }
    },
    error: {
        'Basic Reference': {
            formData: {
                '_reference': '1 Hesitations 3',
                bible: ['kjv'],
            }
        },
        'Basic Search': {
            willFailOnInterface: [
                'ClassicAdvanced',
            ],
            formData: {
                '_search': 'aabbcc',
                bible: ['kjv']
            } 
        }
    },
}