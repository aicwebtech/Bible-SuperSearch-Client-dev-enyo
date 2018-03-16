// Interface registry
//
// This file tells Bible SuperSearch where to find it's interfaces

module.exports = {
    // Twenty Twenty
    //      Modern, phone app style theme
    'TwentyTwenty': require('./interfaces/twentytwenty/TwentyTwenty'),

    
    // Minimal interfaces
    //      Forms with very few elements
    
        // Minimal - Minimal
        //      Form with only a text input and a submit button
        'Minimal' : require('./interfaces/minimal/MinimalBase'),
        
        // Minimal form with Bible selector (varying size)
        'MinimalWithBible' : require('./interfaces/minimal/MinimalWithBible'),
        
        // Minimal form with Bible selector (always short)
        'MinimalWithShortBible' : require('./interfaces/minimal/MinimalWithShortBible'),

        // Minimal Go Random
        //      Has only text input, submit button and random chapter button
        'MinimalGoRandom' : require('./interfaces/minimal/MinimalGoRandom'),
        
        // Minimal Go Random with Bible
        'MinimalGoRandomBible' : require('./interfaces/minimal/MinimalGoRandomBible'),

        // Minimal Go Random with Parallel Bible
        'MinimalGoRandomParallelBible' : require('./interfaces/minimal/MinimalGoRandomParallelBible'),

    
    // Classic forms - migrated from legacy

        // Classic - Classic (same as Classic User Friendly 2)
        'Classic': require('./interfaces/classic/ClassicBase'),
        
        // Classic User Friendly 1
        'ClassicUserFriendly1': require('./interfaces/classic/UserFriendly1'),        

        // Classic User Friendly 2
        'ClassicUserFriendly2': require('./interfaces/classic/UserFriendly2'),        

        // Classic Parallel 2
        'ClassicParallel2': require('./interfaces/classic/Parallel2'),
        
        // Classic Advanced 
        //      Advanced form used by classic forms
        'ClassicAdvanced': require('./interfaces/classic/Advanced')
    
};
