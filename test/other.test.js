/*
LICENSE
 */

(function() {
  "use strict";
  
  define(function(require) {
    var other = require("../src/other");
  
    describe("other", function() {
      describe("hello", function() {
        it("should return the correct string", function() {
          other.hello("world").should.equal("hello, world");
        });
      });
    });
  
  });

}());