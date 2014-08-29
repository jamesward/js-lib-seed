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


/*
function compileJavaScript() {
  var jshint = require("gulp-jshint");
  return gulp.src(SRC)
    .pipe(jshint())
    .pipe(jshint.reporter(require("jshint-stylish")))
    .pipe(gulp.dest(DIST));
}
*/

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
    .pipe(sourcemaps.write(".", {sourceRoot: "/src"}))
    .pipe(gulp.dest(DIST));

});

gulp.task("test", ["update-deps"], function() {

  return gulp.src('test/index.html')
    .pipe(require('gulp-mocha-phantomjs')());

});

/*
// Run JSHint on all of the app/js files and concatenate everything together
function compileJavaScript() {
  var jshint = require("gulp-jshint");
  return gulp.src(SRC)
    .pipe(jshint())
    .pipe(jshint.reporter(require("jshint-stylish")))
    .pipe(gulp.dest(DIST));
}

gulp.task("compile:javascript", ["update"], function() {
  return compileJavaScript();
});

// Uglify the JS
gulp.task("dist:javascript", ["update"], function() {
  return compileJavaScript()
    .pipe(rename({ suffix: ".min" }))
    .pipe(require("gulp-ngmin")()) // ngmin makes angular injection syntax compatible with uglify
    .pipe(require("gulp-uglify")())
    .pipe(gulp.dest(DIST_JAVASCRIPT));
});

// Copy Bower assets
gulp.task("copy-bower", ["update"], function() {
  return gulp.src("bower_components/**")
    .pipe(gulp.dest(DIST_LIB));
});

// Compile everything
gulp.task("compile", ["compile:javascript"]);


// Dist everything
gulp.task("dist", ["copy-bower", "dist:html", "dist:less", "dist:javascript", "dist:images"]);

*/

// Clean the DIST dir
gulp.task("clean", function() {
  return gulp.src([DIST, ".build"], {read: false})
    .pipe(require("gulp-clean")());
});


/*

// Server that serves static content from DIST
gulp.task("server", ["compile"], function(next) {
  var port = process.env.PORT || 5000;
  var connect = require("connect");
  var server = connect();
  server.use(connect.static(DIST)).listen(port, next);
  gutil.log("Server up and running: http://localhost:" + port);
});


// Auto-Reloading Development Server
gulp.task("dev", ["server"], function() {

  gulp.watch(SRC_ALL, ["compile"]);
  gulp.watch("bower.json", ["copy-bower"]);

  var lrserver = require("gulp-livereload")();

  gulp.watch(DIST_ALL).on("change", function(file) {
    lrserver.changed(file.path);
  });

});


// Prod Server
gulp.task("prod", ["server", "dist"]);
*/


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


// Help
gulp.task("help", function(next) {
  gutil.log("--- " + pkgJson.name + " ---");
  gutil.log("");
  gutil.log("See all of the available tasks:");
  gutil.log("$ gulp -T");
  gutil.log("");
  gutil.log("Run a dev mode server:");
  gutil.log("$ gulp dev");
  gutil.log("");
  gutil.log("Run a prod mode server:");
  gutil.log("$ gulp prod");
  next();
});


// Default
gulp.task("default", ["help"]);