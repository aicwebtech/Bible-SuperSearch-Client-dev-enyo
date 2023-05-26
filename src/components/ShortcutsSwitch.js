var kind = require('enyo/kind');

var Sel = require('./Select');
var PseudoSel = require('./PseudoSelect/PseudoSelect');

console.log('config options', biblesupersearch_config_options);

// if(typeof biblesupersearch_configs_final) != 'undefined') {

//     console.log('config final', biblesupersearch_configs_final);
// } else {
//     console.log('NO config final')
// }

module.exports = kind({
    name: 'ShortcutsCuts',
    kind: Sel,
});
