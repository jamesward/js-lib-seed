/*
LICENSE
 */

(function () {
  "use strict";

  define(["jquery", "./other"], function($, other) {

    var foo = { };

    foo.bar = function(domQuery) {
      var hw = other.hello("world");
      $(domQuery).text(hw);
    };

    return foo;

  });

  if (typeof module != "undefined") {
    module.exports = "foo";
  }

}());

// todo: handle non-amd users (e.g. setup a global)