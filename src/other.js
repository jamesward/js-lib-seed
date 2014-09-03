/*!

 */

/**
 * This is an other module.
 *
 * @module other
 * @class other
 */
(function () {
  "use strict";

  define(function () {

    var other = { };

    /**
     * A simple hello function
     *
     * @method hello
     * @param {String} name A name
     * @return {String} Returns hello, name
     */
    other.hello = function (name) {
      return "hello, " + name;
    };

    return other;

  });


  if (typeof module != "undefined") {
    module.exports = "other";
  }

}());