/*!

 */

/**
 * @module other
 */
(function () {
  "use strict";
  /*
   This part of the source does not have dependencies on jQuery or the DOM
   */

  /**
   * @class other
   */
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