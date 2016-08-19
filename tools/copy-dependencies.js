var gulp = require('gulp');
var filter = require('gulp-filter');
var strip = require('gulp-strip-comments');

exports.doCopy = function(source, destination) {
  var filterJS= filter('@angular/**/*.js', {restore: true});
  return gulp.src(source, { base: './node_modules/' })
    .pipe(filterJS)
    .pipe(strip())
    .pipe(filterJS.restore)
    .pipe(gulp.dest(destination));
}
