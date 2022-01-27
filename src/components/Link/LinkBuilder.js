// var kind = require('enyo/kind');

// Generic JavaScript object, not an enyo kind
module.exports = {
    buildReferenceLink: function() {
        // console.log(arguments);

        var mode  = arguments[0] || 'p';
        var bible = arguments[1] || null;
        var book  = arguments[2] || '';
        var chapt = arguments[3] || null;
        var verse = arguments[4] || null;

        var bible = (bible) ? bible.join(',') : '';

        var link = '#/' + mode + '/' + bible + '/' + book;

        if(chapt) {
            link += '/' + chapt;
        }        

        if(verse) {
            link += '/' + verse;
        }

        link = link.replace(/\s+/g, '.');

        return link;
    }
};
