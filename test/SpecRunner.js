require.config({
  paths: {
    "mocha": "../node_modules/gulp-mocha-phantomjs/node_modules/mocha-phantomjs/node_modules/mocha/mocha",
    "chai": "../node_modules/chai/chai"
  },
  shim: {
    mocha: {
      exports: 'mocha'
    }
  }
});

define(function(require) {
  var chai = require('chai');
  var mocha = require("mocha");

  mocha.setup('bdd');

  var should = chai.should();

  require(["./other.test.js", "./main.test.js"], function() {
    if (window.mochaPhantomJS) {
      mochaPhantomJS.run();
    }
    else {
      mocha.run();
    }
  });

});