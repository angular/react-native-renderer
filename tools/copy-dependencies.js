var gulp = require('gulp');
var filter = require('gulp-filter');
var strip = require('gulp-strip-comments');
var through2 = require('through2');

exports.doCopy = function(source, destination) {
  var filterJS= filter('angular2/**/*.js', {restore: true});
  var tmpHack = filter('reflect-metadata/Reflect.js', {restore: true});
  return gulp.src(source, { base: './node_modules/' })
    .pipe(filterJS)
    .pipe(strip())
    .pipe(filterJS.restore)
    .pipe(tmpHack)
    .pipe(transformReflect())
    .pipe(tmpHack.restore)
    .pipe(gulp.dest(destination));
}

function transformSymbolShim() {
  return through2.obj(function (file, encoding, done) {
    file.contents = new Buffer(fixedSymbolShim);
    this.push(file);
    done();
  });
}

function transformReflect() {
  return through2.obj(function (file, encoding, done) {
    var content = String(file.contents).replace('&& require("crypto")', '');
    file.contents = new Buffer(content);
    this.push(file);
    done();
  });
}
