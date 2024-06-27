module.exports = {
    success: {
        'Basic Reference': {
            formData: {
                '_reference': 'Romans 1'
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
        'Basic Search': {
            formData: {
                '_search': 'faith',
                page_limit: 30,
            },
            resultsContain: {
                paging: {
                    "current_page": 1,
                    "last_page": 12,
                    "per_page": 30,
                    "from": 1,
                    "to": 30,
                    "total": 338
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
                '_reference': 'Romans'
            },
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
                '_reference': '1 Hesitations 3'
            }
        },
        'Basic Search': {
            formData: {
                '_search': 'aabbcc'
            } 
        }
    },
}