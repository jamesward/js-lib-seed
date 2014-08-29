'use strict';

require.config({
  paths: {
    "jquery": "../bower_components/jquery/dist/jquery"
  }
});

define(function(require) {
  var main = require("../src/main");
  var $ = require("jquery");

  describe('main', function() {
    describe('bar', function() {
      it('should change the dom', function() {

        var e = $("<span>").attr("id", "foo");
        e.text("something");

        $("body").append(e);

        e.text().should.equal("something");

        main.bar("#foo");

        e.text().should.equal("hello, world");
      });
    });
  });

});