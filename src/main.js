/*
LICENSE
 */

/**
 * This is a foo module.  It can be used with AMD/RequireJS or standalone.
 *
 * @module foo
 * @class foo
 */
(function () {
  "use strict";

  define(["jquery", "./other"], function($, other) {

    var foo = { };

    /**
     * Replaces the contents of the dom element(s) specified by a jQuery selector with a sample string
     *
     * @example
     *     var foo = require("foo");
     *
     *     // The contents of the <body> will be replaced with "hello, world"
     *     foo.bar("body");
     *
     * @method bar
     * @param {String} domQuery The jQuery selector
     * @static
     *
     */
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