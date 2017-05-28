// This is the default "main" file, specified from the root package.json file
// The ready function is excuted when the DOM is ready for usage.

var ready = require('enyo/ready');
var App = require('./src/app');

ready(function () {
    new App();
});
    