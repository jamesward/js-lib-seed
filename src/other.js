/*!

 */
(function () {
  "use strict";
  /*
   This part of the source does not have dependencies on jQuery or the DOM
   */

  define(function () {

    var other = { };

    other.hello = function (name) {
      return "hello, " + name;
    };

    return other;

  });


  if (typeof module != "undefined") {
    module.exports = "other";
  }

}());