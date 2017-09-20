// If the global enyo.Signals is available, use it. This is needed to allow 
// bi-directional communitation with Apps of older Enyo versions
var Signal = require('enyo/Signals');
module.exports = (enyo && enyo.Signals) ? enyo.Signals : Signal;