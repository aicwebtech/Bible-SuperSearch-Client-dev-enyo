// This file tells Bible SuperSearch where to find it's interfaces
module.exports = {
    'TwentyTwenty': require('./interfaces/twentytwenty/TwentyTwenty'),
    'Classic': require('./interfaces/classic/ClassicBase'),
    'ClassicUserFriendly2': require('./interfaces/classic/UserFriendly2'),
    'ClassicAdvanced': require('./interfaces/classic/Advanced'),
    'Minimal' : require('./interfaces/minimal/MinimalBase')
};
