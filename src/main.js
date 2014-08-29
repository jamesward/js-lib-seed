/*
LICENSE
 */

define(["jquery", "./other"], function($, other) {

  var foo = { };

  foo.bar = function(domQuery) {
    var hw = other.hello("world");
    $(domQuery).text(hw);
  };

  return foo;

});

// todo: handle non-amd users (e.g. setup a global)