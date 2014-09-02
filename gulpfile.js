var gulp = require("gulp"),
  path = require("path"),
  gutil = require("gulp-util"),
  pkgJson = require("./package.json"),
  bowerJson = require("./bower.json");

var SRC      = "src";
var SRC_JS   = path.join(SRC, "**", "*.js");
var TEST     = "test";
var TEST_JS  = path.join(TEST, "**", "*.js");
var DIST     = "dist";


// Help
gulp.task("help", function(next) {
  gutil.log("--- " + pkgJson.name + " ---");
  gutil.log("");
  gutil.log("See all of the available tasks:");
  gutil.log("$ gulp -T");
  gutil.log("");
  // TODO
  next();
});


// Default
gulp.task("default", ["help"]);


// Create a dist
gulp.task("dist", ["rjs"], function() {

  return null;

});


// Run rjs on the source
gulp.task("rjs", ["update-deps"], function() {

  var sourcemaps = require("gulp-sourcemaps");
  
  var bowerMains = require("main-bower-files")();

  // ugly way to try and get the module id - not sure if this works for all modules
  var mainName = function(fullPath) {
    var pathParts = fullPath.split("/");
    var i = pathParts.indexOf("bower_components");
    return pathParts[i + 1];
  };

  // mutates the object to add attribute: path"s name = path
  var mainMap = function(fullPath, o) {
    if (fullPath.indexOf(".js") == fullPath.length - 3) {
      // strip the .js suffix if it is there
      fullPath = fullPath.slice(0, -3);
    }
    o[mainName(fullPath)] = fullPath;
  };

  var opts = {};
  opts.paths = {};
  bowerMains.forEach(function(fullPath) {
    mainMap(fullPath, opts.paths);
  });
  opts.exclude = bowerMains.map(function(fullPath) {
    return mainName(fullPath);
  });

  return gulp.src(SRC_JS)
    .pipe(require("amd-optimize")("main", opts))
    .pipe(sourcemaps.init())
    .pipe(require("gulp-concat")(bowerJson.main))
    .pipe(require("gulp-uglify")())
    .pipe(sourcemaps.write(".", {sourceRoot: SRC}))
    .pipe(gulp.dest(DIST));

});


// Run the tests
gulp.task("test", ["check"], function() {
  return gulp.src("test/index.html")
    .pipe(require("gulp-mocha-phantomjs")());
});


// Continuous Test - Rerun tests when srcs or tests change
gulp.task("~test", ["test"], function() {
  continuous("test");
});


// Lint the src and tests
gulp.task("check", ["update-deps"], function() {
  var jshint = require("gulp-jshint");

  return gulp.src([SRC_JS, TEST_JS])
    .pipe(jshint())
    .pipe(jshint.reporter(require("jshint-stylish")))
});


// Continuous Test - Rerun tests when srcs or tests change
gulp.task("~check", ["check"], function() {
  continuous("check");
});


// Clean the DIST dir
gulp.task("clean", function() {
  return gulp.src([DIST, ".build"], {read: false})
    .pipe(require("gulp-clean")());
});


// Updates the Bower dependencies based on the bower.json file
gulp.task("update-deps", function(next) {

  var needsUpdate = false;

  return gulp.src("bower.json")
    .pipe(require("gulp-newer")(".build"))
    .pipe(gulp.dest(".build")) // todo: don"t do this if the bower install fails
    .on("close", function() {
      if (!needsUpdate) {
        next();
      }
    })
    .on("error", function(error) {
      if (!needsUpdate) {
        next(error);
      }
    })
    .on("data", function() {
      // updated bower.json
      needsUpdate = true;
      gutil.log("Updating Bower Dependencies");
      require("bower").commands.install([], {}, { interactive: false })
        .on("end", function () {
          gutil.log("Bower Dependencies Updated");
          //next();
        })
        .on("log", function (log) {
          if (log.level == "action" && log.id == "install") {
            gutil.log("Added Bower Dependency: " + log.message);
          }
        })
        .on("error", function (error) {
          gutil.log("Bower Error: ", error);
          next(error);
        });
    });

});



var continuous = function(task) {
  gulp.watch([SRC_JS, TEST_JS], [task]);
  gulp.watch("bower.json", ["update-deps"]);
};