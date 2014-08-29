/*!

 */

/*

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {




}));
  */

/*
This part of the source does not have dependencies on jQuery or the DOM
 */

define(function() {

  var other = { };

  other.hello = function(name) {
    return "hello, " + name;
  };

  return other;

});


if(typeof module != 'undefined') {
  module.exports = "other";
}