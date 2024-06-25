// This is the default "main" file, specified from the root package.json file
// The ready function is excuted when the DOM is ready for usage.

var ready = require('enyo/ready');
var App = require('./src/app');
var BSS = null;

ready(function () {
    // console.log('Browser ready now!')
    BSS = new App();

    if(typeof QUnit == 'object') {    
        QUnit.module("Basic Tests");
        QUnit.test("App instantiation", function( assert ) {
            assert.ok( BSS, "We expect the app instance to be truthy 2" );
        });

        // BSS.set('testing', true);
    }
}); 
